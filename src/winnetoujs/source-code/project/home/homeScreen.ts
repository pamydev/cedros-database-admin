import {
  $buttonPrimary,
  $codeEditor,
  $div,
  $option,
  $select,
  $span,
  $table,
  $td,
  $th,
  $tr,
} from "@common";
import { Screen } from "@screens/screen";
import { IDatabasesColl } from "../../../../../types/contracts";
import { listItem } from "@helpers/listItem.helper";
import { Database, Move } from "lucide";
import { W } from "winnetoujs";
import { suggestions, suggestionSelect } from "./suggestions";
import { colorizeAndFormat } from "./colorizeAndFormat";
import { createIcon } from "@icons";
import { updateMessageBoxWhenCursorEnterElement } from "@helpers/messageBox.helper";
import { createCodeDiv } from "./codeDiv/codeDiv";

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
      this.renderMongifyCodeDiv(db);
    }
  }

  private async renderMongifyCodeDiv(db: IDatabasesColl) {
    const codeDivResponse = createCodeDiv({
      panelOutput: this.panelOutput,
      title: db.database_name,
      type: db.type,
    });

    const { output, right } = codeDivResponse;

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

  private printMongifyResult(arg0: { result: {}[] | any; command: string }) {
    const codeDivResponse = createCodeDiv({
      panelOutput: this.panelOutput,
      title: arg0.command,
      type: "mongify",
    });
    const { output, right } = codeDivResponse;
    let resultDiv: string;

    const printJson = () => {
      document.getElementById(resultDiv)?.remove();
      const formattedResult = this.formatJSON({
        content: arg0.result,
      });
      resultDiv = new $div({
        content: formattedResult,
        class: "mongify-output",
      }).create(output).ids.div;
    };

    const printTable = () => {
      document.getElementById(resultDiv)?.remove();
      resultDiv = new $div({
        class: "mongify-output",
      }).create(output).ids.div;

      const content = arg0.result;

      console.log({
        objectKeys: Object.keys(content[0]),
      });

      if (Object.keys(content[0])[0] == "0") {
        new $div({
          content: "No data available",
        }).create(resultDiv);
        return;
      }

      const table = new $table().create(resultDiv);
      let tr1 = table.ids.thead_tr_output;

      let columns = new Set<string>();

      content.forEach((obj: any) => {
        const tr = new $tr().create(table.ids.tbody_output).ids.tr;
        const keys = Object.keys(obj);
        keys.forEach((key) => {
          const value = obj[key];
          columns.add(key);
        });
        columns.forEach((column) => {
          if (keys.includes(column)) {
            const key = column;
            const value = obj[key];
            console.log("typeof value", typeof value);
            new $td({
              content:
                typeof value !== "string" &&
                typeof value !== "number" &&
                typeof value !== "boolean"
                  ? JSON.stringify(value)
                  : value,
            }).create(tr);
          }
        });
      });

      columns.forEach((column) => {
        new $th({ scope: "col", content: column }).create(
          table.ids.thead_tr_output,
        );
      });

      // const table = new $table().create(resultDiv);
      // let tr1 = table.ids.thead_tr_output;
      // new $td({ content: "Name" }).create(tr1);
      // new $td({ content: "Age" }).create(tr1);
      // new $td({ content: "Role" }).create(tr1);
      // let tr = new $tr().create(table.ids.tbody_output).ids.tr;
      // new $td({ content: "John" }).create(tr);
      // new $td({ content: "38" }).create(tr);
      // new $td({ content: "Senior" }).create(tr);
    };

    const selectFormat = new $select({
      onchange: W.fx(() => {
        const format = (
          document.getElementById(selectFormat) as HTMLSelectElement
        ).value;
        if (format === "JSON") {
          printJson();
        } else if (format === "Table") {
          printTable();
        }
      }),
    }).create(right).ids.select;

    new $option({
      content: "JSON",
      value: "JSON",
    }).create(selectFormat);

    new $option({
      content: "Table",
      value: "Table",
    }).create(selectFormat);

    printJson();
  }

  private formatJSON(arg0: { content: {} }) {
    let content = arg0.content;

    return JSON.stringify(content, null, 2)
      .replace(/\n/g, "<br>")
      .replace(/ /g, "&nbsp;")
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
      .replace(/(".*?")/g, '<span class="json-key">$1</span>');
  }
}

export const projectHomeScreen = new ProjectHomeScreen();
