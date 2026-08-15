import { $div } from "@common";
import { createScreenHeader } from "../../helpers/screen-header.helper";

export class SelectProject {
  render() {
    const output = new $div({
      class: "screen",
    }).create("#app").ids.div;

    createScreenHeader({
      output: output,
      title: "Select Project",
    });
  }
}
