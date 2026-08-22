import { $div } from "@common";
import { Screen } from "@screens/screen";
import { IDatabase } from "../../../../../types/ipc";
import { listItem } from "@helpers/listItem.helper";
import { Database } from "lucide";

class ProjectHomeScreen extends Screen {
  private output: string;
  private panelOutput: string;
  public async render(_id: string) {
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
    this.listDatabases();
    this.listWorkspaces();
  }

  async listDatabases() {
    const output = new $div({
      class: "PANEL CONTENT-WIDTH",
    }).create(this.panelOutput).ids.div;
    const databases = await window.database.listDatabases();
    console.log("databases", databases);
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
        "Click on a database to view its collections or select multiple to create a workspace",
      onclick: "",
      chevronRight: false,
    });
    databases.forEach((db) => this.printDatabase(db, output));
  }

  private printDatabase(db: IDatabase, output: string) {
    listItem({
      label: db.database_name,
      onclick: "",
      output: output,
      icon: Database,
    });
  }

  private listWorkspaces() {
    const output = new $div({
      class: "PANEL CONTENT-WIDTH",
    }).create(this.panelOutput).ids.div;

    new $div({
      content: "No workspaces found",
    }).create(output);
  }

  async renderMongify() {
    const output = new $div({
      class: "PANEL",
    }).create(this.output).ids.div;

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
