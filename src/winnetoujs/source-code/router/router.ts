// router.ts
import { Router } from "winnetoujs/modules/router";
import { manualMenuEffect } from "../left-menu/left-menu";
import { selectProjectScreen } from "@screens/select-project/select-project";
import { newProjectScreen } from "@screens/new-project/new-project";
import { aboutScreen } from "@screens/about/about";

class MyRouter {
  constructor() {
    this.createRoutes();
  }

  private routes = {};

  private hideScreens() {
    document.querySelectorAll<HTMLElement>(".screen").forEach((item) => {
      document.getElementById(item.id)?.style.setProperty("display", "none");
    });
  }

  public methods = {
    addProject: {
      go: () => Router.navigate("/add-project"),
      set: () => {
        this.routes["/add-project"] = () => {
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
          this.hideScreens();
          manualMenuEffect("select-project");
          if (reload === "reload") {
            selectProjectScreen.loadProjects("reload");
          }
          selectProjectScreen.render();
        };
      },
    },

    about: {
      go: () => Router.navigate("/about"),
      set: () => {
        this.routes["/about"] = () => {
          this.hideScreens();
          manualMenuEffect("about");
          aboutScreen.render();
        };
      },
    },
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
