module.exports = {
  apps: [
    {
      name: "electron-dev",

      script: "./node_modules/.bin/electron-forge",
      args: "start",
      interpreter: "none",

      instances: 1,
      exec_mode: "fork",

      watch: ["src"],
      watch_delay: 500,

      ignore_watch: ["node_modules", ".webpack", ".vite", "out", "dist"],

      // Não reabrir o Electron apenas porque você fechou a janela.
      autorestart: false,
    },
  ],
};
