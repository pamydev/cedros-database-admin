// router.ts
import { Router } from "winnetoujs/modules/router";

export class MyRouter {
  constructor() {
    this.createRoutes();
  }

  private routes = {};

  public methods = {
    home: {
      go: () => Router.navigate("/home"),
      set: () => {
        this.routes["/home"] = () => {
          console.log("Home route called");
          // Your route logic here
        };
      },
    },
    about: {
      go: () => Router.navigate("/about"),
      set: () => {
        this.routes["/about"] = () => {
          console.log("About route called");
          // Your route logic here
        };
      },
    },
    settings: {
      go: () => Router.navigate("/settings"),
      set: () => {
        this.routes["/settings"] = () => {
          console.log("Settings route called");
          // Your route logic here
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
      onGo(route) {
        console.log("Navigating to:", route);
      },
      onBack(route) {
        console.log("Going back to:", route);
      },
    });
  }
}
