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
}

declare global {
  interface Window {
    systemAPI: systemApi;
    database: database;
  }
}
