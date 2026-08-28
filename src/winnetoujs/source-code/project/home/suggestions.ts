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
  const range = selection.getRangeAt(0).cloneRange();
  range.collapse(true);

  const caretRect = range.getBoundingClientRect();
  return { left: caretRect.left, bottom: caretRect.bottom + 4 };
};

let position = 0;
let selectedPosition = 0;
let totalItems = 0;
let suggestionsIsVisible = false;
let collectionsList = new Map<string, string[]>();

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

const addSuggestionItem = (args0: {
  method: string;
  output: string;
  type: "method" | "collection" | "function";
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
}) => {
  if (!suggestionsIsVisible) return;
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
    args0.e.preventDefault();
    const selectedEl = document.querySelector(
      `[data-position="${selectedPosition}"]`,
    ) as HTMLElement;
    const content = selectedEl.dataset.content;
    const type: "method" | "collection" | "function" = selectedEl.dataset
      .type as "method" | "collection" | "function";

    const editor = document.getElementById(args0.codeEditor) as HTMLElement;

    if (type === "method") {
      editor.innerText = "db." + content;
    } else if (type === "collection") {
      const text = editor.innerText;
      const regex = /db\.getCollection\(\"([^.]+)/;
      const match = text.match(regex);
      const toBeReplaced = match?.[1];

      if (toBeReplaced === "" || !toBeReplaced) {
        editor.innerText = `db.getCollection("${content}")`;
      } else {
        editor.innerText = text.replace(toBeReplaced, content) + '")';
      }
    } else if (type === "function") {
      const text = editor.innerText;
      const match = text.match(/db\.[^.]+\.(.+)/);
      const toBeReplaced = match?.[1] || "";
      if (toBeReplaced === "" || !toBeReplaced) {
        editor.innerText = text + content + "(";
      } else {
        editor.innerText = text.replace(toBeReplaced, content) + "(";
      }
    }

    setCursorPositionInEndOfLine(editor);
    removeSuggestionBox();
    colorizeAndFormat({ codeEditor: args0.codeEditor });
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

  if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter") return;

  const { codeEditor, output } = args0;
  const codeEditorElement = document.getElementById(codeEditor);
  const text = codeEditorElement.innerText;

  const regExPreFunction = /db\.[^.]+\./;
  const regExFunction = /db\.[^.]+\.(.+)/;
  const functionText = text.match(regExFunction)?.[1] || "";

  const getCollectionPreRegex = /db\.getCollection\(\"/;
  const getCollectionRegex = /db\.getCollection\(\"([^.]+)/;
  const getCollectionText = text.match(getCollectionRegex)?.[1] || "";
  let collections: string[];

  const command = text.split("db.")[1];

  let suggestionsAvailable: string[] = [];
  let type: "method" | "collection" | "function";

  if (text.match(regExPreFunction)) {
    type = "function";
    suggestionsAvailable = mongify.getCollectionFunctions.filter((method) => {
      if (method.startsWith(functionText) || functionText === "") return true;
      return false;
    });
  } else if (text.match(getCollectionPreRegex)) {
    type = "collection";
    collections = await getCollectionsList({
      databaseId: args0.databaseId,
      projectId: args0.projectId,
    });
    suggestionsAvailable = collections.filter(
      (coll) => coll.startsWith(getCollectionText) || getCollectionText === "",
    );
  } else {
    type = "method";
    suggestionsAvailable = mongify.methods.filter((method) => {
      if (method.startsWith(command) || command === "") return true;
      return false;
    });
  }

  totalItems = suggestionsAvailable.length;

  const cursorPosition = getCursorPosition();
  removeSuggestionBox();
  suggestionsIsVisible = true;
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
