"use strict";

module.exports = ({ strapi }) => {
  const getPluginStore = () => {
    return strapi.store({
      environment: "",
      type: "plugin",
      name: "content-groups",
    });
  };

  return {
    async getConfigs() {
      const pluginStore = getPluginStore();
      let config = await pluginStore.get({ key: "groups" });
      if (!config) config = await strapi.config.get("plugin.content-groups");

      return config;
    },

    async setConfigs(groups) {
      const pluginStore = getPluginStore();

      return pluginStore.set({
        key: "groups",
        value: groups,
      });
    },
  };
};
