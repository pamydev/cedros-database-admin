import { $div, $span } from "@common";
import { Screen } from "@screens/screen";
import { IDatabase } from "../../../../../types/ipc";
import { listItem } from "@helpers/listItem.helper";
import { Database } from "lucide";
import { W } from "winnetoujs";

class ProjectHomeScreen extends Screen {
  private output: string;
  private panelOutput: string;
  private projectId: string;

  public async render(_id: string) {
    this.projectId = _id;
    const project = await window.database.getProjectById(_id);

    const content = this.buildScreen({
      output: "screen",
      title: "Project Home",
      identifier: "project-home",
      titleImg: project?.image
        ? `images://${encodeURIComponent(project.name)}/${project.image}`
        : null,
    });

    if (content === "exists") return;
    this.output = content;

    new $div({
      content: project.name,
      class: "TITLE",
    }).create(content);

    new $div({
      content: project.description,
      class: "SUB-TITLE",
      style: "margin-bottom: 20px;",
    }).create(content);

    this.panelOutput = new $div({
      class: "FLEX-TRANSPARENT",
    }).create(content).ids.div;

    // this.renderMongify();
    this.listDatabasesAndWorkspaces();
    // this.listWorkspaces();
  }

  async listDatabasesAndWorkspaces() {
    const output = new $div({
      class: "PANEL CONTENT-WIDTH",
    }).create(this.panelOutput).ids.div;
    const databases = await window.database.listDatabases(this.projectId);

    if (databases.length === 0) {
      new $div({
        content: "No databases found",
      }).create(output);
      return;
    }

    listItem({
      label: "Databases list",
      output: output,
      subLabel:
        "Click on a database to view its collections and start working with it. You can also add new databases or remove existing ones.",
      onclick: "",
      chevronRight: false,
    });

    databases.forEach((db) => this.printDatabase(db, output));

    // workspaces

    listItem({
      label: "Workspaces list",
      output: output,
      subLabel:
        "Workspaces are saved queries and configurations for your databases. ",
      onclick: "",
      chevronRight: false,
    });
  }

  private printDatabase(db: IDatabase, output: string) {
    const label = new $span({
      content: db.type,
      class: `__span-${db.type}__`,
    }).constructoString();
    listItem({
      label: label + db.database_name,
      onclick: W.fx(() => {
        this.openDatabase(db);
      }),
      output: output,
      icon: Database,
    });
  }

  async openDatabase(db: IDatabase) {
    if (db.type === "mongify") {
      this.renderMongify(db);
    }
  }

  async renderMongify(db: IDatabase) {
    const output = new $div({
      class: "PANEL",
    }).create(this.panelOutput).ids.div;

    new $div({
      content: "Mongify Collections",
      style: "margin-bottom: 10px; font-weight: bold; font-size: 16px;",
    }).create(output);

    let collections = await window.database.mongify.getCollections();

    collections.forEach((collection) => {
      new $div({
        content: collection,
      }).create(output);
    });
  }
}

export const projectHomeScreen = new ProjectHomeScreen();
