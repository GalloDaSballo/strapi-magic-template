'use strict';

const pluginId = require("../pluginId")

/**
 * magic-v1.js controller
 *
 * @description: A set of functions called "actions" of the `magic-v1` plugin.
 */
module.exports = {
  /**
   * Retrieve secret key and return it
   */
  retrieveSettings: async (ctx) => {
    const {user} = ctx.state

    if(user.roles[0].id != 1){
      return ctx.unauthorized("Only admins")
    }

    
    console.log("pluginId", pluginId)
    const sk = await strapi.plugins[pluginId].services[pluginId].getKey() 

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

    const result = await strapi.plugins[pluginId].services[pluginId].setKey(sk) 

    ctx.send({
      result
    })
  }
};