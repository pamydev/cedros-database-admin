export {};

export interface systemApi {
  getAccentColor: () => Promise<string>;
}

export interface database {
  createNewProject: (args: { name: string }) => Promise<boolean>;
}

declare global {
  interface Window {
    systemAPI: systemApi;
    database: database;
  }
}
