import { database, systemAPI } from "../src/preload";

declare global {
  interface Window {
    systemAPI: typeof systemAPI;
    database: typeof database;
  }
}
