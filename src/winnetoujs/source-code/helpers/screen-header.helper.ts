import { $div } from "@common";
import { createElement, ChevronLeft, ChevronRight } from "lucide";

export const createScreenHeader = (args0: {
  output: string;
  title: string;
}) => {
  const header = new $div({
    class: "screen-header",
  }).create(args0.output).ids.div;

  const navigation = new $div({
    class: "__navigation",
  }).create(header).ids.div;

  new $div({
    class: "__icon __icon-left",

    content: createElement(ChevronLeft, { size: 17, strokeWidth: 2.2 })
      .outerHTML,
  }).create(navigation);

  new $div({
    class: "__icon-separator",
    content: " ",
  }).create(navigation);

  new $div({
    class: "__icon __icon-right",
    content: createElement(ChevronRight, { size: 17, strokeWidth: 2.2 })
      .outerHTML,
  }).create(navigation);

  new $div({
    class: "__title",
    content: args0.title,
  }).create(header);
};
