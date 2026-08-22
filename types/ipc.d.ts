import { IProjects } from "./mongify";

export {};

export interface systemApi {
  getAccentColor: () => Promise<string>;
}

export interface IProject {
  projectId: string;
  name: string;
  description: string;
  image: string | null;
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

export interface IDatabasesColl {
  type: "mongo" | "mongify" | "redis";
  projectId: string;
  database_name: string;
  databaseId: string;
  internalId: string;
}

export interface IMongifyConnectionsColl {
  internalId: string;
  databasePath: string;
  databaseName: string;
  projectId: string;
}

export interface ISaveMongifyConnection {
  databasePath: string;
  databaseName: string;
  projectId: string;
}

export interface IGetMongifyCollectionsArgs {
  databaseId: string;
  projectId: string;
}

export interface mongifyMethods {
  getCollections: (
    args0: IGetMongifyCollectionsArgs,
  ) => Promise<string[] | undefined>;
}

export interface database {
  createNewProject: (args: ICreateNewProjectArgs) => Promise<boolean>;
  loadProjects: () => Promise<IProjects[]>;
  getProjectById: (projectId: string) => Promise<IProjects | null>;
  saveMongoConnection: (args0: ISaveMongoConnection) => Promise<boolean>;
  saveMongifyConnection: (args: ISaveMongifyConnection) => Promise<boolean>;
  listDatabases: (projectId: string) => Promise<IDatabasesColl[]>;
  mongify: mongifyMethods;
}

declare global {
  interface Window {
    systemAPI: systemApi;
    database: database;
  }
}
