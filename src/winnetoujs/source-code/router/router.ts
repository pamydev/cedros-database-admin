// router.ts
import { Router } from "winnetoujs/modules/router";
import { leftMenu, manualMenuEffect } from "../left-menu/left-menu";
import { selectProjectScreen } from "@screens/select-project/select-project";
import { newProjectScreen } from "@screens/new-project/new-project";
import { aboutScreen } from "@screens/about/about";
import { projectRouter } from "./project.routes";
import { hideScreens } from "@helpers/hideScreens.helper";

class MyRouter {
  constructor() {
    this.createRoutes();
  }

  private routes = {};

  public hideScreens() {
    hideScreens();
  }

  public methods = {
    addProject: {
      go: () => Router.navigate("/add-project"),
      set: () => {
        this.routes["/add-project"] = () => {
          leftMenu.render();
          this.hideScreens();
          manualMenuEffect("add-project");
          newProjectScreen.render();
        };
      },
    },

    selectProject: {
      go: (reload?: "reload") =>
        Router.navigate(`/select-project/${reload || "null"}`),
      set: () => {
        this.routes["/select-project/:reload"] = (reload: "reload") => {
          leftMenu.render();
          this.hideScreens();
          manualMenuEffect("select-project");
          selectProjectScreen.render(reload);
        };
      },
    },

    about: {
      go: () => Router.navigate("/about"),
      set: () => {
        this.routes["/about"] = () => {
          leftMenu.render();

          this.hideScreens();
          manualMenuEffect("about");
          aboutScreen.render();
        };
      },
    },

    ...projectRouter(this.routes),
  };

  private createRoutes() {
    // Register all routes
    Object.keys(this.methods).forEach((key) => {
      this.methods[key].set();
    });

    // Create the router with lifecycle hooks
    Router.createRoutes(this.routes, {
      onGo(route) {},
      onBack(route) {},
    });
  }
}

export const appRouter = new MyRouter();
