import { IProjects } from "./mongify";

export {};

export interface systemApi {
  getAccentColor: () => Promise<string>;
}

export interface ICreateNewProjectArgs {
  name: string;
  description: string;
  file: {
    name: string;
    type: string;
    data: ArrayBuffer;
  } | null;
}

export interface ISaveMongoConnection {
  _id?: any;
  uri: string;
  name: string;
  userName: string;
  password: string;
  database: string;
  projectId: string;
}

export interface database {
  createNewProject: (args: ICreateNewProjectArgs) => Promise<boolean>;
  loadProjects: () => Promise<IProjects[]>;
  getProjectById: (projectId: string) => Promise<IProjects | null>;
  saveMongoConnection: (args0: ISaveMongoConnection) => Promise<boolean>;
}

declare global {
  interface Window {
    systemAPI: systemApi;
    database: database;
  }
}
