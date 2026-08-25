import { mongify } from "./mongify.suggestions";
import { createIcon } from "@icons";
import { $div } from "@common";
import { Box, CornerDownLeft } from "lucide";

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
    if (!suggestionsIsVisible) return;
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
    } else if (type === "function") {
      // must use this regex (/db\.[^.]+\.(.+)/)?.[1] to insert content before
      const text = editor.innerText;
      const match = text.match(/db\.[^.]+\.(.+)/);
      const beforeFunction = match?.[1] || "";
      editor.innerText = text.replace(beforeFunction, content);
    }
    editor.focus();

    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false); // false significa final

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    position = 0;
    selectedPosition = 0;
    removeSuggestionBox();
  }
};

export const suggestions = (args0: {
  e: KeyboardEvent;
  codeEditor: string;
  output: string;
}) => {
  const key = args0.e.key;

  if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter") return;

  const { codeEditor, output } = args0;
  const codeEditorElement = document.getElementById(codeEditor);
  const text = codeEditorElement.innerText;

  const regExPreFunction = /db\.[^.]+\./;
  const regExFunction = /db\.[^.]+\.(.+)/;
  const functionText = text.match(regExFunction)?.[1] || "";
  const command = text.split("db.")[1];
  let suggestionsAvailable: string[] = [];
  let type: "method" | "collection" | "function";

  if (text.match(regExPreFunction)) {
    type = "function";
    suggestionsAvailable = mongify.getCollectionFunctions.filter((method) => {
      if (method.startsWith(functionText) || functionText === "") return true;
      return false;
    });
  } else {
    type = "method";
    suggestionsAvailable = mongify.methods.filter((method) => {
      if (method.startsWith(command) || command === "") return true;
      return false;
    });
  }

  console.table({
    emptyCommand: command === "",
    command,
    suggestionsAvailable,
    mongify_methods: mongify.methods,
  });
  console.log(JSON.stringify(command), command.length);

  totalItems = suggestionsAvailable.length;

  console.log("methodsAvailable", suggestionsAvailable);
  const cursorPosition = getCursorPosition();
  removeSuggestionBox();
  console.log(cursorPosition);
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
