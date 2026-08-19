import path from "path";
export const projectRoot = () => {
  const home_dir =
    process.env.APPDATA ||
    (process.platform == "darwin"
      ? process.env.HOME + "/Library"
      : process.env.HOME + "/.local/share");
  const projectRoot = path.join(home_dir, "Cedros Database Admin");
  return projectRoot;
};
