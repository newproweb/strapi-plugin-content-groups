import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getConfigs } from "../utils/api";

const RouteWatcher = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/content-manager")) {
      const sideNav = document.querySelector('nav[aria-label="Content"]');
      if (sideNav.classList.contains("custom-groups-initialized")) return;

      getConfigs().then((customGroups) => {
        const menuContainer = sideNav.querySelector("& > div:last-child > ol");

        Object.entries(customGroups).map(([groupName, uids]) => {
          const newMenuItem = menuContainer.querySelector("li").cloneNode(true);
          const oldList = newMenuItem.querySelector("ol");
          oldList.innerHTML = "";

          newMenuItem.querySelector(
            "& > div > div > div > div > div > span"
          ).textContent = groupName;
          newMenuItem.querySelector(
            "& > div > div > div > div:last-child > span"
          ).textContent = uids.length;

          uids.map((uid) => {
            const foundLink = menuContainer.querySelector(
              `& ol > li:has(a[href*="${uid}"])`
            );

            if (foundLink) oldList.append(foundLink);
          });

          menuContainer.prepend(newMenuItem);
          sideNav.classList.add("custom-groups-initialized");
        });

        menuContainer
          .querySelectorAll("& li > div > div > div > div > div > span")
          .forEach((el) => {
            if (
              ["Collection Types", "Single Types"].includes(
                el.textContent.trim()
              )
            ) {
              const contentTypesAmount = el
                .closest("li")
                .querySelectorAll("ol > li").length;

              el.parentNode.parentNode.parentNode.querySelector(
                "& > div:last-child span"
              ).textContent = contentTypesAmount;
            }
          });
      });
    }
  }, [location.pathname]);

  return <></>;
};

export default RouteWatcher;
