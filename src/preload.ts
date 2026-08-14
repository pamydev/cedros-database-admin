import { contextBridge, ipcRenderer } from "electron";

const ipc = {
  log: async () => {
    const res = await ipcRenderer.invoke("channel:log");
    return res;
  },
};

contextBridge.exposeInMainWorld("ipc", ipc);

//   font-family:
//     -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
//     sans-serif;
