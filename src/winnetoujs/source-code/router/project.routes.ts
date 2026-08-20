import { hideScreens } from "@helpers/hideScreens.helper";
import { leftMenu, manualMenuEffect } from "@leftMenu";
import { addConnectionScreen } from "@projectScreens/addConnection/addConnectionScreen";
import { projectHomeScreen } from "@projectScreens/home/homeScreen";
import { Router } from "winnetoujs/modules/router";

export const projectRouter = (routes = {}) => {
  return {
    project_home: {
      go(_id: string) {
        Router.navigate(`/screen/home/${_id}`);
      },
      set() {
        routes["/screen/home/:_id"] = (_id: string) => {
          leftMenu.renderProjectMenu(_id);
          hideScreens();
          manualMenuEffect("home");
          projectHomeScreen.render(_id);
        };
      },
    },
    add_connection: {
      go(_id: string) {
        Router.navigate(`/screen/add-connection/${_id}`);
      },
      set() {
        routes["/screen/add-connection/:_id"] = (_id: string) => {
          leftMenu.renderProjectMenu(_id);
          hideScreens();
          manualMenuEffect("add-connection");
          addConnectionScreen.render(_id);
        };
      },
    },
  };
};
