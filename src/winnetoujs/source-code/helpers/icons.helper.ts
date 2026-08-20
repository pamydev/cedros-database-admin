import { IconNode, createElement } from "lucide";
import { $div } from "../common/common.wcto";
interface ICreateIconArgs {
  simple?: boolean;
  color?: "default" | "red" | "blue" | "green" | "yellow" | "grey" | "black";
}
export const createIcon = (icon: IconNode, args0?: ICreateIconArgs) => {
  let finalClass = "__icon__";

  if (args0?.simple) {
    finalClass = "__simpleIcon__";
  }

  if (args0?.color) {
    finalClass += " __" + args0.color;
  }

  return new $div({
    class: finalClass,
    content: createElement(icon).outerHTML,
  }).constructoString();
};
