import { IconNode, createElement } from "lucide";
import { $div } from "../common/common.wcto";

export const createIcon = (icon: IconNode, simple?: boolean) => {
  return new $div({
    class: simple ? "__simpleIcon__" : "__icon__",
    content: createElement(icon).outerHTML,
  }).constructoString();
};
