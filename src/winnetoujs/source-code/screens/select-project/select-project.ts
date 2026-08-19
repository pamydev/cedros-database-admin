import {
  $backgroundImage,
  $buttonPrimary,
  $buttonSecondary,
  $div,
  $image,
} from "@common";
import { Screen } from "../screen";
import { createIcon } from "@icons";
import { Plus } from "lucide";
import { W } from "winnetoujs";
import { appRouter } from "../../router/router";
import { manualMenuEffect } from "../../left-menu/left-menu";
import { IProjects } from "../../../../../types/mongify";

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
    console.log("Project:", project);
    const projectDiv = new $div({
      class: "LIST-ITEM",
    }).create(output).ids.div;
    const leftDiv = new $div({
      class: "LIST-ITEM-LEFT",
    }).create(projectDiv).ids.div;
    const rightDiv = new $div({
      class: "LIST-ITEM-RIGHT",
    }).create(projectDiv).ids.div;

    const uriProjectName = encodeURIComponent(project.name);

    if (project.image)
      new $backgroundImage({
        imageUrl: `images://${uriProjectName}/${project.image}`,
        style: "width: 50px; height: 50px;",
      }).create(leftDiv);

    const textDiv = new $div({}).create(leftDiv).ids.div;
    new $div({
      content: project.name,
      class: "LIST-ITEM-TITLE",
    }).create(textDiv);
    new $div({
      content: project.description,
      class: "LIST-ITEM-DESCRIPTION",
    }).create(textDiv);

    new $buttonSecondary({
      content: " Select",
      onclick: W.fx(() => {
        manualMenuEffect("select-project");
        appRouter.methods.selectProject.go();
      }),
    }).create(rightDiv);
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
