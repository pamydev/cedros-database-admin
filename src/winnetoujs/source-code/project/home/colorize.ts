let isAwaiting = false;
export const colorize = async (args0: {
  e: KeyboardEvent;
  codeEditorDiv: string;
}) => {
  if (isAwaiting) return;
  isAwaiting = true;
  await new Promise((resolve) => setTimeout(() => resolve(true), 500));
  isAwaiting = false;

  if (isSuggestionBoxVisible()) return;

  const { e, codeEditorDiv } = args0;
  const textEl = document.getElementById(codeEditorDiv);
  const innerText = textEl.innerText;
  let res = quotes(innerText);

  if (res === innerText) return;

  textEl.innerHTML = res;
  textEl.focus();

  const range = document.createRange();
  range.selectNodeContents(textEl);
  range.collapse(false); // false significa final

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};

const quotes = (text: string) => {
  const regex = /("[^"]+")/g;
  const matches = text.matchAll(regex);
  for (const match of matches) {
    text = text.replace(
      match[0],
      `<span class='__string__'>${match[0]}</span>`,
    );
  }
  return text;
};

const isSuggestionBoxVisible = () => {
  return document.getElementById("div-win-suggestion-box") !== null;
};
