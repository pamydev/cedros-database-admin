let isAwaiting = false;
export const colorize = async (args0: {
  e: KeyboardEvent;
  codeEditorDiv: string;
}) => {
  const { e, codeEditorDiv } = args0;

  if (isAwaiting) return;
  isAwaiting = true;
  await new Promise((resolve) => setTimeout(() => resolve(true), 500));
  isAwaiting = false;

  if (isSuggestionBoxVisible()) return;

  const textEl = document.getElementById(codeEditorDiv);
  const innerText = textEl.innerText;
  const innerHTML = textEl.innerHTML;

  let res = quotes(innerText);

  console.table({
    res,
    innerText,
    innerHTML,
  });

  if (res === innerText || res === innerHTML) return;

  const cursorPosition = saveCursorPosition(textEl);
  textEl.innerHTML = res;
  restoreCursorPosition(textEl, cursorPosition);
};

const quotes = (text: string) => {
  const regex = /("[^"]+")/g;
  const matches = text.matchAll(regex);
  for (const match of matches) {
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
