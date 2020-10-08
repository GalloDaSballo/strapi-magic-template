'use strict';
const _ = require('lodash')
const pluginId = require("../pluginId")

const { Magic } = require('@magic-sdk/admin');

/**
 * Given a ctx, retrieve the bearer token
 * @param  ctx 
 */
const retrieveJWTToken = (ctx) => {
    const params = _.assign({}, ctx.request.body, ctx.request.query);

    let token = '';

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
        const parts = ctx.request.header.authorization.split(' ');

        if (parts.length === 2) {
            const scheme = parts[0];
            const credentials = parts[1];
            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        } else {
            throw new Error(
                'Invalid authorization header format. Format is Authorization: Bearer [token]'
            );
        }
    } else if (params.token) {
        token = params.token;
    } else {
        throw new Error('No authorization header was found');
    }

    return (token);
};


/**
 * magic-v1.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */


const getStore =  () => (
  strapi.store({
    environment: strapi.config.environment,
    type: 'plugin',
    name: pluginId
}))

module.exports = {
    setKey: async (sk) => {
        const pluginStore = getStore()
        pluginStore.set({ key: 'sk', value: sk })

    },

    getKey: async () => {
        const pluginStore = getStore()
        const value = pluginStore.get({ key: 'sk'})

        return value
    },
    loginWithMagic: async (ctx, useCrypto) => {
        const MAGIC_KEY = await strapi.plugins[pluginId].services[pluginId].getKey()

        if(!MAGIC_KEY) {
            console.log("no key")
            return false
        }
        console.log("MAGIC_KEY", MAGIC_KEY)

        const magic = new Magic(MAGIC_KEY);

        /** USE MAGIC LINK */
        console.log('Trying with magic');
        try{
            const token = retrieveJWTToken(ctx);
            const issuer = await magic.token.getIssuer(token);
            const magicUser = await magic.users.getMetadataByIssuer(issuer);


            ctx.state.user = await strapi.plugins['users-permissions'].services.user.fetch({
                email: useCrypto ? magicUser.publicAddress : magicUser.email
            });


            if(!ctx.state.user){
                console.log('There was no user, creating it');
                try{
                    const roles = await strapi.plugins['users-permissions'].services.userspermissions.getRoles();
                    const authRoles = roles[0]; //Authenticated role
                    ctx.state.user = await strapi.plugins['users-permissions'].services.user.add({
                        username: useCrypto ? magicUser.publicAddress : magicUser.email,
                        email: useCrypto ? magicUser.publicAddress : magicUser.email,
                        role: authRoles,
                        confirmed: true,
                        provider: 'magic'
                    });
                } catch(err){
                    console.log('Exception in user creation in permissions', err);
                }
            }
            console.log('ctx.state.user?', ctx.state.user);
            return ctx.state.user

        } catch(err){
            throw err
        }
    }
};
