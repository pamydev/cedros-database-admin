---
name: ipc-mongify
description: "Use when implementing Electron IPC communication backed by the local Mongify database in this project, including adding channels, preload APIs, typed renderer contracts, ipcMain handlers, and CRUD operations for projects or connection records."
argument-hint: "Describe the renderer operation and Mongify collection to add or change"
user-invocable: true
---

# Electron IPC and Local Mongify

## Purpose

Implement database-backed features through the project's existing Electron boundaries:

`renderer -> window.database -> preload contextBridge -> ipcRenderer.invoke -> ipcMain.handle -> Mongify`

Keep Node/Electron and database access out of the renderer. Keep the public renderer API typed and expose only the operation needed by the UI.

## When to Use

Use this skill when a task needs to:

- add or change a local database operation;
- persist a project, database connection, query, or related record;
- add an Electron IPC channel;
- expose a new method on `window.database`;
- connect a WinnetouJs screen to the main-process database.

## Procedure

### 1. Identify the operation and data contract

Before editing, identify:

- the renderer action and its input;
- the expected result or failure behavior;
- the Mongify collection and record shape;
- the owning project identifier when data is project-scoped.

Use interfaces in `types/mongify.d.ts` for persisted records and `types/ipc.d.ts` for IPC argument and return types. Do not pass renderer DOM objects, functions, or unvalidated arbitrary objects across IPC.

For a new record, define the persisted interface in `types/mongify.d.ts` and the request interface in `types/ipc.d.ts`. Make optional fields explicit and preserve the existing `_id?: string` convention.

### 2. Add one channel in the central registry

Add a descriptive entry to `src/ipc.channels.ts`:

```ts
export const ipcChannels = {
  // existing channels
  create_connection: "api:create-connection",
};
```

Use a stable `api:` prefix for database operations. Never duplicate literal channel strings in preload or main code.

### 3. Extend the typed preload API

Update the `database` interface in `types/ipc.d.ts`, then expose the matching method in `src/preload.ts`:

```ts
export interface ICreateConnectionArgs {
  projectId: string;
  name: string;
  uri: string;
}

export interface database {
  createConnection: (args: ICreateConnectionArgs) => Promise<IConnection>;
}
```

```ts
const database: database = {
  // existing methods
  createConnection: (args) =>
    ipcRenderer.invoke(ipcChannels.create_connection, args),
};
```

Use `contextBridge.exposeInMainWorld`. Do not import `ipcRenderer` in renderer code and do not expose the entire Electron API.

### 4. Register the main-process handler

Add the handler in `src/database/database.ts`, inside `databaseIPCApi()`, using the shared `Mongify` instance:

```ts
ipcMain.handle(
  ipcChannels.create_connection,
  async (_event, args: ICreateConnectionArgs) => {
    const connection = {
      projectId: args.projectId,
      name: args.name,
      uri: args.uri,
    };

    return db.getCollection<IConnection>("connections").insert(connection);
  },
);
```

Follow these rules:

- import request and record types from `types`;
- use `db.getCollection<T>("collection-name")`;
- use `insert`, `find`, or `findOne` according to the operation;
- scope project data by `projectId` in every query;
- return the actual typed result or a deliberate boolean/result object;
- do not create a new `Mongify` instance per request;
- do not perform file-system or database work in preload.

If input validation is needed, validate at the main-process boundary before writing. Reject malformed identifiers, missing required strings, and unsupported values with an actionable error. Never log credentials or full MongoDB URIs.

### 5. Connect the renderer screen

Use the exposed `window.database` method from a screen or helper. Read values from the constructo-generated element IDs, build the typed request, await the result, and handle success and failure in the UI.

```ts
const result = await window.database.createConnection({
  projectId,
  name,
  uri,
});
```

For WinnetouJs:

- use constructo `ids` returned by `.create()`;
- use `W.fx` for button and form handlers;
- prevent duplicate submissions while the request is pending;
- do not store secrets in mutable UI state or log them;
- keep navigation decisions in the router, not in the preload or database handler.

If the UI is only a form draft, do not add a database write until the user explicitly submits it. If a save operation is requested but no backend contract exists, add the complete IPC contract rather than leaving a button with a fake handler.

### 6. Handle errors deliberately

At the renderer boundary, catch expected IPC failures and show a concise user-facing message. At the main boundary, preserve useful diagnostics without including passwords, credentials, or connection strings.

For reads, distinguish an empty result from an IPC/database failure. For writes, report whether the insert succeeded and avoid navigating away before the result is known.

### 7. Validate the change

Run the narrowest available checks after editing:

1. Check all changed TypeScript files for missing imports, type errors, and typos.
2. Confirm the channel key is used consistently in `ipc.channels.ts`, preload, and database handler.
3. Confirm the renderer calls only `window.database` and never `ipcRenderer`.
4. Confirm the Mongify collection type matches the persisted interface.
5. Confirm project-scoped queries include the project identifier.
6. Confirm the existing dev watchers can regenerate WinnetouJs/Sass output; never edit generated `.wcto.js` or bundle files.

## Decision Points

- **Read or write?** Use `find`/`findOne` for reads; use `insert` for new records. Add update/delete only when the user-facing behavior and contract are defined.
- **Project-scoped or global?** Prefer project-scoped records and require `projectId` in the request unless the domain explicitly defines a global collection.
- **Return shape?** Return the Mongify record for created/read entities when the renderer needs its `_id`; return `boolean` only for a true success/failure command.
- **Connection credentials?** Treat URI, username, and password as sensitive. Do not log them, include them in UI diagnostics, or expose them through unrelated APIs.
- **Missing API surface?** Add the channel, type, preload method, and main handler together. Do not bypass the boundary with direct imports or ad hoc globals.

## Completion Checklist

- [ ] Persisted record and IPC request/result types are defined.
- [ ] A single channel is registered centrally and reused everywhere.
- [ ] Preload exposes the smallest typed method through `contextBridge`.
- [ ] Main registers an `ipcMain.handle` and uses the shared Mongify instance.
- [ ] Queries use the correct typed collection and project scope.
- [ ] Renderer uses `window.database`, constructo IDs, and `W.fx` where applicable.
- [ ] Errors and loading/duplicate-submit states are handled.
- [ ] Secrets are not logged or unnecessarily exposed.
- [ ] Changed files pass TypeScript/error checks and generated files were not edited.
