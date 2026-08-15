import { ipcMain } from "electron";
import { ipcChannels } from "../ipc.channels";
import { database } from "../../types/ipc";

export const databaseIPCApi = () => {
  ipcMain.handle(
    ipcChannels.create_new_project,
    async (event, args: Parameters<database["createNewProject"]>[0]) => {
      console.log(
        "Received request to create new project from databaseIPCApi:",
        args,
      );
      // Here you would implement the logic to create a new project.
      // For now, we will just return true to indicate success.
      return true;
    },
  );
};
