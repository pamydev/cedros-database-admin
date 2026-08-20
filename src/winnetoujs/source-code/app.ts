import { leftMenu } from "./left-menu/left-menu";
import { appRouter } from "./router/router";
window.addEventListener("DOMContentLoaded", () => {
  leftMenu.render();
  document
    .getElementById("menuItem-win-new-project")
    ?.classList.add("is-active");
  appRouter.methods.selectProject.go();
});
