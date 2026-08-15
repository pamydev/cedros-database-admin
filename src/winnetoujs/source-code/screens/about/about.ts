import { $div } from "@common";
import { Screen } from "../screen";

export class AboutScreen extends Screen {
  render() {
    const content = this.buildScreen({
      output: "screen",
      title: "About",
      identifier: "about",
    });

    new $div({
      class: "about-screen",
      content: "About Screen Content",
    }).create(content);
  }
}
