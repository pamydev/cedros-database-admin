// router.ts
import { Router } from "winnetoujs/modules/router";
import { SelectProjectScreen } from "../screens/select-project/select-project";
import { AboutScreen } from "../screens/about/about";
import { manualMenuEffect } from "../left-menu/left-menu";

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
          // Implement the logic for the Add Project screen here
        };
      },
    },

    selectProject: {
      go: () => Router.navigate("/select-project"),
      set: () => {
        this.routes["/select-project"] = () => {
          this.hideScreens();
          manualMenuEffect("select-project");
          new SelectProjectScreen().render();
        };
      },
    },

    about: {
      go: () => Router.navigate("/about"),
      set: () => {
        this.routes["/about"] = () => {
          this.hideScreens();
          manualMenuEffect("about");
          new AboutScreen().render();
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
