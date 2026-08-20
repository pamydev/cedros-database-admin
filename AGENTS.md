# Agent Guide

## Project Shape

- This is an Electron Forge application using Vite for the main, preload, and renderer processes. See [forge.config.ts](forge.config.ts) and the Vite configs for entry points.
- The renderer UI is a WinnetouJs application under [src/winnetoujs/source-code](src/winnetoujs/source-code). Its entry point is [app.ts](src/winnetoujs/source-code/app.ts).
- The database and Electron IPC boundary live in [src/database](src/database), [src/main.ts](src/main.ts), and [src/preload.ts](src/preload.ts). Preserve the preload/main boundary when changing renderer behavior.

## Commands

    **NEVER** run commands in order to build or run tests.

The Sass and WinnetouJs watchers may already be running. Do not ask the user to run them manually;
The electron instance is already running in dev mode. Do not ask the user to run it manually.

## WinnetouJs Rules

- Use the project skills when changing WinnetouJs UI: [create-winnetoujs-constructos](.claude/skills/create-winnetoujs-constructos/SKILL.md), [create-screens](.claude/skills/create-screens/SKILL.md), and the relevant state, event, icon, routing, or Sass skill.
- Edit `.wcto.html` source files, never generated `.wcto.js` files or bundles such as `src/app.winnetouBundle.min.js`.
- Constructos are created with `new $component(...).create(...)`; prefer returned `ids` values for child targets instead of manually reconstructing DOM ids.
- Use `W.fx` for constructo event handlers and the Winnetou mutable APIs for reactive UI state. Do not add ad hoc listener or state patterns when an existing project skill covers the behavior.
- Screen classes extend [Screen](src/winnetoujs/source-code/screens/screen.ts), use `buildScreen`, and should be registered in the appropriate router. Existing project screens demonstrate the pattern in [src/winnetoujs/source-code/screens](src/winnetoujs/source-code/screens).
- Router paths and navigation methods are defined in [router.ts](src/winnetoujs/source-code/router/router.ts) and [project.routes.ts](src/winnetoujs/source-code/router/project.routes.ts). Keep route identifiers consistent with menu identifiers and screen identifiers.

## Module Resolution

- WinnetouJs has its own dependency and path-alias configuration in [src/winnetoujs/package.json](src/winnetoujs/package.json) and [src/winnetoujs/jsconfig.json](src/winnetoujs/jsconfig.json).
- Aliases such as `@common`, `@screens/*`, `@projectScreens/*`, `@leftMenu`, and `@helpers/*` are scoped to the WinnetouJs project. Before changing an import to a relative path, check whether the error comes from root ESLint resolution rather than TypeScript or the WinnetouJs bundler.
- Generated output can make searches noisy. Prefer source-code paths and verify imports against the owning `jsconfig.json` or `tsconfig.json`.

## Styling

- Follow [.github/instructions/design.instructions.md](.github/instructions/design.instructions.md) and [.github/instructions/winnetoujs.instructions.md](.github/instructions/winnetoujs.instructions.md).
- Reuse existing CSS variables from [src/sass/main.scss](src/sass/main.scss); do not introduce new variables casually. Keep descendant SCSS nested under its parent and use the project's existing naming patterns.
- Keep component SCSS beside its constructo or feature source when that is the established local pattern.

## Validation

- After edits, only checks for typescript errors, missing imports, and typos are required. Do not run the full test suite unless the user requests it.
