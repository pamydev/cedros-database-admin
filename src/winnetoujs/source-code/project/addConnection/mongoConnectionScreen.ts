import { $buttonPrimary, $div, $inputForm } from "@common";
import { createIcon } from "@icons";
import { Check } from "lucide";
import { Screen } from "@screens/screen";
import { W } from "winnetoujs";

class MongoConnectionScreen extends Screen {
  private connection_name: string;
  private connection_uri: string;
  private connection_userName: string;
  private connection_password: string;
  private connection_database: string;
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

    this.connection_name = new $inputForm({
      label: "Connection Name",
      type: "text",
      placeholder: "Local MongoDB",
      required: true,
    }).create(panel).ids.input;

    this.connection_uri = new $inputForm({
      label: "MongoDB URI",
      description: "Example: mongodb://localhost:27017",
      type: "text",
      placeholder: "mongodb://localhost:27017",
      required: true,
    }).create(panel).ids.input;

    this.connection_userName = new $inputForm({
      label: "Username",
      type: "text",
      placeholder: "Optional",
      required: false,
    }).create(panel).ids.input;

    this.connection_password = new $inputForm({
      label: "Password",
      type: "password",
      placeholder: "Optional",
      required: false,
    }).create(panel).ids.input;

    this.connection_database = new $inputForm({
      label: "Database",
      type: "text",
      placeholder: "Database name",
      required: true,
    }).create(panel).ids.input;

    const actions = new $div({ class: "DIV-RIGHT" }).create(panel).ids.div;
    new $buttonPrimary({
      content: "Save Connection",
      icon: createIcon(Check),
      onclick: W.fx(() => {
        this.send(_id);
      }),
    }).create(actions);
  }
  private send(projectId) {
    const name = document.getElementById(
      this.connection_name,
    ) as HTMLInputElement;
    const uri = document.getElementById(
      this.connection_uri,
    ) as HTMLInputElement;
    const userName = document.getElementById(
      this.connection_userName,
    ) as HTMLInputElement;
    const password = document.getElementById(
      this.connection_password,
    ) as HTMLInputElement;
    const database = document.getElementById(
      this.connection_database,
    ) as HTMLInputElement;
    if (
      !database.value ||
      !name.value ||
      !password.value ||
      !uri.value ||
      !userName.value
    ) {
      alert("All fields must be filled.");
      return;
    }
    window.database.saveMongoConnection({
      uri: uri.value,
      name: name.value,
      userName: userName.value,
      password: password.value,
      database: database.value,
      projectId,
    });
    alert("Connection saved");
  }
}

export const mongoConnectionScreen = new MongoConnectionScreen();
