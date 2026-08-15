import { $div } from "../common/common.wcto";
import { W } from "../../node_modules/winnetoujs/dist/core/winnetou.js";
import { createElement, Info, Plus } from "lucide";
import { $menuItem } from "./menu-item.wcto";

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
      icon: createElement(Plus, { size: 17, strokeWidth: 2.2 }).outerHTML,
      label: "Add connection",
      onclick: activateItem,
    }).create(output);

    new $menuItem({
      ariaLabel: "About",
      icon: createElement(Info, { size: 17, strokeWidth: 2.2 }).outerHTML,
      label: "About",
      onclick: activateItem,
    }).create(output);
  }
}
