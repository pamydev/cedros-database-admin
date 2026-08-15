import { $div } from "../common/common.wcto";
import { W } from "../../node_modules/winnetoujs/dist/core/winnetou.js";
import { createElement, Info, Plus } from "lucide";
import { $menuItem } from "./menu-item.wcto";
import { createIcon } from "../helpers/icons.helper";

export class LeftMenu {
  render() {
    const output = new $div({
      class: "left-menu",
    }).create("#app").ids.div;

    new $div({
      class: "__header",
    }).create(output);

    const activateItem = W.fx((self: HTMLElement) => {
      document
        .querySelectorAll<HTMLElement>(".left-menu__item")
        .forEach((item) => item.classList.remove("is-active"));
      self.classList.add("is-active");
    }, "this");

    new $menuItem({
      ariaLabel: "Add connection",
      icon: createIcon(Plus),
      label: "Add connection",
      onclick: activateItem,
    }).create(output);

    new $menuItem({
      ariaLabel: "About",
      icon: createIcon(Info),
      label: "About",
      onclick: activateItem,
    }).create(output);
  }
}
