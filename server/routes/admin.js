"use strict";

module.exports = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/configs",
      handler: "configsController.get",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
    {
      method: "POST",
      path: "/configs",
      handler: "configsController.set",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
  ],
};
