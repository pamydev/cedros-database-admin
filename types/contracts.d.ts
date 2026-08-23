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

export interface IMongifySendQueryArgs {
  projectId: string;
  databaseId: string;
  command: string;
}
