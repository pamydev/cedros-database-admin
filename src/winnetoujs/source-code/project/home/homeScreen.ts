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
    }).create(content);
  }
}

export const projectHomeScreen = new ProjectHomeScreen();
