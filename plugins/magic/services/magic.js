'use strict';
const _ = require('lodash')
const pluginId = require("../pluginId")

const { Magic } = require('@magic-sdk/admin')

/**
 * Given a ctx, retrieve the bearer token
 * @param {any} ctx
 */
const retrieveJWTToken = (ctx) => {
    const params = _.assign({}, ctx.request.body, ctx.request.query)

    let token = ''

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
        const parts = ctx.request.header.authorization.split(' ')

        if (parts.length === 2) {
            const scheme = parts[0];
            const credentials = parts[1];
            if (/^Bearer$/i.test(scheme)) {
                token = credentials
            }
        } else {
            throw new Error(
                'Invalid authorization header format. Format is Authorization: Bearer [token]'
            )
        }
    } else if (params.token) {
        token = params.token
    } else {
        throw new Error('No authorization header was found')
    }

    return (token)
};


/**
 * magic-v1.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

/**
 * Retrieve the strapi data storage for the plugin
 */
const getStore =  () => (
  strapi.store({
    environment: strapi.config.environment,
    type: 'plugin',
    name: pluginId
}))

module.exports = {
    /**
     * Update the Magic Private Key
     * @param {string} sk - Magic Secret Key
     */
    setKey: async (sk) => {
        if(process.env.MAGIC_KEY){
            throw new Error("MAGIC_KEY is Injected by .env")
        }
        const pluginStore = getStore()
        pluginStore.set({ key: 'sk', value: sk })
    },

    /**
     * Retrieve the Private Key
     * @returns {string} sk - Magic Secret Key
     */
    getKey: async () => {
        const pluginStore = getStore()
        const value = pluginStore.get({ key: 'sk'})
        if(process.env.MAGIC_KEY){
            return process.env.MAGIC_KEY
        }

        return value
    },
    /**
     * Given the Context uses the Magic SDK to verify if the current request was done with a valid and active Bearer Token
     * @param {any} ctx - Request Context
     * @param {boolean} useCrypto - Whether to use the address as primary key.
     * If useCrypto is true we will be using the publicAddress as primary key
     * If useCrypto is false we will use the email as primary key
     */
    loginWithMagic: async (ctx, useCrypto) => {
        /** If user is already logged in, with current setup this happens only if you are in /admin */
        if(ctx.state.user){
            return true
        }
        /** USE MAGIC LINK */
        try{
            const MAGIC_KEY = await strapi.plugins[pluginId].services[pluginId].getKey()

            if(!MAGIC_KEY || !MAGIC_KEY.length) {
                throw new Error("No magic key, please set it up in the admin panel")
            }
            const magic = new Magic(MAGIC_KEY)

            const token = retrieveJWTToken(ctx)
            
            await magic.token.validate(token) //This will throw if the token is not valid

            const issuer = await magic.token.getIssuer(token)
            const magicUser = await magic.users.getMetadataByIssuer(issuer)

            ctx.state.user = await strapi.plugins['users-permissions'].services.user.fetch({
                email: useCrypto ? magicUser.publicAddress : magicUser.email
            })

            if(!ctx.state.user){
                //Create the user
                try{
                    const advanced = await strapi
                        .store({
                            environment: '',
                            type: 'plugin',
                            name: 'users-permissions',
                            key: 'advanced',
                        })
                        .get()
                    const defaultRole = await strapi
                        .query('role', 'users-permissions')
                        .findOne({ type: advanced.default_role }, [])

                    ctx.state.user = await strapi.plugins['users-permissions'].services.user.add({
                        username: useCrypto ? magicUser.publicAddress : magicUser.email,
                        email: useCrypto ? magicUser.publicAddress : magicUser.email,
                        role: defaultRole,
                        confirmed: true,
                        provider: 'magic'
                    })
                } catch(err){
                    console.log('Exception in user creation in permissions', err)
                }
            }
            return ctx.state.user
        } catch(err){
            return null
        }
    }
};
