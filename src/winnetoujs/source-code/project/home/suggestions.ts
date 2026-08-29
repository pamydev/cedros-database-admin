import { mongify } from "./mongify.suggestions";
import { createIcon } from "@icons";
import { $div } from "@common";
import { Box, CornerDownLeft } from "lucide";
import {
  restoreCursorPosition,
  saveCursorPosition,
  setCursorPositionInEndOfLine,
} from "./cursor";
import { colorizeAndFormat } from "./colorizeAndFormat";

const getCursorPosition = () => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return { left: 0, bottom: 0 };
  }

  const originalRange = selection.getRangeAt(0).cloneRange();
  const measurementRange = originalRange.cloneRange();
  measurementRange.collapse(true);

  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  marker.style.cssText = `
    visibility: hidden;
    pointer-events: none;
  `;

  measurementRange.insertNode(marker);

  const markerParent = marker.parentNode;
  const markerRect = marker.getBoundingClientRect();

  marker.remove();

  // Reúne os nós de texto que podem ter sido separados pelo insertNode.
  markerParent?.normalize();

  // Restaura o cursor original.
  selection.removeAllRanges();
  selection.addRange(originalRange);

  return {
    left: markerRect.left,
    bottom: markerRect.bottom + 4,
  };
};

let position = 0;
let selectedPosition = 0;
let totalItems = 0;
let suggestionsIsVisible = false;
let collectionsList = new Map<string, string[]>();
let fieldsList = new Map<string, string[]>();

const getCollectionsList = async (args0: {
  projectId: string;
  databaseId: string;
}): Promise<string[]> => {
  const identifier = `${args0.projectId}-${args0.databaseId}`;
  if (collectionsList.has(identifier)) return collectionsList.get(identifier);

  let res = (await window.database.mongify.sendQuery({
    command: "db.listCollections()",
    databaseId: args0.databaseId,
    projectId: args0.projectId,
  })) as string[];

  collectionsList.set(identifier, res);
  return res;
};

const getFieldsList = async (args0: {
  collectionName: string;
  databaseId: string;
  projectId: string;
}): Promise<string[]> => {
  const { collectionName, databaseId, projectId } = args0;
  const identifier = `${args0.projectId}-${args0.databaseId}`;
  if (fieldsList.has(identifier)) return fieldsList.get(identifier);

  let res = await window.database.mongify.sendQuery({
    command: `db.getCollection("${collectionName}").findOne()`,
    databaseId,
    projectId,
  });

  console.log("findOne getFieldsList result", res);

  const fields = Object.keys(res || {});
  fieldsList.set(identifier, fields);
  return fields;
};

const addSuggestionItem = (args0: {
  method: string;
  output: string;
  type: "method" | "collection" | "function" | "field";
}) => {
  const item = new $div({
    class: `__suggestion-item ${selectedPosition === position ? "__selected__" : ""}`,
    data: `data-position="${position}" data-content="${args0.method}" data-type="${args0.type}"`,
  }).create(args0.output).ids.div;

  position++;

  const left = new $div({
    class: "__left",
  }).create(item).ids.div;

  const right = new $div({
    class: "__right",
  }).create(item).ids.div;

  new $div({
    content: createIcon(Box, { simple: true }),
    class: "__icon",
  }).create(left);

  new $div({
    content: args0.method,
    class: "__text",
  }).create(left);

  new $div({
    content: `(${args0.type})`,
    class: "__description",
  }).create(right);

  new $div({
    class: "__enterIcon",
    content: createIcon(CornerDownLeft, { simple: true }),
  }).create(right);
};

const removeSelectedFromAllItems = () => {
  document.querySelectorAll(".__suggestion-item").forEach((el) => {
    document.getElementById(el.id).classList.remove("__selected__");
  });
};

export const suggestionSelect = (args0: {
  e: KeyboardEvent;
  codeEditor: string;
  output: string;
}): boolean => {
  let enterPressed = false;
  if (!suggestionsIsVisible) return enterPressed;
  const key = args0.e.key;
  if (key === "ArrowDown") {
    args0.e.preventDefault();
    if (selectedPosition + 1 === totalItems) return;
    selectedPosition++;
    removeSelectedFromAllItems();
    const selectedEl = document
      .querySelector(`[data-position="${selectedPosition}"]`)
      .classList.add("__selected__");
  }

  if (key === "ArrowUp") {
    args0.e.preventDefault();
    if (selectedPosition === 0) return;
    selectedPosition--;
    removeSelectedFromAllItems();
    const selectedEl = document
      .querySelector(`[data-position="${selectedPosition}"]`)
      .classList.add("__selected__");
  }

  if (key === "Enter") {
    enterPressed = true;
    args0.e.preventDefault();
    args0.e.stopPropagation();
    const selectedEl = document.querySelector(
      `[data-position="${selectedPosition}"]`,
    ) as HTMLElement;
    const content = selectedEl.dataset.content;
    const type: "method" | "collection" | "function" | "field" = selectedEl
      .dataset.type as "method" | "collection" | "function" | "field";

    const editor = document.getElementById(args0.codeEditor) as HTMLElement;

    switch (true) {
      case type === "method":
        editor.innerText = "db." + content + '("';
        break;

      case type === "collection":
        (() => {
          const text = editor.innerText;
          const regex = /(db\.getCollection\(\")([^.]+)/;
          const match = text.match(regex);
          const toBeReplaced = match?.[1];
          if (toBeReplaced === "" || !toBeReplaced) {
            editor.innerText = `db.getCollection("${content}")`;
          } else {
            editor.innerText =
              text.replace(
                regex,
                (completeMatch, group1, group2) => `${group1}${content}`,
              ) + '")';
          }
        })();
        break;

      case type === "function":
        (() => {
          const text = editor.innerText;
          const functionRegex = /(db\.[^.]+\.)(.*)/;
          const match = text.match(functionRegex);
          const toBeReplaced = match?.[1] || "";
          if (toBeReplaced === "" || !toBeReplaced) {
            editor.innerText = text + content + "(";
          } else {
            editor.innerText = text.replace(
              functionRegex,
              (completeMatch, group1, group2) => `${group1}${content}(`,
            );
          }
        })();
        break;

      case type === "field":
        (() => {
          const text = editor.innerText;
          const listFieldsRegex = /(db\.getCollection\(".+"\).find\({\s+)(.+)/;
          const match = text.match(listFieldsRegex);
          const toBeReplaced = match?.[1] || "";
          if (toBeReplaced === "" || !toBeReplaced) {
            editor.innerText = text + content + ":";
          } else {
            editor.innerText = text.replace(
              listFieldsRegex,
              (completeMatch, group1, group2) => `${group1}${content}:`,
            );
          }
        })();
        break;
    }

    setCursorPositionInEndOfLine(editor);
    removeSuggestionBox();
    colorizeAndFormat({ codeEditor: args0.codeEditor });
    return enterPressed;
  }
};

export const suggestions = async (args0: {
  e: KeyboardEvent;
  codeEditor: string;
  output: string;
  databaseId: string;
  projectId: string;
}) => {
  const key = args0.e.key;

  if (key === "ArrowDown" || key === "ArrowUp") return;

  const { codeEditor, output } = args0;
  const codeEditorElement = document.getElementById(codeEditor);
  const text = codeEditorElement.innerText;

  // regex to match .find, .insert, ...
  const regExPreFunction = /db\.[^.]+\./;
  const regExFunction = /db\.[^.]+\.(.+)/;
  const functionText = text.match(regExFunction)?.[1] || "";

  // regex to match db.getCollection(" to shows collections available
  const getCollectionPreRegex = /db\.getCollection\(\"/;
  const getCollectionRegex = /db\.getCollection\(\"([^.]+)/;
  const getCollectionText = text.match(getCollectionRegex)?.[1] || "";
  let collections: string[];

  // to match db. to show available database methods like listCollections, ...
  const command = text.split("db.")[1];

  // regex to match db.getCollection("...").find({
  // to show fields available in that collection
  const listFieldsPreRegex = /db\.getCollection\(".+"\)\.find\({[\s\n\t]+/;
  const listFieldsRegex = /db\.getCollection\(".+"\).find\({[\s\n\t]+(.*)/;
  const collectionNameRegex = /db\.getCollection\("(.+)"\)/;
  const collectionName = text.match(collectionNameRegex)?.[1] || "";
  const fieldTextMatched = text.match(listFieldsRegex)?.[1] || "";

  let suggestionsAvailable: string[] = [];
  let type: "method" | "collection" | "function" | "field";

  // fills suggestionsAvailable List
  // defines type added to list item
  switch (true) {
    case text.match(listFieldsPreRegex)?.length > 0:
      type = "field";

      const fieldsAvailable: string[] = await getFieldsList({
        collectionName,
        databaseId: args0.databaseId,
        projectId: args0.projectId,
      });

      suggestionsAvailable = fieldsAvailable.filter(
        (fields) =>
          fields.startsWith(fieldTextMatched) || fieldTextMatched === "",
      );

      break;

    case text.match(regExPreFunction)?.length > 0:
      type = "function";
      suggestionsAvailable = mongify.getCollectionFunctions.filter((method) => {
        if (method.startsWith(functionText) || functionText === "") return true;
        return false;
      });
      break;

    case text.match(getCollectionPreRegex)?.length > 0:
      type = "collection";
      collections = await getCollectionsList({
        databaseId: args0.databaseId,
        projectId: args0.projectId,
      });
      suggestionsAvailable = collections.filter(
        (coll) =>
          coll.startsWith(getCollectionText) || getCollectionText === "",
      );
      break;

    default:
      type = "method";
      suggestionsAvailable = mongify.methods.filter((method) => {
        if (method.startsWith(command) || command === "") return true;
        return false;
      });
      break;
  }

  totalItems = suggestionsAvailable.length;

  await new Promise((resolve) => setTimeout(resolve, 100));
  const cursorPosition = getCursorPosition();
  removeSuggestionBox();
  suggestionsIsVisible = true;
  console.log("suggestion box position", cursorPosition);
  const suggestionBox = new $div(
    {
      style: `top:${cursorPosition.bottom}px;left:${cursorPosition.left}px;`,
      class: "suggestion-box",
    },
    { identifier: "suggestion-box" },
  ).create(output).ids.div;

  position = 0;
  selectedPosition = 0;
  suggestionsAvailable.forEach((method) =>
    addSuggestionItem({ method, output: suggestionBox, type }),
  );

  if (suggestionsAvailable.length === 0) {
    removeSuggestionBox();
  }
};

const removeSuggestionBox = () => {
  document.getElementById("div-win-suggestion-box")?.remove();
  suggestionsIsVisible = false;
};
