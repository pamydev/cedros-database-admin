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
    add_mongo_connection: {
      go(_id: string) {
        Router.navigate(`/screen/add-mongo-connection/${_id}`);
      },
      set() {
        routes["/screen/add-mongo-connection/:_id"] = (_id: string) => {
          hideScreens();
          mongoConnectionScreen.render(_id);
        };
      },
    },
    add_redis_connection: {
      go(_id: string) {
        Router.navigate(`/screen/add-redis-connection/${_id}`);
      },
      set() {
        routes["/screen/add-redis-connection/:_id"] = (_id: string) => {
          hideScreens();
          redisConnectionScreen.render(_id);
        };
      },
    },
    add_mongify_connection: {
      go(_id: string) {
        Router.navigate(`/screen/add-mongify-connection/${_id}`);
      },
      set() {
        routes["/screen/add-mongify-connection/:_id"] = (_id: string) => {
          hideScreens();
          mongifyConnectionScreen.render(_id);
        };
      },
    },
  };
};
