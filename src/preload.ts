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
  loadProjects: () => ipcRenderer.invoke(ipcChannels.load_projects),
  getProjectById: (projectId: string) =>
    ipcRenderer.invoke(ipcChannels.get_project_by_id, projectId),
  saveMongoConnection: (args0) =>
    ipcRenderer.invoke(ipcChannels.save_mongo_connection, args0),
  saveMongifyConnection: (args) =>
    ipcRenderer.invoke(ipcChannels.save_mongify_connection, args),
  mongify: {
    getCollections: () =>
      ipcRenderer.invoke(ipcChannels.mongify.get_collections),
  },
  listDatabases: () => ipcRenderer.invoke(ipcChannels.list_databases),
};

contextBridge.exposeInMainWorld("systemAPI", systemAPI);
contextBridge.exposeInMainWorld("database", database);
