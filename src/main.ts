import { app, BrowserWindow, ipcMain, systemPreferences } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { setApplicationMenu } from "./mac-menu";
import { ipcChannels } from "./ipc.channels";
import { database } from "../types/ipc";
import { databaseIPCApi } from "./database/database";
import { registerProtocols } from "./protocols/protocols";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

app.setName("Cedros Database Admin");

ipcMain.handle(ipcChannels.system_accent_color, () => {
  if (process.platform !== "darwin") {
    return "#0a84ff";
  }

  try {
    const rgba = systemPreferences.getAccentColor();
    return `#${rgba.slice(0, 6)}`;
  } catch (error) {
    console.error("Failed to read the macOS accent color:", error);
    return "#0a84ff";
  }
});

databaseIPCApi();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,

    titleBarStyle: "hiddenInset",
    trafficLightPosition: {
      x: 18,
      y: 18,
    },
    vibrancy: "sidebar",
    visualEffectState: "active",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  setApplicationMenu();

  // mainWindow.loadFile(MAIN_WINDOW_VITE_DEV_SERVER_URL);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  registerProtocols();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
