import { $div } from "../common/common.wcto";
import { W } from "../../node_modules/winnetoujs/dist/core/winnetou.js";
import { createElement, Info, Plus } from "lucide";
import { $menuItem } from "./menu-item.wcto";
import { createIcon } from "../helpers/icons.helper";
import { appRouter } from "../router/router";

export class LeftMenu {
  render() {
    const output = new $div({
      class: "left-menu",
    }).create("#app").ids.div;

    new $div({
      class: "__header",
    }).create(output);

    const activateItem = (self: HTMLElement) => {
      document
        .querySelectorAll<HTMLElement>(".left-menu__item")
        .forEach((item) => item.classList.remove("is-active"));
      self.classList.add("is-active");
    };

    new $menuItem({
      ariaLabel: "Add Project",
      icon: createIcon(Plus),
      label: "Add Project",
      onclick: W.fx((self: HTMLElement) => {
        activateItem(self);
        appRouter.methods.selectProject.go();
      }, "this"),
    }).create(output);

    new $menuItem({
      ariaLabel: "About",
      icon: createIcon(Info),
      label: "About",
      onclick: W.fx((self: HTMLElement) => {
        activateItem(self);
        appRouter.methods.about.go();
      }, "this"),
    }).create(output);
  }
}
