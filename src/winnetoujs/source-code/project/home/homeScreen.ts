import { $div } from "@common";
import { Screen } from "@screens/screen";

class ProjectHomeScreen extends Screen {
  private output: string;
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

    this.renderMongify();
    // this.listDatabases();
  }

  async listDatabases() {
    const databases = await window.database.listDatabases();
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
