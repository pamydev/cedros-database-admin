import { $backgroundImage, $div, $image } from "@common";
import { createIcon } from "@icons";
import { ChevronRight, IconNode } from "lucide";

interface IListItem {
  output: string;
  label: string;
  subLabel?: string;
  icon?: IconNode;
  imageURL?: string;
  chevronRight?: boolean;
  onclick: string;
}

export const listItem = (args0: IListItem) => {
  const output = new $div({
    class: "LIST-ITEM",
    onclick: args0.onclick,
  }).create(args0.output).ids.div;

  const leftDiv = new $div({
    class: "LEFT",
  }).create(output).ids.div;

  if (args0.icon) {
    new $div({
      class: "ICON",
      content: createIcon(args0.icon, false),
    }).create(leftDiv);
  } else if (args0.imageURL) {
    new $backgroundImage({
      imageUrl: args0.imageURL,
      class: "IMAGE-ICON",
    }).create(leftDiv);
  }

  const label = new $div({
    class: "LABEL",
  }).create(leftDiv).ids.div;

  new $div({
    content: args0.label,
    class: "LABEL-TEXT",
  }).create(label);

  if (args0.subLabel) {
    new $div({
      content: args0.subLabel,
      class: "SUB-LABEL-TEXT",
    }).create(label);
  }

  const rightDiv = new $div({
    class: "RIGHT",
  }).create(output).ids.div;

  if (args0.chevronRight !== false) {
    new $div({
      class: "CHEVRON-RIGHT",
      content: createIcon(ChevronRight, {
        simple: true,
      }),
    }).create(rightDiv);
  }
};
