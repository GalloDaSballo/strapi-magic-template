'use strict';

const pluginId = require("../pluginId")
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
    }
};
