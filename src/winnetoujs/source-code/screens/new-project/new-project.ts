import {
  $buttonPrimary,
  $div,
  $fileForm,
  $inputForm,
  $textareaForm,
} from "@common";
import { Screen } from "../screen";
import { createIcon } from "@icons";
import { Plus } from "lucide";
import { W } from "winnetoujs";
import { appRouter } from "../../router/router";
import { manualMenuEffect } from "../../left-menu/left-menu";

export class NewProjectScreen extends Screen {
  private output: string;
  private name: string;
  private description: string;
  private file: string;
  render() {
    this.output = this.buildScreen({
      output: "screen",
      title: "New Project",
      identifier: "new-project",
    });
    this.createForm();
  }
  private createForm(): void {
    const panel = new $div({
      class: "PANEL",
    }).create(this.output).ids.div;

    this.name = new $inputForm({
      label: "Project Name",
      description:
        "A project is a container for your database configurations and settings, saved queries, and other related resources.",
      type: "text",
      placeholder: "Enter project name",
      required: true,
    }).create(panel).ids.input;

    this.description = new $textareaForm({
      label: "Project Description",
      placeholder: "Enter project description",
      description:
        "Provide a brief description of the project, its purpose, and any other relevant information.",
      required: false,
    }).create(panel).ids.textarea;

    this.file = new $fileForm({
      label: "Project File",
      description:
        "Upload a project file to import existing configurations and settings.",
      required: false,
    }).create(panel).ids.file;

    const divRight = new $div({
      class: "DIV-RIGHT",
    }).create(panel).ids.div;

    new $buttonPrimary({
      content: createIcon(Plus) + " Create Project",
      onclick: W.fx(() => {
        this.send();
      }),
    }).create(divRight);
  }

  private async send(): Promise<void> {
    const name = (document.getElementById(this.name) as HTMLInputElement).value;
    const description = (
      document.getElementById(this.description) as HTMLTextAreaElement
    ).value;
    const fileInput = document.getElementById(this.file) as HTMLInputElement;
    const selectedFile = fileInput.files ? fileInput.files[0] : null;
    const file = selectedFile
      ? {
          name: selectedFile.name,
          type: selectedFile.type,
          data: await selectedFile.arrayBuffer(),
        }
      : null;

    let res = await window.database.createNewProject({
      name,
      description,
      file,
    });
  }
}
