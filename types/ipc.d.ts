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

export interface database {
  createNewProject: (args: ICreateNewProjectArgs) => Promise<boolean>;
  loadProjects: () => Promise<IProjects[]>;
  getProjectById: (projectId: string) => Promise<IProjects | null>;
}

declare global {
  interface Window {
    systemAPI: systemApi;
    database: database;
  }
}
