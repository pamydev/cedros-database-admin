import { ipcMain } from "electron";
import { ipcChannels } from "../ipc.channels";
import { database, ICreateNewProjectArgs } from "../../types/ipc";
import { Mongify } from "@cedrosdev/mongify";
import fs from "fs";
import path from "path";
import { IProjects } from "../../types/mongify";
import { projectRoot } from "../settings/home.dir";
const db = new Mongify({
  database_name: "cedros_database_admin",
});
const projectRootPath = projectRoot();

export const databaseIPCApi = () => {
  // ipcChannels.create_new_project
  ipcMain.handle(
    ipcChannels.create_new_project,
    async (event, args: ICreateNewProjectArgs) => {
      const { name, description, file } = args;
      // save the file in project folder
      let imageName = null;
      if (file) {
        const projectDir = path.join(projectRootPath, "projects", name);

        if (!fs.existsSync(projectDir)) {
          fs.mkdirSync(projectDir, { recursive: true });
        }

        imageName =
          "cover." + file.name.split(".")[file.name.split(".").length - 1];

        const filePath = path.join(projectDir, imageName);
        fs.writeFileSync(filePath, Buffer.from(file.data));
      }

      const res = await db.getCollection<IProjects>("projects").insert({
        name,
        description,
        image: imageName,
      });

      return true;
    },
  );

  ipcMain.handle(ipcChannels.load_projects, async () => {
    const projects = await db.getCollection<IProjects>("projects").find();
    return projects;
  });
};
