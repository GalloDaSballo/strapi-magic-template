'use strict';

/**
 * magic-v1.js controller
 *
 * @description: A set of functions called "actions" of the `magic-v1` plugin.
 */

const getStore =  () => (
  strapi.store({
    environment: strapi.config.environment,
    type: 'plugin',
    name: 'magic'
}))

module.exports = {
  /**
   * Retrieve secret key and return it
   */
  retrieveSettings: async (ctx) => {
    const {user} = ctx.state

    if(user.roles[0].id != 1){
      return ctx.unauthorized("Only admins")
    }

    const pluginStore = getStore()

    const sk = await pluginStore.get({ key: 'sk' })

    ctx.send({
      sk: sk ? sk : ''
    })
  },
  /**
   * Updated secret key and return it
   */
  updateSettings: async (ctx) => {
    const {user} = ctx.state
    const {sk} = ctx.request.body

    //Ensure user is admin
    if(user.roles[0].id != 1){
      return ctx.unauthorized("Only administrators allowed!")
    }

    if(!sk){
      return ctx.throw(400, "Please provide a secret key")
    }

    const pluginStore = getStore()

    const result = await pluginStore.set({ key: 'sk', value: sk })

    ctx.send({
      result
    })
  }
};