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

const addSuggestionItem = (args0: { method: string; output: string }) => {
  const item = new $div({
    class: "__item",
  }).create(args0.output).ids.div;

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

export const suggestions = (args0: { codeEditor: string; output: string }) => {
  const { codeEditor, output } = args0;
  const codeEditorElement = document.getElementById(codeEditor);
  const text = codeEditorElement.innerText;
  console.log({ text });
  const command = text.split("db.")[1];
  const methodsAvailable = mongify.methods.filter((method) => {
    if (method.includes(command)) return method;
  });
  console.log("methodsAvailable", methodsAvailable);
  const position = getCursorPosition();
  document.getElementById("div-win-suggestion-box")?.remove();
  console.log(position);
  const suggestionBox = new $div(
    {
      style: `top:${position.bottom}px;left:${position.left}px;`,
      class: "suggestion-box",
    },
    { identifier: "suggestion-box" },
  ).create(output).ids.div;

  methodsAvailable.forEach((method) =>
    addSuggestionItem({ method, output: suggestionBox }),
  );

  if (methodsAvailable.length === 0) {
    document.getElementById("div-win-suggestion-box")?.remove();
  }
};
