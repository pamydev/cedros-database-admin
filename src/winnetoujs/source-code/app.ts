import { LeftMenu } from "./left-menu/left-menu";
import { appRouter } from "./router/router";
import { SelectProjectScreen } from "./screens/select-project/select-project";
window.addEventListener("DOMContentLoaded", () => {
  new LeftMenu().render();
  document
    .getElementById("menuItem-win-new-project")
    ?.classList.add("is-active");
  appRouter.methods.selectProject.go();
});
