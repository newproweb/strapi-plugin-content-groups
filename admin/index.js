import RouteWatcher from "./components/RouteWatcher";
import pluginId from "./pluginId";

export default {
  register(app) {
    app.injectContentManagerComponent("listView", "actions", {
      name: "route-watcher-list",
      Component: RouteWatcher,
    });

    app.injectContentManagerComponent("editView", "right-links", {
      name: "route-watcher-edit",
      Component: RouteWatcher,
    });

    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.settings.title`,
          defaultMessage: "Content-Groups",
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.settings.label`,
            defaultMessage: "Content Groups Settings",
          },
          id: pluginId,
          to: `/settings/${pluginId}`,
          Component: async () => await import("./pages/Settings"),
        },
      ]
    );
  },

  bootstrap(app) {},
};
