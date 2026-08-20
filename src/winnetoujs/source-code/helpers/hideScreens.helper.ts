export const hideScreens = () => {
  document.querySelectorAll<HTMLElement>(".screen").forEach((item) => {
    document.getElementById(item.id)?.style.setProperty("display", "none");
  });
};
