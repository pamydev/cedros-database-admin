import { contextBridge, ipcRenderer } from "electron";
import { ipcChannels } from "./ipc.channels";
import {
  ICreateNewProjectArgs,
  systemApi,
  IProject,
  ISaveMongifyConnection,
  IGetMongifyCollectionsArgs,
  IMongifySendQueryArgs,
  IDatabasesColl,
} from "@projectTypes/contracts";

export const systemAPI: systemApi = {
  getAccentColor: (): Promise<string> =>
    ipcRenderer.invoke(ipcChannels.system_accent_color),
};

export const database = {
  createNewProject: (args: ICreateNewProjectArgs): Promise<boolean> =>
    ipcRenderer.invoke(ipcChannels.create_new_project, args),

  loadProjects: (): Promise<IProject[]> =>
    ipcRenderer.invoke(ipcChannels.load_projects),

  getProjectById: (projectId: string): Promise<IProject | null> =>
    ipcRenderer.invoke(ipcChannels.get_project_by_id, projectId),

  saveMongoConnection: (args0: any): Promise<boolean> =>
    ipcRenderer.invoke(ipcChannels.save_mongo_connection, args0),

  saveMongifyConnection: (args: ISaveMongifyConnection): Promise<boolean> =>
    ipcRenderer.invoke(ipcChannels.save_mongify_connection, args),

  mongify: {
    getCollections: (
      args0: IGetMongifyCollectionsArgs,
    ): Promise<string[] | undefined> =>
      ipcRenderer.invoke(ipcChannels.mongify.get_collections, args0),

    sendQuery: (args0: IMongifySendQueryArgs): Promise<{ result: any }> =>
      ipcRenderer.invoke(ipcChannels.mongify.send_query, args0),
  },

  listDatabases: (projectId: string): Promise<IDatabasesColl[]> =>
    ipcRenderer.invoke(ipcChannels.list_databases, projectId),
};

contextBridge.exposeInMainWorld("systemAPI", systemAPI);
contextBridge.exposeInMainWorld("database", database);
