import { mongify } from "./mongify.suggestions";
import { createIcon } from "@icons";
import { $div } from "@common";
import { Box } from "lucide";

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

const addSuggestionItem = (args0: { method: string; output: string }) => {
  const item = new $div({
    class: `__suggestion-item ${selectedPosition === position ? "__selected__" : ""}`,
    data: `data-position="${position}" data-content="${args0.method}"`,
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
    content: "(method)",
    class: "__description",
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
    args0.e.preventDefault();
    const selectedEl = document.querySelector(
      `[data-position="${selectedPosition}"]`,
    ) as HTMLElement;
    const content = selectedEl.dataset.content;

    const editor = document.getElementById(args0.codeEditor) as HTMLElement;

    editor.innerText = "db." + content;
    editor.focus();

    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false); // false significa final

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    position = 0;
    selectedPosition = 0;
    document.getElementById("div-win-suggestion-box")?.remove();
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
  console.log({ text });
  const command = text.split("db.")[1];

  const methodsAvailable = mongify.methods.filter((method) => {
    if (method.includes(command)) return method;
  });

  totalItems = methodsAvailable.length;

  console.log("methodsAvailable", methodsAvailable);
  const cursorPosition = getCursorPosition();
  document.getElementById("div-win-suggestion-box")?.remove();
  console.log(cursorPosition);
  const suggestionBox = new $div(
    {
      style: `top:${cursorPosition.bottom}px;left:${cursorPosition.left}px;`,
      class: "suggestion-box",
    },
    { identifier: "suggestion-box" },
  ).create(output).ids.div;

  position = 0;
  selectedPosition = 0;
  methodsAvailable.forEach((method) =>
    addSuggestionItem({ method, output: suggestionBox }),
  );

  if (methodsAvailable.length === 0) {
    document.getElementById("div-win-suggestion-box")?.remove();
  }
};
