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

    if(user.roles[0].name !== 'Super Admin'){
      console.log("MAGIC Please only set the PK with a Super Admin Account")
      console.log("Your Role", JSON.stringify(user.roles))
      return ctx.unauthorized("Only admins")
    }

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
    if(user.roles[0].name !== 'Super Admin'){
      console.log("MAGIC Please only set the PK with a Super Admin Account")
      console.log("Your Role", JSON.stringify(user.roles))
      return ctx.unauthorized("Only administrators allowed!")
    }

    if(!sk){
      return ctx.throw(400, "Please provide a secret key")
    }
    try{
      const result = await strapi.plugins[pluginId].services[pluginId].setKey(sk) 

      ctx.send({
        result
      })
    } catch(err) {
      return ctx.throw(400, err.message)
    }
  }
};