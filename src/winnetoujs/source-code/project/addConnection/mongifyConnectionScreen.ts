import { $buttonPrimary, $div, $inputForm } from "@common";
import { createIcon } from "@icons";
import { Check } from "lucide";
import { Screen } from "@screens/screen";

class MongifyConnectionScreen extends Screen {
  public async render(_id: string) {
    const project = await window.database.getProjectById(_id);

    const content = this.buildScreen({
      output: "screen",
      title: "Add Cedros Mongify Connection",
      identifier: "mongify-connection",
      titleImg: project?.image
        ? `images://${encodeURIComponent(project.name)}/${project.image}`
        : null,
    });

    if (content === "exists") return;

    const panel = new $div({ class: "PANEL" }).create(content).ids.div;

    new $inputForm({
      label: "Database path",
      type: "text",
      placeholder: "/path/to/database",
      required: true,
    }).create(panel);

    const actions = new $div({ class: "DIV-RIGHT" }).create(panel).ids.div;
    new $buttonPrimary({
      content: "Save Connection",
      icon: createIcon(Check),
    }).create(actions);
  }
}

export const mongifyConnectionScreen = new MongifyConnectionScreen();
