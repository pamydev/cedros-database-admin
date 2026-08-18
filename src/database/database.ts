import { ipcMain } from "electron";
import { ipcChannels } from "../ipc.channels";
import { database, ICreateNewProjectArgs } from "../../types/ipc";

export const databaseIPCApi = () => {
  ipcMain.handle(
    ipcChannels.create_new_project,
    async (event, args: ICreateNewProjectArgs) => {
      console.log(
        "Received request to create new project from databaseIPCApi:",
        args.name,
        args.description,
        args.file?.name,
        // args.file ? Buffer.byteLength(args.file.data) : 0,
      );

      return true;
    },
  );
};
