import { appRouter } from "./router/router";
window.addEventListener("DOMContentLoaded", () => {
  appRouter.methods.selectProject.go();
});
