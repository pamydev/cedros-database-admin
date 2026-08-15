import { LeftMenu } from "./left-menu/left-menu";
import { SelectProject } from "./screens/select-project/select-project";
window.addEventListener("DOMContentLoaded", () => {
  new LeftMenu().render();
  new SelectProject().render();
});
