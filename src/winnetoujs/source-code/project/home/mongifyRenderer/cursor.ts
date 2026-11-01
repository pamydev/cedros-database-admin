type CursorPosition = {
  start: number;
  end: number;
};

export const saveCursorPosition = (
  textEl: HTMLElement,
): CursorPosition | null => {
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

export const restoreCursorPosition = (
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

export const setCursorPositionInEndOfLine = (textEl: HTMLElement) => {
  const range = document.createRange();
  range.selectNodeContents(textEl);
  range.collapse(false); // false significa final

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  textEl.focus();
};
