import { protocol } from "electron";
import { projectRoot } from "../settings/home.dir";
import path from "path";
import fssync from "fs";

export const registerProtocols = () => {
  protocol.handle("images", (request) => {
    const url = request.url;
    // images://projectName/cover.png
    const _root = projectRoot();
    const _path = url.replace("images://", "");
    const decodedPath = decodeURIComponent(_path);
    const finalPath = path.join(_root, "projects", decodedPath);
    console.log({ finalPath });
    if (!fssync.existsSync(finalPath)) {
      return new Response("File not found", { status: 404 });
    }
    const file = fssync.readFileSync(finalPath);
    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  });
};
