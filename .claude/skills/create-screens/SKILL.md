---
name: create-screens
description: "Create the skeleton of a WinnetouJs screen that extends the project's Screen base class. Use when adding a new screen, page, or view under src/winnetoujs/source-code. Ask for the screen name when it is missing."
argument-hint: "Screen name, for example Add Connection"
---

# Create WinnetouJs Screens

## When to Use

Use this skill when the user asks to create a new screen in this project. Every screen must extend the shared `Screen` class from `@screens/screen`.

## Required Input

The screen name is required. If the prompt does not provide it, ask the user for the screen name before creating or modifying a file.

Use the name to derive:

- The PascalCase class name ending in `Screen`.
- The screen title shown in the header.
- The kebab-case `identifier` passed to `buildScreen`.
- A matching screen filename in the relevant project screen folder.

Do not ask for or invent implementation details unless the user requests them. The screen name is enough to create the skeleton.

## Procedure

1. Confirm the screen name. Ask for it if it is missing.
2. Choose the appropriate screen folder under `src/winnetoujs/source-code/` based on the requested feature.
3. Create a TypeScript screen class using the template below.
4. Replace `AddConnection` and the title and identifier placeholders with values derived from the requested name.
5. Stop after the `content === "exists"` guard. Do not add panels, list items, forms, event handlers, data loading, or feature-specific behavior.
6. Export the instantiated screen object using the same lower-camel-case name as the class without the `Screen` suffix.
7. Re-check imports, class naming, and the `buildScreen` arguments for TypeScript errors or typos.

## Screen Template

```ts
import { Screen } from "@screens/screen";

class AddConnectionScreen extends Screen {
  public async render(_id: string) {
    const content = this.buildScreen({
      output: "screen",
      title: "Add Connection",
      identifier: "add-connection",
    });

    if (content === "exists") return;
  }
}

export const addConnectionScreen = new AddConnectionScreen();
```

## Optional Project Context

If the screen belongs to a project and needs the project image in the header, preserve this project-specific setup while keeping the rest of the skeleton empty:

```ts
import { Screen } from "@screens/screen";

class AddConnectionScreen extends Screen {
  public async render(_id: string) {
    const project = await window.database.getProjectById(_id);

    const content = this.buildScreen({
      output: "screen",
      title: "Add Connection",
      identifier: "add-connection",
      titleImg: project?.image
        ? `images://${encodeURIComponent(project.name)}/${project.image}`
        : null,
    });

    if (content === "exists") return;
  }
}

export const addConnectionScreen = new AddConnectionScreen();
```

Only include the project lookup and `titleImg` when the surrounding screen flow requires it. The screen's actual content and behavior belong in a later user request.
