import { $div } from "@common";
import { listItem } from "@helpers/listItem.helper";
import { Screen } from "@screens/screen";

class AddConnectionScreen extends Screen {
  private output: string;
  public async render(_id: string) {
    const project = await window.database.getProjectById(_id);

    const content = this.buildScreen({
      output: "screen",
      title: "Add Connection",
      identifier: "add-connection",
      titleImg: project?.image
        ? `images://${encodeURIComponent(project.name)}/${project.image}`
        : null,
    });

    if (content === "exists") return;
    // this.output = content;

    this.output = new $div({
      class: "PANEL",
    }).create(content).ids.div;

    listItem({
      label: "MongoDB",
      onclick: "",
      output: this.output,
    });

    listItem({
      label: "Redis",
      onclick: "",
      output: this.output,
    });

    listItem({
      label: "Cedros Mongify",
      onclick: "",
      output: this.output,
    });
  }
}

export const addConnectionScreen = new AddConnectionScreen();
