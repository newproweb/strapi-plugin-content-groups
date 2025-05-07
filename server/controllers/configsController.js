"use strict";

module.exports = ({ strapi }) => ({
  async get(ctx) {
    ctx.body = await strapi
      .plugin("content-groups")
      .service("configsService")
      .getConfigs();
  },

  async set(ctx) {
    ctx.body = await strapi
      .plugin("content-groups")
      .service("configsService")
      .setConfigs(ctx.request.body);
  },
});
