import { contextBridge, ipcRenderer } from "electron";
import { ipcChannels } from "./ipc.channels";
import { database, systemApi } from "../types/ipc";

const systemAPI: systemApi = {
  getAccentColor: (): Promise<string> =>
    ipcRenderer.invoke(ipcChannels.system_accent_color),
};

const database: database = {
  createNewProject: (args): Promise<boolean> =>
    ipcRenderer.invoke(ipcChannels.create_new_project, args),
};

contextBridge.exposeInMainWorld("systemAPI", systemAPI);
contextBridge.exposeInMainWorld("database", database);
