import { $buttonPrimary, $div, $inputForm } from "@common";
import { createIcon } from "@icons";
import { Check } from "lucide";
import { Screen } from "@screens/screen";

class RedisConnectionScreen extends Screen {
  public async render(_id: string) {
    const project = await window.database.getProjectById(_id);

    const content = this.buildScreen({
      output: "screen",
      title: "Add Redis Connection",
      identifier: "redis-connection",
      titleImg: project?.image
        ? `images://${encodeURIComponent(project.name)}/${project.image}`
        : null,
    });

    if (content === "exists") return;

    const panel = new $div({ class: "PANEL" }).create(content).ids.div;

    new $inputForm({
      label: "Connection Name",
      type: "text",
      placeholder: "Local Redis",
      required: true,
    }).create(panel);

    new $inputForm({
      label: "Redis URI",
      description: "Example: redis://localhost:6379",
      type: "text",
      placeholder: "redis://localhost:6379",
      required: true,
    }).create(panel);

    new $inputForm({
      label: "Host",
      type: "text",
      placeholder: "localhost",
      required: true,
    }).create(panel);

    new $inputForm({
      label: "Port",
      type: "number",
      placeholder: "6379",
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
      description: "Redis database index, usually 0",
      type: "number",
      placeholder: "0",
      required: true,
    }).create(panel);

    const actions = new $div({ class: "DIV-RIGHT" }).create(panel).ids.div;
    new $buttonPrimary({
      content: "Save Connection",
      icon: createIcon(Check),
    }).create(actions);
  }
}

export const redisConnectionScreen = new RedisConnectionScreen();
