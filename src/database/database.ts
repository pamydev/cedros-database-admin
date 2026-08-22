import { ipcMain, safeStorage } from "electron";
import { ipcChannels } from "../ipc.channels";
import {
  database,
  ICreateNewProjectArgs,
  ISaveMongoConnection,
  ISaveMongifyConnection,
  IDatabase,
} from "../../types/ipc";
import { Mongify } from "@cedrosdev/mongify";
import fs from "fs";
import path from "path";
import { IProjects } from "../../types/mongify";
import { projectRoot } from "../settings/home.dir";
const db = new Mongify({
  database_name: "cedros_database_admin",
});
const projectRootPath = projectRoot();

let mongifyClient: Mongify | null = null;

const createMongifyClient = async () => {
  if (!mongifyClient) {
    const mongifyConnection = await db
      .getCollection<ISaveMongifyConnection>("mongify_connections")
      .findOne();

    if (!mongifyConnection) {
      throw new Error("No Mongify connection found");
    }

    console.log({
      databasePath: mongifyConnection.databasePath,
      databaseName: mongifyConnection.databaseName,
    });

    mongifyClient = new Mongify({
      database_name: mongifyConnection.databaseName,
      path: mongifyConnection.databasePath,
    });

    return true;
  }
};

export const databaseIPCApi = () => {
  // ipcChannels.create_new_project
  ipcMain.handle(
    ipcChannels.create_new_project,
    async (event, args: ICreateNewProjectArgs) => {
      const { name, description, file } = args;
      // save the file in project folder
      let imageName = null;
      if (file) {
        const projectDir = path.join(projectRootPath, "projects", name);

        if (!fs.existsSync(projectDir)) {
          fs.mkdirSync(projectDir, { recursive: true });
        }

        imageName =
          "cover." + file.name.split(".")[file.name.split(".").length - 1];

        const filePath = path.join(projectDir, imageName);
        fs.writeFileSync(filePath, Buffer.from(file.data));
      }

      const res = await db.getCollection<IProjects>("projects").insert({
        name,
        description,
        image: imageName,
      });

      return true;
    },
  );

  // ipcChannels.load_projects
  ipcMain.handle(ipcChannels.load_projects, async () => {
    const projects = await db.getCollection<IProjects>("projects").find();
    return projects;
  });

  // ipcChannels.get_project_by_id
  ipcMain.handle(
    ipcChannels.get_project_by_id,
    async (event, projectId: string) => {
      const project = await db
        .getCollection<IProjects>("projects")
        .findOne({ _id: projectId });
      return project;
    },
  );

  // ipcChannels.list_databases
  ipcMain.handle(
    ipcChannels.save_mongo_connection,
    async (event, args0: ISaveMongoConnection) => {
      await (!safeStorage.isEncryptionAvailable()
        ? Promise.reject(
            new Error("Encryption is not available on this system"),
          )
        : Promise.resolve());

      const encryptedPassword = safeStorage
        .encryptString(args0.password)
        .toString("base64");

      const doc: ISaveMongoConnection = {
        projectId: args0.projectId,
        database: args0.database,
        name: args0.name,
        password: encryptedPassword,
        uri: args0.uri,
        userName: args0.userName,
      };

      console.table(doc);

      const res = await db
        .getCollection<ISaveMongoConnection>("mongo_connections")
        .insert(doc);

      await db.getCollection("databases").insert({
        type: "mongo",
        projectId: args0.projectId,
        database_name: args0.database,
      });

      return true;
    },
  );

  // ipcChannels.save_mongify_connection
  ipcMain.handle(
    ipcChannels.save_mongify_connection,
    async (event, args: ISaveMongifyConnection) => {
      if (!args.projectId || !args.databasePath.trim()) {
        throw new Error("Project ID and database path are required");
      }

      await db
        .getCollection<ISaveMongifyConnection>("mongify_connections")
        .insert({
          projectId: args.projectId,
          databasePath: args.databasePath.trim(),
          databaseName: args.databaseName.trim(),
        });

      await db.getCollection("databases").insert({
        type: "mongify",
        projectId: args.projectId,
        database_name: args.databaseName.trim(),
      });

      return true;
    },
  );

  // ipcChannels.mongify.get_collections
  ipcMain.handle(ipcChannels.mongify.get_collections, async () => {
    if (!mongifyClient) {
      await createMongifyClient();
    }
    let collections: string[] = await mongifyClient!.listCollections();
    return collections;
  });

  // ipcChannels.list_databases
  ipcMain.handle(ipcChannels.list_databases, async () => {
    console.log("inside list_databases");
    const res = await db.getCollection<IDatabase>("databases").find();
    return res;
  });
};
