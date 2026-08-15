import { app, Menu, BrowserWindow } from "electron";

app.setName("Cedros Database Admin");

const template: Electron.MenuItemConstructorOptions[] = [
  {
    label: "Pamela 2",

    submenu: [
      {
        label: `About ${app.name}`,
        role: "about",
      },

      {
        type: "separator",
      },

      {
        label: "Settings…",
        accelerator: "CmdOrCtrl+,",

        click() {
          console.log("Open settings");
        },
      },

      {
        type: "separator",
      },

      {
        role: "services",
      },

      {
        type: "separator",
      },

      {
        role: "hide",
      },

      {
        role: "hideOthers",
      },

      {
        role: "unhide",
      },

      {
        type: "separator",
      },

      {
        role: "quit",
      },
    ],
  },

  {
    label: "Pamela",

    submenu: [
      {
        role: "undo",
      },

      {
        role: "redo",
      },

      {
        type: "separator",
      },

      {
        role: "cut",
      },

      {
        role: "copy",
      },

      {
        role: "paste",
      },

      {
        role: "selectAll",
      },
    ],
  },

  {
    label: "View",

    submenu: [
      {
        role: "reload",
      },

      {
        role: "forceReload",
      },

      {
        role: "toggleDevTools",
      },

      {
        type: "separator",
      },

      {
        role: "resetZoom",
      },

      {
        role: "zoomIn",
      },

      {
        role: "zoomOut",
      },

      {
        type: "separator",
      },

      {
        role: "togglefullscreen",
      },
    ],
  },

  {
    label: "Window",

    submenu: [
      {
        role: "minimize",
      },

      {
        role: "zoom",
      },

      {
        type: "separator",
      },

      {
        role: "front",
      },
    ],
  },
];

export const setApplicationMenu = () => {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
