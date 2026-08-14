import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({});

// import { mkdirSync, readdirSync, copyFileSync } from "node:fs";
// import { join, resolve } from "node:path";
// import { defineConfig, type Plugin } from "vite";

// const copyViews = (): Plugin => ({
//   name: "copy-backend-views",
//   writeBundle(options) {
//     return;
//     if (!options.dir) {
//       return;
//     }

//     const sourceDirectory = resolve(__dirname, "src/backend/views");
//     const targetDirectory = join(options.dir, "backend/views");

//     mkdirSync(targetDirectory, { recursive: true });
//     for (const fileName of readdirSync(sourceDirectory)) {
//       copyFileSync(
//         join(sourceDirectory, fileName),
//         join(targetDirectory, fileName),
//       );
//     }
//   },
// });

// // https://vitejs.dev/config
// export default defineConfig({
//   plugins: [copyViews()],
// });
