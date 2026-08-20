import { $div } from "../common/common.wcto";
import { W } from "winnetoujs";
import {
  createElement,
  Info,
  Plus,
  FolderKanban,
  ClipboardPenLine,
  Logs,
  Settings,
  Power,
} from "lucide";
import { $menuItem, $menuSeparator } from "./menu-item.wcto";
import { createIcon } from "../helpers/icons.helper";
import { appRouter } from "../router/router";

class LeftMenu {
  private output: string;
  render() {
    const output = new $div({
      class: "left-menu",
    }).create("#app", { clear: true }).ids.div;

    this.output = output;

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
        icon: createIcon(FolderKanban, {
          color: "red",
        }),
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
        icon: createIcon(Info, {
          color: "blue",
        }),
        label: "About",
        onclick: W.fx((self: HTMLElement) => {
          appRouter.methods.about.go();
        }, "this"),
      },
      { identifier: "about" },
    ).create(output);
    this.buttonEffect();
  }

  renderProjectMenu(_id: string) {
    const output = this.output;
    new $div({
      class: "__header",
    }).create(output, { clear: true });

    new $menuItem(
      {
        ariaLabel: "Home",
        icon: createIcon(FolderKanban, { color: "grey" }),
        label: "Home",
        onclick: W.fx((self: HTMLElement) => {
          appRouter.methods.project_home.go(_id);
        }, "this"),
      },
      { identifier: "home" },
    ).create(output);

    new $menuItem(
      {
        ariaLabel: "Add connection",
        icon: createIcon(ClipboardPenLine, { color: "grey" }),
        label: "Add connection",
        onclick: W.fx((self: HTMLElement) => {
          appRouter.methods.add_connection.go(_id);
        }, "this"),
      },
      { identifier: "add-connection" },
    ).create(output);

    new $menuItem(
      {
        ariaLabel: "Show database log entries",
        icon: createIcon(Logs, { color: "black" }),
        label: "Show database log entries",
        onclick: W.fx((self: HTMLElement) => {
          // appRouter.methods.projectHome.go();
        }, "this"),
      },
      { identifier: "show-database-log-entries" },
    ).create(output);

    new $menuSeparator().create(output);

    new $menuItem(
      {
        ariaLabel: "Project settings",
        icon: createIcon(Settings, { color: "yellow" }),
        label: "Project settings",
        onclick: W.fx((self: HTMLElement) => {
          // appRouter.methods.projectHome.go();
        }, "this"),
      },
      { identifier: "project-settings" },
    ).create(output);

    new $menuItem(
      {
        ariaLabel: "Close project",
        icon: createIcon(Power, { color: "grey" }),
        label: "Close project",
        onclick: W.fx((self: HTMLElement) => {
          // appRouter.methods.projectHome.go();
        }, "this"),
      },
      { identifier: "close-project" },
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

export const leftMenu = new LeftMenu();

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
