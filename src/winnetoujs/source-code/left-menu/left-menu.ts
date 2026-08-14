import { $div } from "../common/common.wcto";

export class LeftMenu {
  render() {
    const output = new $div({
      class: "left-menu",
    }).create("#app").ids.div;

    new $div({
      class: "__header",
    }).create(output);
  }
}
