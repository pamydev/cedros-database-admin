import { $buttonPrimary, $div, $inputForm } from "@common";
import { createIcon } from "@icons";
import { Check } from "lucide";
import { Screen } from "@screens/screen";

class MongoConnectionScreen extends Screen {
  public async render(_id: string) {
    const project = await window.database.getProjectById(_id);

    const content = this.buildScreen({
      output: "screen",
      title: "Add MongoDB Connection",
      identifier: "mongo-connection",
      titleImg: project?.image
        ? `images://${encodeURIComponent(project.name)}/${project.image}`
        : null,
    });

    if (content === "exists") return;

    const panel = new $div({ class: "PANEL" }).create(content).ids.div;

    new $inputForm({
      label: "Connection Name",
      type: "text",
      placeholder: "Local MongoDB",
      required: true,
    }).create(panel);

    new $inputForm({
      label: "MongoDB URI",
      description: "Example: mongodb://localhost:27017",
      type: "text",
      placeholder: "mongodb://localhost:27017",
      required: true,
    }).create(panel);

    new $inputForm({
      label: "Username",
      type: "text",
      placeholder: "Optional",
      required: false,
    }).create(panel);

    new $inputForm({
      label: "Password",
      type: "password",
      placeholder: "Optional",
      required: false,
    }).create(panel);

    new $inputForm({
      label: "Database",
      type: "text",
      placeholder: "Database name",
      required: true,
    }).create(panel);

    const actions = new $div({ class: "DIV-RIGHT" }).create(panel).ids.div;
    new $buttonPrimary({
      content: "Save Connection",
      icon: createIcon(Check),
    }).create(actions);
  }
}

export const mongoConnectionScreen = new MongoConnectionScreen();
