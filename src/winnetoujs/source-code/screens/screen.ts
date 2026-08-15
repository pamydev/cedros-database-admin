import { $div } from "@common";
import { createElement, ChevronLeft, ChevronRight } from "lucide";
import { W } from "winnetoujs";
export class Screen {
  protected render() {
    throw new Error("Method not implemented.");
  }

  protected buildScreen(args0: {
    output: string;
    title: string;
    identifier: string;
  }) {
    if (this.exists(args0.identifier)) return;

    const output = new $div(
      {
        class: "screen",
      },
      { identifier: args0.identifier },
    ).create("#app").ids.div;

    this.createScreenHeader({
      output: output,
      title: args0.title,
    });

    const content = this.createScreenContent({
      output: output,
    });
    return content;
  }

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
    }).create(args0.output).ids.div;
    return content;
  }
}
