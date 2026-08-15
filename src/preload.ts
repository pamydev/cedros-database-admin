import { contextBridge, ipcRenderer } from "electron";

const ipc = {
  log: async () => {
    const res = await ipcRenderer.invoke("channel:log");
    return res;
  },
};

const systemAPI = {
  getAccentColor: (): Promise<string> =>
    ipcRenderer.invoke("system:get-accent-color"),
};

contextBridge.exposeInMainWorld("ipc", ipc);
contextBridge.exposeInMainWorld("systemAPI", systemAPI);
