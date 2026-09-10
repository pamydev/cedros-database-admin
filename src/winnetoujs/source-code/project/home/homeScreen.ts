import { $buttonPrimary, $codeEditor, $div, $span } from "@common";
import { Screen } from "@screens/screen";
import { IDatabasesColl } from "../../../../../types/contracts";
import { listItem } from "@helpers/listItem.helper";
import { Database, Grab } from "lucide";
import { W } from "winnetoujs";
import { suggestions, suggestionSelect } from "./suggestions";
import { colorizeAndFormat } from "./colorizeAndFormat";
import { createIcon } from "@icons";

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

  private createCodeDiv() {
    const output = new $div({
      class: "PANEL codeDiv",
      style: "position:relative",
    }).create(this.panelOutput).ids.div;

    const resizeTop = new $div({
      class: "resizeDiv resizeTop",
    }).create(output).ids.div;

    const resizeRight = new $div({
      class: "resizeDiv resizeRight",
    }).create(output).ids.div;

    const resizeBottom = new $div({
      class: "resizeDiv resizeBottom",
    }).create(output).ids.div;

    const resizeLeft = new $div({
      class: "resizeDiv resizeLeft",
    }).create(output).ids.div;

    const resizeTopLeft = new $div({
      class: "resizeDiv resizeTopLeft",
    }).create(output).ids.div;

    const resizeBottomLeft = new $div({
      class: "resizeDiv resizeBottomLeft",
    }).create(output).ids.div;

    const resizeBottomRight = new $div({
      class: "resizeDiv resizeBottomRight",
    }).create(output).ids.div;

    const resizeTopRight = new $div({
      class: "resizeDiv resizeTopRight",
    }).create(output).ids.div;

    [
      resizeBottom,
      resizeBottomLeft,
      resizeBottomRight,
      resizeLeft,
      resizeRight,
      resizeTop,
      resizeTopLeft,
      resizeTopRight,
    ].forEach((id) => {
      this.addResizeContainerListeners({
        id,
        codeEditorContainer: output,
      });
    });
    return output;
  }

  async renderMongify(db: IDatabasesColl) {
    const output = this.createCodeDiv();

    const header = new $div({
      class: "mongify-header",
    }).create(output).ids.div;

    const left = new $div({
      class: "mongify-header-left",
    }).create(header).ids.div;

    const right = new $div({
      class: "mongify-header-right",
    }).create(header).ids.div;

    new $div({
      content: db.database_name,
      class: "mongify-command",
    }).create(left);

    const grabIcon = new $div({
      content: createIcon(Grab, {
        simple: true,
      }),
    }).create(right).ids.div;

    this.addGrabIconListeners({
      id: grabIcon,
      output,
    });

    const codeEditor = new $codeEditor().create(output);
    const codeEditorContentId = codeEditor.ids.contentEditable;
    const codeEditorDivId = codeEditor.ids.codeEditor;

    let leftAltPressed = false;
    document
      .getElementById(codeEditorContentId)
      .addEventListener("keydown", async (e) => {
        if (e.repeat) return;
        const sendShortcut = e.key === "Enter" && (e.metaKey || e.ctrlKey);

        if (sendShortcut) {
          e.preventDefault();
          const command =
            document.getElementById(codeEditorContentId).textContent;
          const res = await window.database.mongify.sendQuery({
            projectId: db.projectId,
            databaseId: db.databaseId,
            command,
          });

          this.printMongifyResult({
            result: res,
            command,
          });

          return;
        }

        const enterWasPressed = suggestionSelect({
          e,
          codeEditor: codeEditorContentId,
          output,
        });

        // to not add tab when user clicks
        // enter to select a suggestion
        if (enterWasPressed) return;

        colorizeAndFormat({
          e,
          codeEditor: codeEditorContentId,
        });
      });

    document
      .getElementById(codeEditorContentId)
      .addEventListener("keyup", (e) => {
        suggestions({
          e,
          codeEditor: codeEditorContentId,
          output,
          databaseId: db.databaseId,
          projectId: db.projectId,
        });
      });
  }
  addGrabIconListeners(arg0: { id: string; output: string }) {
    const { id, output } = arg0;
    const grabIconElement = document.getElementById(id);
    if (!grabIconElement) return;

    grabIconElement.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const onPointerMove = (ev: PointerEvent) => {
        const outputElement = document.getElementById(output);
        if (!outputElement) return;
        outputElement.style.position = "absolute";
        let leftOrigin = outputElement.offsetLeft;
        let topOrigin = outputElement.offsetTop;
        console.log({
          leftOrigin,
          topOrigin,
          mouseX: ev.clientX,
          mouseY: ev.clientY,
        });
        if (leftOrigin === 0 && topOrigin === 0) {
          const mouseX = ev.clientX - 270 - outputElement.offsetWidth;
          const mouseY = ev.clientY - 120;
          leftOrigin = mouseX;
          topOrigin = mouseY;
        }
        outputElement.style.left = leftOrigin + ev.movementX + "px";
        outputElement.style.top = topOrigin + ev.movementY + "px";
      };
      const onPointerUp = () => {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
      };
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    });
  }

  private printMongifyResult(arg0: { result: {}; command: string }) {
    console.log(arg0.result);
    const output = this.createCodeDiv();

    const header = new $div({
      class: "mongify-header",
    }).create(output).ids.div;

    const left = new $div({
      class: "mongify-header-left",
    }).create(header).ids.div;

    const right = new $div({
      class: "mongify-header-right",
    }).create(header).ids.div;

    new $div({
      content: arg0.command,
      class: "mongify-command",
    }).create(left);

    new $div({
      content: JSON.stringify(arg0.result, null, 2)
        .replace(/\n/g, "<br>")
        .replace(/ /g, "&nbsp;")
        .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;"),
      class: "mongify-output",
    }).create(output);
  }

  private addResizeContainerListeners(arg0: {
    id: string;
    codeEditorContainer: string;
  }) {
    const { id, codeEditorContainer } = arg0;
    let isDragging = new Map<string, boolean>();
    let posX = 0;
    let posY = 0;
    document.getElementById(id).addEventListener("pointerdown", (ev) => {
      isDragging.set(id, true);
    });
    document.addEventListener("pointermove", (ev) => {
      if (!isDragging.get(id)) return;
      // ^^^^^^^^^^^^^^^^^^^^
      const x = ev.movementX;
      const y = ev.movementY;
      const width = document
        .getElementById(codeEditorContainer)
        .getBoundingClientRect().width;
      const height = document
        .getElementById(codeEditorContainer)
        .getBoundingClientRect().height;
      const classList = document.getElementById(id).classList;
      switch (true) {
        case classList.contains("resizeTop"):
          document.getElementById(codeEditorContainer).style.height =
            height - y + "px";
          break;
        case classList.contains("resizeBottom"):
          document.getElementById(codeEditorContainer).style.height =
            height + y + "px";
          break;
        case classList.contains("resizeLeft"):
          document.getElementById(codeEditorContainer).style.width =
            width - x + "px";
          break;
        case classList.contains("resizeRight"):
          document.getElementById(codeEditorContainer).style.width =
            width + x + "px";
          break;
        case classList.contains("resizeTopLeft"):
          document.getElementById(codeEditorContainer).style.height =
            height - y + "px";
          document.getElementById(codeEditorContainer).style.width =
            width - x + "px";
          break;
        case classList.contains("resizeTopRight"):
          document.getElementById(codeEditorContainer).style.height =
            height - y + "px";
          document.getElementById(codeEditorContainer).style.width =
            width + x + "px";
          break;
        case classList.contains("resizeBottomLeft"):
          document.getElementById(codeEditorContainer).style.height =
            height + y + "px";
          document.getElementById(codeEditorContainer).style.width =
            width - x + "px";
          break;
        case classList.contains("resizeBottomRight"):
          document.getElementById(codeEditorContainer).style.height =
            height + y + "px";
          document.getElementById(codeEditorContainer).style.width =
            width + x + "px";
          break;
      }
    });
    document.addEventListener("pointerup", (ev) => {
      isDragging.set(id, false);
    });
  }
}

export const projectHomeScreen = new ProjectHomeScreen();
