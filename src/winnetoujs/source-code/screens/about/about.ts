import { $div } from "@common";
import { Screen } from "../screen";

class AboutScreen extends Screen {
  private output: string;
  render() {
    const content = this.buildScreen({
      output: "screen",
      title: "About",
      identifier: "about",
    });

    if (content === "exists") return;
    this.output = content;

    new $div({
      class: "about-screen",
      content: "About Screen Content",
    }).create(content);
  }
}

export const aboutScreen = new AboutScreen();
