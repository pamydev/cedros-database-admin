import { addMessageToMessageBox } from "@leftMenu";

export const updateMessageBoxWhenCursorEnterElement = (arg0: {
  elementId: string;
  messageText: string;
}) => {
  const { elementId, messageText } = arg0;

  const el = document.getElementById(elementId);

  el.addEventListener("mouseenter", () => {
    addMessageToMessageBox({ message: messageText });
  });
  el.addEventListener("mouseleave", () => {
    addMessageToMessageBox({ message: "" });
  });
};
