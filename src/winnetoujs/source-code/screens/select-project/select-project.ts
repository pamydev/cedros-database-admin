import {
  $backgroundImage,
  $buttonPrimary,
  $buttonSecondary,
  $div,
  $image,
} from "@common";
import { Screen } from "../screen";
import { createIcon } from "@icons";
import { ChevronRight, Plus } from "lucide";
import { W } from "winnetoujs";
import { appRouter } from "../../router/router";
import { leftMenu, manualMenuEffect } from "../../left-menu/left-menu";
import { IProjects } from "../../../../../types/mongify";
import { listItem } from "@helpers/listItem.helper";

class SelectProjectScreen extends Screen {
  private output: string;
  render() {
    const output = this.buildScreen({
      output: "screen",
      title: "Select Project",
      identifier: "select-project",
    });
    if (output === "exists") return;

    this.output = output;

    this.loadProjects();
    // this.emptyProjects();
  }

  public async loadProjects(reload?: "reload") {
    if (reload === "reload") {
      const el = document.getElementById(this.output);
      if (el) {
        el.innerHTML = "";
      }
    }
    const projects = await window.database.loadProjects();
    const output = new $div({
      class: "PANEL",
    }).create(this.output).ids.div;
    console.log(`printed output in ${this.output}`);
    projects.forEach((project) => this.printProject(project, output));
  }

  private printProject(project: IProjects, output: string) {
    // console.log("Project:", project);
    //      appRouter.methods.project_home.go(project._id);
    const uriProjectName = encodeURIComponent(project.name);
    const imgURL = `images://${uriProjectName}/${project.image}`;

    listItem({
      label: project.name,
      subLabel: project.description,
      chevronRight: true,
      imageURL: imgURL,
      onclick: W.fx(() => {
        appRouter.methods.project_home.go(project._id);
      }),
      output,
    });
  }

  private emptyProjects(): void {
    // Implementation for emptying projects
    const panel = new $div({
      class: "PANEL",
      content: "No projects available.",
    }).create(this.output).ids.div;

    new $buttonPrimary({
      content: createIcon(Plus) + " Create New Project",
      onclick: W.fx(() => {
        manualMenuEffect("add-project");
        appRouter.methods.addProject.go();
      }),
      style: " margin-top: 10px;",
    }).create(panel);
  }
}

export const selectProjectScreen = new SelectProjectScreen();
