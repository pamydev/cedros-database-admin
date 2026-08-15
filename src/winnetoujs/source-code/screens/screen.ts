import { $div } from "@common";
import { createElement, ChevronLeft, ChevronRight } from "lucide";
import { W } from "winnetoujs";
export class Screen {
  protected exists(identifier: string): boolean {
    const el = `div-win-${identifier}`;
    const exists = document.getElementById(el) !== null;
    if (exists) {
      document.getElementById(el)?.style.setProperty("display", "block");
    }
    return exists;
  }

  protected createScreenHeader(args0: { output: string; title: string }) {
    const header = new $div({
      class: "screen-header",
    }).create(args0.output).ids.div;

    const navigation = new $div({
      class: "__navigation",
    }).create(header).ids.div;

    new $div({
      class: "__icon __icon-left",
      onclick: W.fx(() => {
        window.history.back();
      }),
      content: createElement(ChevronLeft, { size: 17, strokeWidth: 2.2 })
        .outerHTML,
    }).create(navigation);

    new $div({
      class: "__icon-separator",
      content: " ",
    }).create(navigation);

    new $div({
      class: "__icon __icon-right",
      onclick: W.fx(() => {
        window.history.forward();
      }),
      content: createElement(ChevronRight, { size: 17, strokeWidth: 2.2 })
        .outerHTML,
    }).create(navigation);

    new $div({
      class: "__title",
      content: args0.title,
    }).create(header);
  }

  protected createScreenContent(args0: { output: string }) {
    const content = new $div({
      class: "screen-content",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>p<p>",
    }).create(args0.output).ids.div;
  }
}
