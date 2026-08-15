import { $buttonPrimary, $div } from "@common";
import { Screen } from "../screen";
import { createIcon } from "@icons";
import { Plus } from "lucide";
import { W } from "winnetoujs";
import { appRouter } from "../../router/router";
import { manualMenuEffect } from "../../left-menu/left-menu";

export class SelectProjectScreen extends Screen {
  private output: string;
  render() {
    this.output = this.buildScreen({
      output: "screen",
      title: "Select Project",
      identifier: "select-project",
    });
    this.emptyProjects();
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
