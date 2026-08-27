let isAwaiting = false;
let tabCount = 0;

export const colorize = async (args0: {
  e: KeyboardEvent;
  codeEditorDiv: string;
}) => {
  const { e, codeEditorDiv } = args0;

  if (e.key === "Tab") {
    insertTab(e, codeEditorDiv);
    return;
  }

  if (isDeniedKeyPressed(e)) {
    console.log("denied key pressed", e.key);
    return;
  }

  if (isAwaiting) return;
  isAwaiting = true;
  await new Promise((resolve) => setTimeout(() => resolve(true), 500));
  isAwaiting = false;

  if (isSuggestionBoxVisible()) return;

  const textEl = document.getElementById(codeEditorDiv);
  const innerText = textEl.innerText;
  const innerHTML = textEl.innerHTML;

  let res = quotes(innerText, innerHTML);

  console.log(
    JSON.stringify(
      {
        res,
        innerText,
        innerHTML,
      },
      null,
      2,
    ),
  );

  if (res === innerText || res === innerHTML) return;

  const cursorPosition = saveCursorPosition(textEl);
  textEl.innerHTML = res;
  restoreCursorPosition(textEl, cursorPosition);
};

const quotes = (text: string, html: string) => {
  const regex = /("[^"]+")/g;
  const matches = text.matchAll(regex);
  text = text.replace(/\n/g, "<br />");
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

type CursorPosition = {
  start: number;
  end: number;
};

const saveCursorPosition = (textEl: HTMLElement): CursorPosition | null => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const currentRange = selection.getRangeAt(0);

  if (
    !textEl.contains(currentRange.startContainer) ||
    !textEl.contains(currentRange.endContainer)
  ) {
    return null;
  }

  const startRange = document.createRange();
  startRange.selectNodeContents(textEl);
  startRange.setEnd(currentRange.startContainer, currentRange.startOffset);

  const endRange = document.createRange();
  endRange.selectNodeContents(textEl);
  endRange.setEnd(currentRange.endContainer, currentRange.endOffset);

  return {
    start: startRange.toString().length,
    end: endRange.toString().length,
  };
};

const restoreCursorPosition = (
  textEl: HTMLElement,
  position: CursorPosition | null,
) => {
  if (!position) return;

  const findPosition = (targetOffset: number) => {
    const walker = document.createTreeWalker(textEl, NodeFilter.SHOW_TEXT);

    let currentOffset = 0;
    let node = walker.nextNode();

    while (node) {
      const nodeLength = node.textContent?.length ?? 0;

      if (targetOffset <= currentOffset + nodeLength) {
        return {
          node,
          offset: targetOffset - currentOffset,
        };
      }

      currentOffset += nodeLength;
      node = walker.nextNode();
    }

    return {
      node: textEl,
      offset: textEl.childNodes.length,
    };
  };

  const start = findPosition(position.start);
  const end = findPosition(position.end);

  const range = document.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset);

  const selection = window.getSelection();

  textEl.focus();
  selection?.removeAllRanges();
  selection?.addRange(range);
};

const insertTab = (e: KeyboardEvent, codeEditorDiv: string) => {
  e.preventDefault();
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // Confirma que o cursor está dentro do editor.
  if (
    !document
      .getElementById(codeEditorDiv)
      ?.contains(range.commonAncestorContainer)
  )
    return;

  range.deleteContents();

  const spaces = document.createTextNode("\t");
  range.insertNode(spaces);

  // Posiciona o cursor depois dos quatro espaços.
  range.setStartAfter(spaces);
  range.collapse(true);

  selection.removeAllRanges();
  selection.addRange(range);
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
  e.key === "PageDown";
