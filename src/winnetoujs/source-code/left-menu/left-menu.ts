import { $div } from "../common/common.wcto";
import { W } from "winnetoujs";
import { createElement, Info, Plus, FolderKanban } from "lucide";
import { $menuItem, $menuSeparator } from "./menu-item.wcto";
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

    new $menuItem(
      {
        ariaLabel: "Add Project",
        icon: createIcon(Plus),
        label: "Add Project",
        onclick: W.fx((self: HTMLElement) => {
          appRouter.methods.addProject.go();
        }, "this"),
      },
      { identifier: "add-project" },
    ).create(output);

    new $menuSeparator().create(output);

    new $menuItem(
      {
        ariaLabel: "Select Project",
        icon: createIcon(FolderKanban),
        label: "Select Project",
        onclick: W.fx((self: HTMLElement) => {
          appRouter.methods.selectProject.go();
        }, "this"),
      },
      { identifier: "select-project" },
    ).create(output);

    new $menuItem(
      {
        ariaLabel: "About",
        icon: createIcon(Info),
        label: "About",
        onclick: W.fx((self: HTMLElement) => {
          appRouter.methods.about.go();
        }, "this"),
      },
      { identifier: "about" },
    ).create(output);
    this.buttonEffect();
  }

  private buttonEffect() {
    document
      .querySelectorAll<HTMLElement>(".left-menu button")
      .forEach((item) => {
        item.addEventListener("pointerdown", () => {
          document
            .querySelectorAll<HTMLElement>(".left-menu button")
            .forEach((btn) => {
              btn.classList.remove("is-active");
            });
          item.classList.add("is-active");
        });
      });
  }
}

export const manualMenuEffect = (identifier: string) => {
  document
    .querySelectorAll<HTMLElement>(".left-menu button")
    .forEach((item) => {
      item.classList.remove("is-active");
    });
  const el = document.getElementById(`menuItem-win-${identifier}`);
  if (el) {
    el.classList.add("is-active");
  }
};
