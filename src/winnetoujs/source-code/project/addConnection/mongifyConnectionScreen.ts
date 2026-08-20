import { $buttonPrimary, $div, $inputForm } from "@common";
import { createIcon } from "@icons";
import { Check } from "lucide";
import { Screen } from "@screens/screen";
import { W } from "winnetoujs";

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

    const databasePath = new $inputForm({
      label: "Database path",
      type: "text",
      placeholder: "/path/to/database",
      required: true,
    }).create(panel).ids.input;

    const actions = new $div({ class: "DIV-RIGHT" }).create(panel).ids.div;
    new $buttonPrimary({
      content: "Save Connection",
      icon: createIcon(Check),
      onclick: W.fx(async () => {
        const input = document.getElementById(databasePath) as HTMLInputElement;

        if (!input.value.trim()) {
          alert("Database path is required.");
          return;
        }

        try {
          await window.database.saveMongifyConnection({
            projectId: _id,
            databasePath: input.value,
          });
          alert("Connection saved");
        } catch {
          alert("Could not save connection.");
        }
      }),
    }).create(actions);
  }
}

export const mongifyConnectionScreen = new MongifyConnectionScreen();
