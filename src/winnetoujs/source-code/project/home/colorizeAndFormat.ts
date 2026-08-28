import {
  restoreCursorPosition,
  saveCursorPosition,
  setCursorPositionInEndOfLine,
} from "./cursor";

let isAwaiting = false;
let tabCount = 0;

export const colorizeAndFormat = async (args0: {
  e: KeyboardEvent;
  codeEditor: string;
}) => {
  const { e, codeEditor: codeEditor } = args0;

  //   console.log("key", e.key);

  if (e.key === "{") {
    tabCount++;
  }

  if (e.key === "}") {
    tabCount--;
    removeTab({ e, codeEditor, str: "}" });
  }

  if (e.key === "Tab") {
    insertTab({ e, codeEditor });
    return;
  }

  if (e.key === "Enter") {
    insertTab({ e, codeEditor, onPressEnter: true });
  }

  if (isDeniedKeyPressed(e)) {
    return;
  }

  if (isAwaiting) return;
  isAwaiting = true;
  await new Promise((resolve) => setTimeout(() => resolve(true), 10));
  isAwaiting = false;

  if (isSuggestionBoxVisible()) return;

  const textEl = document.getElementById(codeEditor);
  const innerText = textEl.innerText;
  const innerHTML = textEl.innerHTML;

  let res = quotes(innerText, innerHTML);

  res = res.replace(/\n/g, "<br>");

  console.log(JSON.stringify({ innerText, innerHTML, res }, null, 2));

  if (res === innerText || res === innerHTML) return;

  console.log("colorize set cursor position");
  const cursorPosition = saveCursorPosition(textEl);
  textEl.innerHTML = res;
  restoreCursorPosition(textEl, cursorPosition);
};

const quotes = (text: string, html: string) => {
  const regex = /("[^"]+")/g;
  const matches = text.matchAll(regex);
  for (const match of matches) {
    console.log("match", match[0]);

    text = text.replace(
      match[0],
      `<span class="__string__">${match[0]}</span>`,
    );
  }
  return text;
};

const isSuggestionBoxVisible = () => {
  return document.getElementById("div-win-suggestion-box") !== null;
};

const insertTab = async (args0: {
  e: KeyboardEvent;
  codeEditor: string;
  onPressEnter?: boolean;
}) => {
  const { e, codeEditor, onPressEnter } = args0;
  if (onPressEnter && tabCount === 0) return;

  if (!onPressEnter) e.preventDefault();

  // to await enter to create new line
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, 10),
  );

  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  if (
    !document
      .getElementById(codeEditor)
      ?.contains(range.commonAncestorContainer)
  )
    return;

  range.deleteContents();

  let spaces: Text;

  if (!onPressEnter) {
    tabCount++;
    spaces = document.createTextNode("\t");
  } else {
    console.log({ tabCount });
    spaces = document.createTextNode("\t".repeat(tabCount));
  }
  range.insertNode(spaces);

  // Posiciona o cursor depois dos quatro espaços.
  range.setStartAfter(spaces);
  range.collapse(true);

  selection.removeAllRanges();
  selection.addRange(range);
};

const removeTab = (args0: {
  e: KeyboardEvent;
  codeEditor: string;
  str: string;
}) => {
  const { e, codeEditor, str } = args0;
  e.preventDefault();
  const el = document.getElementById(codeEditor) as HTMLElement;
  const text = el.innerText;

  console.log(JSON.stringify({ text }, null, 2));

  let newText: string = text;

  //remove the last \n from text
  if (newText.endsWith("\n")) {
    newText = newText.slice(0, -1);
  }

  // remove last \t from text
  if (newText.endsWith("\t")) {
    newText = newText.slice(0, -1);
  }

  // add str at the end of the text
  el.innerText = newText + str;

  setCursorPositionInEndOfLine(el);
};

const isDeniedKeyPressed = (e: KeyboardEvent) =>
  e.key === "ArrowUp" ||
  e.key === "ArrowDown" ||
  e.key === "ArrowLeft" ||
  e.key === "ArrowRight" ||
  e.key === "Enter" ||
  e.key === "Escape" ||
  e.key === "Shift" ||
  e.key === "Control" ||
  e.key === "Alt" ||
  e.key === "Tab" ||
  e.key === "Meta" ||
  e.key === "CapsLock" ||
  e.key === "NumLock" ||
  e.key === "ScrollLock" ||
  e.key === "Insert" ||
  e.key === "Home" ||
  e.key === "End" ||
  e.key === "PageUp" ||
  e.key === "PageDown" ||
  e.key === "Backspace";
