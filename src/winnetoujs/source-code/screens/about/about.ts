import { $div } from "@common";
import { Screen } from "../screen";

export class AboutScreen extends Screen {
  render() {
    if (this.exists("about-screen")) return;

    const output = new $div(
      {
        class: "screen",
      },
      { identifier: "about-screen" },
    ).create("#app").ids.div;

    this.createScreenHeader({
      output: output,
      title: "About",
    });
  }
}
