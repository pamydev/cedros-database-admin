import { ipcMain, safeStorage } from "electron";
import { ipcChannels } from "../ipc.channels";
import {
  database,
  ICreateNewProjectArgs,
  ISaveMongifyConnection,
  IGetMongifyCollectionsArgs,
  IMongifyConnectionsColl,
  IDatabasesColl,
  IMongifySendQueryArgs,
} from "@projectTypes/ipc";
import { Mongify } from "@cedrosdev/mongify";
import fs from "fs";
import path from "path";
import { IProject } from "@projectTypes/ipc";
import { projectRoot } from "../settings/home.dir";
const db = new Mongify({
  database_name: "cedros_database_admin",
});

const projectRootPath = projectRoot();

let mongifyClient = new Map<string, Mongify>();

const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 15);
};

const createMongifyClient = async (args0: IGetMongifyCollectionsArgs) => {
  const connectionId = `${args0.projectId}-${args0.databaseId}`;
  if (!mongifyClient.has(connectionId)) {
    const mongifyConnection = await db
      .getCollection<IMongifyConnectionsColl>("mongify_connections")
      .findOne({
        projectId: args0.projectId,
        internalId: args0.databaseId,
      });

    console.table({
      _id: args0.databaseId,
      projectId: args0.projectId,
    });

    if (!mongifyConnection) {
      throw new Error("[code 3hdk82n] No Mongify connection found");
    }

    console.log({
      databasePath: mongifyConnection.databasePath,
      databaseName: mongifyConnection.databaseName,
    });

    mongifyClient.set(
      connectionId,
      new Mongify({
        database_name: mongifyConnection.databaseName,
        path: mongifyConnection.databasePath,
      }),
    );

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

      const projectId = generateUniqueId();

      const res = await db.getCollection<IProject>("projects").insert({
        projectId,
        name,
        description,
        image: imageName,
      });

      return true;
    },
  );

  // ipcChannels.load_projects
  ipcMain.handle(ipcChannels.load_projects, async () => {
    const projects = await db.getCollection<IProject>("projects").find();
    return projects;
  });

  // ipcChannels.get_project_by_id
  ipcMain.handle(
    ipcChannels.get_project_by_id,
    async (event, projectId: string) => {
      const project = await db
        .getCollection<IProject>("projects")
        .findOne({ projectId });
      return project;
    },
  );

  // ipcChannels.save_mongo_connection
  ipcMain.handle(
    ipcChannels.save_mongo_connection,
    async (event, args0: any) => {
      await (!safeStorage.isEncryptionAvailable()
        ? Promise.reject(
            new Error("Encryption is not available on this system"),
          )
        : Promise.resolve());

      const encryptedPassword = safeStorage
        .encryptString(args0.password)
        .toString("base64");

      const doc: any = {
        projectId: args0.projectId,
        database: args0.database,
        name: args0.name,
        password: encryptedPassword,
        uri: args0.uri,
        userName: args0.userName,
      };

      console.table(doc);

      const res = await db.getCollection<any>("mongo_connections").insert(doc);

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

      const databaseId = generateUniqueId();
      const registerId = generateUniqueId();

      await db
        .getCollection<IMongifyConnectionsColl>("mongify_connections")
        .insert({
          internalId: databaseId,
          projectId: args.projectId,
          databasePath: args.databasePath.trim(),
          databaseName: args.databaseName.trim(),
        });

      await db.getCollection<IDatabasesColl>("databases").insert({
        type: "mongify",
        projectId: args.projectId,
        database_name: args.databaseName.trim(),
        databaseId,
        internalId: registerId,
      });

      return true;
    },
  );

  // ipcChannels.list_databases
  ipcMain.handle(ipcChannels.list_databases, async (ev, projectId: string) => {
    const res = await db.getCollection<IDatabasesColl>("databases").find({
      projectId,
    });
    return res;
  });

  // ipcChannels.mongify.get_collections
  ipcMain.handle(
    ipcChannels.mongify.get_collections,
    async (ev, args0: IGetMongifyCollectionsArgs) => {
      const connection_id = `${args0.projectId}-${args0.databaseId}`;
      if (!mongifyClient.has(connection_id)) {
        await createMongifyClient(args0);
      }
      let collections: string[] | undefined = await mongifyClient
        .get(connection_id)
        ?.listCollections();

      console.log({ connection_id, collections });

      return collections;
    },
  );

  ipcMain.handle(
    ipcChannels.mongify.send_query,
    async (ev, args0: IMongifySendQueryArgs) => {
      console.table(args0);
      const connection_id = `${args0.projectId}-${args0.databaseId}`;
      if (!mongifyClient.has(connection_id)) {
        await createMongifyClient(args0);
      }
      const db = mongifyClient.get(connection_id);
      let res;

      try {
        res = await eval(args0.command);
      } catch (e) {
        console.log("error code 3d2kl9", e);
      }
      console.log("Eval returning from mongify query", res);
      return res;
    },
  );
};
