import { IconNode, createElement } from "lucide";
import { $div } from "../common/common.wcto";

export const createIcon = (icon: IconNode) => {
  return new $div({
    class: "__icon__",
    content: createElement(icon).outerHTML,
  }).constructoString();
};
