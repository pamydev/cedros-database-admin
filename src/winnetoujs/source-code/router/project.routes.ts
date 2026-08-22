import { hideScreens } from "@helpers/hideScreens.helper";
import { leftMenu, manualMenuEffect } from "@leftMenu";
import { addConnectionScreen } from "@projectScreens/addConnection/addConnectionScreen";
import { mongoConnectionScreen } from "@projectScreens/addConnection/mongoConnectionScreen";
import { mongifyConnectionScreen } from "@projectScreens/addConnection/mongifyConnectionScreen";
import { redisConnectionScreen } from "@projectScreens/addConnection/redisConnectionScreen";
import { projectHomeScreen } from "@projectScreens/home/homeScreen";
import { Router } from "winnetoujs/modules/router";

export const projectRouter = (routes = {}) => {
  return {
    project_home: {
      go(projectId: string) {
        Router.navigate(`/screen/home/${projectId}`);
      },
      set() {
        routes["/screen/home/:projectId"] = (projectId: string) => {
          leftMenu.renderProjectMenu(projectId);
          hideScreens();
          manualMenuEffect("home");
          projectHomeScreen.render(projectId);
        };
      },
    },
    add_connection: {
      go(projectId: string) {
        Router.navigate(`/screen/add-connection/${projectId}`);
      },
      set() {
        routes["/screen/add-connection/:projectId"] = (projectId: string) => {
          leftMenu.renderProjectMenu(projectId);
          hideScreens();
          manualMenuEffect("add-connection");
          addConnectionScreen.render(projectId);
        };
      },
    },
    add_mongo_connection: {
      go(projectId: string) {
        Router.navigate(`/screen/add-mongo-connection/${projectId}`);
      },
      set() {
        routes["/screen/add-mongo-connection/:projectId"] = (
          projectId: string,
        ) => {
          hideScreens();
          mongoConnectionScreen.render(projectId);
        };
      },
    },
    add_redis_connection: {
      go(projectId: string) {
        Router.navigate(`/screen/add-redis-connection/${projectId}`);
      },
      set() {
        routes["/screen/add-redis-connection/:projectId"] = (
          projectId: string,
        ) => {
          hideScreens();
          redisConnectionScreen.render(projectId);
        };
      },
    },
    add_mongify_connection: {
      go(projectId: string) {
        Router.navigate(`/screen/add-mongify-connection/${projectId}`);
      },
      set() {
        routes["/screen/add-mongify-connection/:projectId"] = (
          projectId: string,
        ) => {
          hideScreens();
          mongifyConnectionScreen.render(projectId);
        };
      },
    },
  };
};
