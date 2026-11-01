import { IDatabasesColl } from "@projectTypes/contracts";
import { createCodeDiv } from "../codeDiv/codeDiv";
import { $codeEditor } from "@common";
import { printMongifyResult } from "./mongify.result";
import { suggestions, suggestionSelect } from "./suggestions";
import { colorizeAndFormat } from "./colorizeAndFormat";

export const renderMongifyCodeDiv = (arg0: {
  db: IDatabasesColl;
  panelOutput: string;
}) => {
  const { db, panelOutput } = arg0;

  const codeDivResponse = createCodeDiv({
    panelOutput: panelOutput,
    title: db.database_name,
    type: db.type,
  });

  const { output } = codeDivResponse;

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

        printMongifyResult({
          panelOutput,
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
};
