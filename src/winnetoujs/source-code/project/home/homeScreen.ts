import { $buttonPrimary, $contentEditable, $div, $span } from "@common";
import { Screen } from "@screens/screen";
import { IDatabasesColl } from "../../../../../types/ipc";
import { listItem } from "@helpers/listItem.helper";
import { Database } from "lucide";
import { W } from "winnetoujs";

class ProjectHomeScreen extends Screen {
  private output: string;
  private panelOutput: string;
  private projectId: string;

  public async render(projectId: string) {
    this.projectId = projectId;
    const projectDetails = await window.database.getProjectById(projectId);

    const content = this.buildScreen({
      output: "screen",
      title: "Project Home",
      identifier: "project-home",
      titleImg: projectDetails?.image
        ? `images://${encodeURIComponent(projectDetails.name)}/${projectDetails.image}`
        : null,
    });

    if (content === "exists") return;
    this.output = content;

    new $div({
      content: projectDetails.name,
      class: "TITLE",
    }).create(content);

    new $div({
      content: projectDetails.description,
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

    console.table(databases);
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

  private printDatabase(db: IDatabasesColl, output: string) {
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

  async openDatabase(db: IDatabasesColl) {
    if (db.type === "mongify") {
      this.renderMongify(db);
    }
  }

  async renderMongify(db: IDatabasesColl) {
    console.log("renderMongify", db.database_name);
    const output = new $div({
      class: "PANEL",
    }).create(this.panelOutput).ids.div;

    new $div({
      content: db.database_name,
      class: "TITLE",
    }).create(output);

    new $buttonPrimary({
      content: "Send",
      onclick: W.fx(async () => {
        const res = await window.database.mongify.sendQuery({
          projectId: db.projectId,
          databaseId: db.databaseId,
          command: document.getElementById(command).textContent,
        });
        console.log(res);
      }),
    }).create(output);

    const command = new $contentEditable({
      class: "code-editor",
    }).create(output).ids.contentEditable;

    // let collections = await window.database.mongify.getCollections({
    //   databaseId: db.databaseId,
    //   projectId: this.projectId,
    // });

    // collections.forEach((collection) => {
    //   new $div({
    //     content: collection,
    //   }).create(output);
    // });
  }
}

export const projectHomeScreen = new ProjectHomeScreen();
