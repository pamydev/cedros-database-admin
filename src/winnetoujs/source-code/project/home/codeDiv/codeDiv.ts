import { $div, $span } from "@common";
import { updateMessageBoxWhenCursorEnterElement } from "@helpers/messageBox.helper";
import { W } from "winnetoujs";

let globalZIndex = 1;

const incrementZIndexToCodeDivBecomeToFrontOnClick = (arg0: {
  codeDivId: string;
}) => {
  const { codeDivId } = arg0;
  const codeDiv = document.getElementById(codeDivId);
  globalZIndex++;
  codeDiv.style.zIndex = String(globalZIndex);
};

const addResizeContainerListeners = (arg0: {
  id: string;
  codeEditorContainer: string;
}) => {
  const { id, codeEditorContainer } = arg0;
  let isDragging = new Map<string, boolean>();
  let posX = 0;
  let posY = 0;
  document.getElementById(id).addEventListener("pointerdown", (ev) => {
    isDragging.set(id, true);
  });
  document.addEventListener("pointermove", (ev) => {
    if (!isDragging.get(id)) return;
    // ^^^^^^^^^^^^^^^^^^^^
    const x = ev.movementX;
    const y = ev.movementY;
    const width = document
      .getElementById(codeEditorContainer)
      .getBoundingClientRect().width;
    const height = document
      .getElementById(codeEditorContainer)
      .getBoundingClientRect().height;
    const classList = document.getElementById(id).classList;
    switch (true) {
      case classList.contains("resizeTop"):
        document.getElementById(codeEditorContainer).style.height =
          height - y + "px";
        break;
      case classList.contains("resizeBottom"):
        document.getElementById(codeEditorContainer).style.height =
          height + y + "px";
        break;
      case classList.contains("resizeLeft"):
        document.getElementById(codeEditorContainer).style.width =
          width - x + "px";
        break;
      case classList.contains("resizeRight"):
        document.getElementById(codeEditorContainer).style.width =
          width + x + "px";
        break;
      case classList.contains("resizeTopLeft"):
        document.getElementById(codeEditorContainer).style.height =
          height - y + "px";
        document.getElementById(codeEditorContainer).style.width =
          width - x + "px";
        break;
      case classList.contains("resizeTopRight"):
        document.getElementById(codeEditorContainer).style.height =
          height - y + "px";
        document.getElementById(codeEditorContainer).style.width =
          width + x + "px";
        break;
      case classList.contains("resizeBottomLeft"):
        document.getElementById(codeEditorContainer).style.height =
          height + y + "px";
        document.getElementById(codeEditorContainer).style.width =
          width - x + "px";
        break;
      case classList.contains("resizeBottomRight"):
        document.getElementById(codeEditorContainer).style.height =
          height + y + "px";
        document.getElementById(codeEditorContainer).style.width =
          width + x + "px";
        break;
    }
  });
  document.addEventListener("pointerup", (ev) => {
    isDragging.set(id, false);
  });
};

const positionStore = new Map();
const createResizeManagementButton = (arg0: {
  idToInsert: string;
  codeDivToResizeOrClose: string;
}) => {
  const { idToInsert, codeDivToResizeOrClose } = arg0;
  const container = new $div({ class: "managementDotContainer" }).create(
    idToInsert,
  ).ids.div;
  const redDot = new $div({
    class: "managementDot red",
    onclick: W.fx(() => {
      document.getElementById(codeDivToResizeOrClose).remove();
    }),
  }).create(container).ids.div;
  updateMessageBoxWhenCursorEnterElement({
    elementId: redDot,
    messageText: "Close window",
  });

  const yellowDot = new $div({
    class: "managementDot yellow",
    onclick: W.fx(() => {
      if (!positionStore.has(`${codeDivToResizeOrClose}:top`)) return;
      const el = document.getElementById(codeDivToResizeOrClose);
      el.style.position = "absolute";
      el.style.top = positionStore.get(`${codeDivToResizeOrClose}:top`) + "px";
      el.style.left =
        positionStore.get(`${codeDivToResizeOrClose}:left`) + "px";
      el.style.width =
        positionStore.get(`${codeDivToResizeOrClose}:width`) + "px";
      el.style.height =
        positionStore.get(`${codeDivToResizeOrClose}:height`) + "px";

      positionStore.delete(`${codeDivToResizeOrClose}:top`);
      positionStore.delete(`${codeDivToResizeOrClose}:left`);
      positionStore.delete(`${codeDivToResizeOrClose}:width`);
      positionStore.delete(`${codeDivToResizeOrClose}:height`);
    }),
  }).create(container).ids.div;
  updateMessageBoxWhenCursorEnterElement({
    elementId: yellowDot,
    messageText: "Minimize window",
  });
  const greenDot = new $div({
    class: "managementDot green",
    onclick: W.fx(() => {
      const el = document.getElementById(codeDivToResizeOrClose);

      const previousTop = el.offsetTop;
      const previousLeft = el.offsetLeft;
      const previousWidth = el.getBoundingClientRect().width;
      const previousHeight = el.getBoundingClientRect().height;

      positionStore.set(`${codeDivToResizeOrClose}:top`, previousTop);
      positionStore.set(`${codeDivToResizeOrClose}:left`, previousLeft);
      positionStore.set(`${codeDivToResizeOrClose}:width`, previousWidth);
      positionStore.set(`${codeDivToResizeOrClose}:height`, previousHeight);

      el.style.position = "absolute";
      el.style.top = "0px";
      el.style.left = "0px";
      el.style.width = "100%";
      el.style.height = "100%";
    }),
  }).create(container).ids.div;
  updateMessageBoxWhenCursorEnterElement({
    elementId: greenDot,
    messageText: "Maximize window",
  });
};

const addMovementOfGrabTitleListener = (arg0: {
  id: string;
  output: string;
}) => {
  const { id, output } = arg0;
  const grabIconElement = document.getElementById(id);
  if (!grabIconElement) return;

  grabIconElement.addEventListener("pointerdown", (e) => {
    e.preventDefault();

    const onPointerMove = (ev: PointerEvent) => {
      const outputElement = document.getElementById(output);
      if (!outputElement) return;

      // get position before turns it absolute
      // because absolute turn it to 0,0
      let leftOrigin = outputElement.offsetLeft;
      let topOrigin = outputElement.offsetTop;
      outputElement.style.position = "absolute";

      let newLeftPosition = leftOrigin + ev.movementX;
      let newTopPosition = topOrigin + ev.movementY;
      if (newLeftPosition < 0) newLeftPosition = 0;
      if (newTopPosition < 0) newTopPosition = 0;
      outputElement.style.left = newLeftPosition + "px";
      outputElement.style.top = newTopPosition + "px";
    };
    const onPointerUp = () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  });
};

const createCodeDivHeader = (arg0: {
  output: string;
  type: "mongify" | "mongo" | "redis";
  title: string;
}) => {
  const { output, type, title } = arg0;

  const header = new $div({
    class: "mongify-header",
  }).create(output).ids.div;

  const left = new $div({
    class: "mongify-header-left",
    style: "width:100%",
  }).create(header).ids.div;

  const right = new $div({
    class: "mongify-header-right",
  }).create(header).ids.div;

  // ----------

  const resizeManagementButtonsDiv = new $div().create(left).ids.div;
  createResizeManagementButton({
    idToInsert: resizeManagementButtonsDiv,
    codeDivToResizeOrClose: output,
  });
  const nameOfWindowDiv = new $div({
    style: "display:flex;align-items:center;width:100%;",
  }).create(left).ids.div;

  addMovementOfGrabTitleListener({
    id: nameOfWindowDiv,
    output,
  });

  const label = new $span({
    content: type,
    class: `__span-${type}__`,
  }).create(nameOfWindowDiv);

  new $div({
    content: title,
    class: "mongify-command",
  }).create(nameOfWindowDiv);

  return { right };
};

export const createCodeDiv = (arg0: {
  panelOutput: string;
  type: "mongify" | "mongo" | "redis";
  title: string;
}) => {
  const { panelOutput, type, title } = arg0;
  const output = new $div({
    class: "PANEL codeDiv",
    style: "position:relative",
  }).create(panelOutput).ids.div;

  let res = createCodeDivHeader({ output, type, title });

  document.getElementById(output).addEventListener("pointerdown", () =>
    incrementZIndexToCodeDivBecomeToFrontOnClick({
      codeDivId: output,
    }),
  );

  const resizeTop = new $div({
    class: "resizeDiv resizeTop",
  }).create(output).ids.div;

  const resizeRight = new $div({
    class: "resizeDiv resizeRight",
  }).create(output).ids.div;

  const resizeBottom = new $div({
    class: "resizeDiv resizeBottom",
  }).create(output).ids.div;

  const resizeLeft = new $div({
    class: "resizeDiv resizeLeft",
  }).create(output).ids.div;

  const resizeTopLeft = new $div({
    class: "resizeDiv resizeTopLeft",
  }).create(output).ids.div;

  const resizeBottomLeft = new $div({
    class: "resizeDiv resizeBottomLeft",
  }).create(output).ids.div;

  const resizeBottomRight = new $div({
    class: "resizeDiv resizeBottomRight",
  }).create(output).ids.div;

  const resizeTopRight = new $div({
    class: "resizeDiv resizeTopRight",
  }).create(output).ids.div;

  [
    resizeBottom,
    resizeBottomLeft,
    resizeBottomRight,
    resizeLeft,
    resizeRight,
    resizeTop,
    resizeTopLeft,
    resizeTopRight,
  ].forEach((id) => {
    addResizeContainerListeners({
      id,
      codeEditorContainer: output,
    });
  });
  return { output, right: res.right };
};
