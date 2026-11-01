import { $div, $span } from "@common";
import { Screen } from "@screens/screen";
import { IDatabasesColl } from "../../../../../types/contracts";
import { listItem } from "@helpers/listItem.helper";
import { Database } from "lucide";
import { W } from "winnetoujs";
import { renderMongifyCodeDiv } from "./mongifyRenderer/mongify.coder";

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
      style: "flex:1",
    }).create(content).ids.div;

    // this.renderMongify();
    this.listDatabasesAndWorkspaces();
    // this.listWorkspaces();
  }

  private async listDatabasesAndWorkspaces() {
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
    const dbName = new $span({
      content: db.database_name,
    }).constructoString();
    listItem({
      label: label,
      subLabel: db.database_name,
      onclick: W.fx(() => {
        this.openDatabase(db);
      }),
      output: output,
      icon: Database,
    });
  }

  private async openDatabase(db: IDatabasesColl) {
    if (db.type === "mongify") {
      renderMongifyCodeDiv({
        db,
        panelOutput: this.panelOutput,
      });
    }
  }
}

export const projectHomeScreen = new ProjectHomeScreen();
