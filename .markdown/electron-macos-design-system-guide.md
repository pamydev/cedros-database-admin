# Electron macOS Integration & Design System Guide

## Goal

Implement two macOS-focused features in an existing Electron + Vite + TypeScript application without breaking existing functionality:

1. Detect the user's current macOS accent color and expose it safely to the renderer.
2. Add a lightweight macOS-inspired design system for the app UI.

The implementation should preserve the current application architecture, routing, state, event handling, and existing features. Prefer incremental changes over large rewrites.

---

# 1. macOS Accent Color Integration

## Requirements

The app should:

- Read the current macOS system accent color.
- Expose the color to the renderer securely.
- Store it in a CSS custom property such as `--mac-accent`.
- Update the UI when the system accent color changes, if Electron exposes a reliable event for the current Electron version.
- Fall back gracefully on non-macOS platforms.
- Keep `contextIsolation` enabled.
- Do not enable `nodeIntegration` in the renderer.
- Do not expose `ipcRenderer` directly to `window`.

Use Electron's:

```ts
systemPreferences.getAccentColor()
```

On macOS this returns the system accent color as an RGBA hexadecimal string in the format:

```txt
RRGGBBAA
```

For example:

```txt
0a84ffff
```

The renderer should normally use only the RGB portion:

```txt
#0a84ff
```

---

## Main Process

Create a small IPC API for reading the accent color.

Example:

```ts
import {
  app,
  BrowserWindow,
  ipcMain,
  systemPreferences,
} from "electron";

function getSystemAccentColor(): string {
  if (process.platform !== "darwin") {
    return "#0a84ff";
  }

  const rgba = systemPreferences.getAccentColor();

  return `#${rgba.slice(0, 6)}`;
}

ipcMain.handle("system:get-accent-color", () => {
  return getSystemAccentColor();
});
```

Do not allow arbitrary IPC channel names from the renderer.

Keep channels explicit and narrowly scoped.

---

## Preload Bridge

Expose only the capability required by the renderer.

Example:

```ts
import {
  contextBridge,
  ipcRenderer,
} from "electron";

contextBridge.exposeInMainWorld("systemAPI", {
  getAccentColor: (): Promise<string> =>
    ipcRenderer.invoke("system:get-accent-color"),
});
```

Avoid exposing this:

```ts
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer,
});
```

That would expose much more capability than the renderer needs.

---

## Renderer Type Declaration

Create or update a renderer declaration file, for example:

```txt
src/types/electron.d.ts
```

Example:

```ts
export {};

declare global {
  interface Window {
    systemAPI: {
      getAccentColor(): Promise<string>;
    };
  }
}
```

Make sure the declaration file is included by the relevant `tsconfig.json`.

For example:

```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.d.ts"
  ]
}
```

---

## Renderer Initialization

Read the system accent color during app initialization.

Example:

```ts
async function initializeSystemTheme(): Promise<void> {
  try {
    const accentColor =
      await window.systemAPI.getAccentColor();

    document.documentElement.style.setProperty(
      "--mac-accent",
      accentColor,
    );
  } catch (error) {
    console.error(
      "Failed to load system accent color:",
      error,
    );
  }
}
```

Call it once when the renderer initializes:

```ts
await initializeSystemTheme();
```

The default CSS value should exist even before IPC resolves:

```css
:root {
  --mac-accent: #0a84ff;
}
```

---

## Accent Color Changes

If the current Electron version provides a suitable `systemPreferences` event for accent-color changes, subscribe in the main process and forward a specific event to renderer windows.

Keep this version-aware. Do not invent an event name.

If there is no reliable event in the installed Electron version, reading the accent color at application startup is acceptable.

A possible architecture is:

```txt
macOS
  ↓
systemPreferences
  ↓
Main Process
  ↓ IPC
Preload Bridge
  ↓
Renderer
  ↓
--mac-accent
```

If live updates are implemented, expose a dedicated subscription method:

```ts
contextBridge.exposeInMainWorld("systemAPI", {
  getAccentColor: () =>
    ipcRenderer.invoke("system:get-accent-color"),

  onAccentColorChanged: (
    callback: (color: string) => void,
  ) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      color: string,
    ) => callback(color);

    ipcRenderer.on(
      "system:accent-color-changed",
      listener,
    );

    return () => {
      ipcRenderer.removeListener(
        "system:accent-color-changed",
        listener,
      );
    };
  },
});
```

Only add this if the main process has a reliable source event to trigger it.

---

# 2. Light and Dark Appearance

Use CSS media queries for renderer styling:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --mac-window-bg: #1e2324;
    --mac-sidebar-bg: rgba(24, 28, 29, 0.78);
    --mac-text: rgba(255, 255, 255, 0.92);
    --mac-secondary-text: rgba(255, 255, 255, 0.56);
    --mac-separator: rgba(255, 255, 255, 0.08);
  }
}

@media (prefers-color-scheme: light) {
  :root {
    --mac-window-bg: #f5f5f5;
    --mac-sidebar-bg: rgba(242, 242, 242, 0.82);
    --mac-text: rgba(0, 0, 0, 0.88);
    --mac-secondary-text: rgba(0, 0, 0, 0.54);
    --mac-separator: rgba(0, 0, 0, 0.08);
  }
}
```

Do not hard-code the app permanently to dark mode unless the product explicitly requires it.

---

# 3. BrowserWindow Configuration

For a native-looking macOS window, use the native traffic lights and a hidden inset title bar.

Example:

```ts
const mainWindow = new BrowserWindow({
  width: 1000,
  height: 720,

  titleBarStyle: "hiddenInset",

  trafficLightPosition: {
    x: 18,
    y: 18,
  },

  backgroundColor: "#00000000",

  webPreferences: {
    preload: preloadPath,
    contextIsolation: true,
    nodeIntegration: false,
  },
});
```

Optional macOS-only vibrancy:

```ts
if (process.platform === "darwin") {
  mainWindow.setVibrancy("sidebar");
}
```

Or configure it at creation time when supported by the installed Electron version:

```ts
vibrancy: "sidebar",
visualEffectState: "active",
```

Do not make Electron-version assumptions. Verify the installed version before using APIs that may differ.

---

# 4. Draggable Window Regions

Because `titleBarStyle: "hiddenInset"` removes the traditional draggable title bar, create a draggable region in CSS.

Example:

```css
.mac-titlebar {
  height: 52px;
  -webkit-app-region: drag;
  user-select: none;
}
```

Interactive controls inside that area must explicitly opt out:

```css
.mac-titlebar button,
.mac-titlebar input,
.mac-titlebar a,
.mac-titlebar [data-interactive] {
  -webkit-app-region: no-drag;
}
```

Do not make the whole renderer draggable.

---

# 5. Design System Architecture

Create a lightweight reusable design system instead of styling every screen independently.

Suggested structure:

```txt
src/
  styles/
    macos.css

  components/
    MacWindow/
    MacTitlebar/
    MacSidebar/
    MacSidebarItem/
    MacNavigation/
    MacSearch/
    MacInput/
    MacButton/
    MacList/
    MacListItem/
    MacSection/
    MacHeaderBox/
```

If the project does not use a component framework, implement the same concepts as reusable HTML templates, Winnetou constructs, helper functions, or project-native primitives.

Do not introduce React, Vue, Svelte, or another UI framework only for this feature unless the project already uses it.

---

# 6. Core Design Tokens

Create a central token layer.

Example:

```css
:root {
  --mac-accent: #0a84ff;

  --mac-window-bg: #1e2324;
  --mac-sidebar-bg: rgba(24, 28, 29, 0.78);

  --mac-control-bg: rgba(255, 255, 255, 0.065);
  --mac-control-hover-bg: rgba(255, 255, 255, 0.095);
  --mac-control-active-bg: rgba(255, 255, 255, 0.045);

  --mac-card-bg: rgba(255, 255, 255, 0.045);

  --mac-text: rgba(255, 255, 255, 0.92);
  --mac-secondary-text: rgba(255, 255, 255, 0.56);
  --mac-disabled-text: rgba(255, 255, 255, 0.28);

  --mac-separator: rgba(255, 255, 255, 0.075);

  --mac-radius-small: 6px;
  --mac-radius-control: 8px;
  --mac-radius-card: 11px;
  --mac-radius-large: 14px;

  --mac-sidebar-width: 260px;

  --mac-space-1: 4px;
  --mac-space-2: 8px;
  --mac-space-3: 12px;
  --mac-space-4: 16px;
  --mac-space-5: 20px;
  --mac-space-6: 24px;
  --mac-space-8: 32px;

  --mac-font:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Text",
    "Helvetica Neue",
    Arial,
    sans-serif;
}
```

Prefer tokens over scattered literal values.

---

# 7. Typography

Use the system font stack:

```css
html,
body {
  font-family: var(--mac-font);
  font-size: 13px;
  color: var(--mac-text);
}
```

Suggested hierarchy:

```css
.mac-title-large {
  font-size: 26px;
  line-height: 1.2;
  font-weight: 700;
}

.mac-title {
  font-size: 20px;
  line-height: 1.25;
  font-weight: 650;
}

.mac-section-title {
  font-size: 13px;
  line-height: 1.3;
  font-weight: 600;
}

.mac-body {
  font-size: 13px;
  line-height: 1.4;
}

.mac-caption {
  font-size: 11px;
  line-height: 1.35;
  color: var(--mac-secondary-text);
}
```

Do not rely on a bundled copy of Apple's proprietary fonts.

---

# 8. Main Window Layout

Example:

```css
.mac-window {
  width: 100%;
  height: 100vh;

  display: grid;
  grid-template-columns:
    var(--mac-sidebar-width)
    minmax(0, 1fr);

  background: transparent;
  color: var(--mac-text);

  overflow: hidden;
}
```

Sidebar:

```css
.mac-sidebar {
  min-width: 0;

  padding:
    58px
    12px
    16px;

  background: var(--mac-sidebar-bg);

  border-right:
    1px solid
    var(--mac-separator);

  backdrop-filter: blur(36px);
  -webkit-backdrop-filter: blur(36px);

  overflow-y: auto;
}
```

Main content:

```css
.mac-content {
  min-width: 0;

  padding:
    12px
    20px
    32px;

  background: var(--mac-window-bg);

  overflow-y: auto;
}
```

---

# 9. Title Bar

Example:

```css
.mac-titlebar {
  height: 52px;

  display: flex;
  align-items: center;

  padding-left: 76px;

  -webkit-app-region: drag;
  user-select: none;
}
```

The left padding reserves space for native macOS traffic lights.

Do not draw fake red, yellow, and green traffic-light controls when native controls are already visible.

---

# 10. Back and Forward Navigation

Markup example:

```html
<div class="mac-navigation">
  <button
    class="mac-nav-button"
    type="button"
    aria-label="Back"
  >
    ‹
  </button>

  <button
    class="mac-nav-button"
    type="button"
    aria-label="Forward"
    disabled
  >
    ›
  </button>
</div>
```

CSS:

```css
.mac-navigation {
  display: inline-flex;
  align-items: center;

  -webkit-app-region: no-drag;
}

.mac-nav-button {
  width: 34px;
  height: 30px;

  display: grid;
  place-items: center;

  padding: 0;

  border:
    1px solid
    var(--mac-separator);

  background:
    var(--mac-control-bg);

  color: var(--mac-text);

  font: inherit;
  font-size: 22px;
  line-height: 1;

  cursor: default;
}

.mac-nav-button:first-child {
  border-radius:
    var(--mac-radius-control)
    0
    0
    var(--mac-radius-control);
}

.mac-nav-button:last-child {
  margin-left: -1px;

  border-radius:
    0
    var(--mac-radius-control)
    var(--mac-radius-control)
    0;
}

.mac-nav-button:hover:not(:disabled) {
  background:
    var(--mac-control-hover-bg);
}

.mac-nav-button:active:not(:disabled) {
  background:
    var(--mac-control-active-bg);
}

.mac-nav-button:disabled {
  color: var(--mac-disabled-text);
}
```

Prefer an SVG chevron icon instead of text glyphs in the final UI if the app already has an icon system.

---

# 11. Sidebar Items

Markup example:

```html
<button class="mac-sidebar-item active">
  <span class="mac-sidebar-icon">
    <!-- icon -->
  </span>

  <span class="mac-sidebar-label">
    Network
  </span>
</button>
```

CSS:

```css
.mac-sidebar-item {
  width: 100%;
  min-height: 38px;

  display: flex;
  align-items: center;

  gap: 9px;

  padding:
    0
    9px;

  border: 0;
  border-radius:
    var(--mac-radius-control);

  background: transparent;

  color: var(--mac-text);

  font: inherit;
  text-align: left;

  cursor: default;
}

.mac-sidebar-item:hover {
  background:
    rgba(255, 255, 255, 0.055);
}

.mac-sidebar-item.active {
  background: var(--mac-accent);
  color: #fff;
}

.mac-sidebar-item:focus-visible {
  outline:
    2px solid
    color-mix(
      in srgb,
      var(--mac-accent) 70%,
      white
    );

  outline-offset: 1px;
}
```

---

# 12. Search Field

Markup example:

```html
<label class="mac-search">
  <span class="mac-search-icon">
    <!-- search icon -->
  </span>

  <input
    type="search"
    placeholder="Search"
  />
</label>
```

CSS:

```css
.mac-search {
  height: 30px;

  display: flex;
  align-items: center;

  gap: 6px;

  padding:
    0
    9px;

  border:
    1px solid
    transparent;

  border-radius:
    var(--mac-radius-control);

  background:
    rgba(255, 255, 255, 0.085);

  -webkit-app-region: no-drag;
}

.mac-search:focus-within {
  border-color:
    color-mix(
      in srgb,
      var(--mac-accent) 70%,
      transparent
    );

  box-shadow:
    0
    0
    0
    2px
    color-mix(
      in srgb,
      var(--mac-accent) 22%,
      transparent
    );
}

.mac-search input {
  width: 100%;
  min-width: 0;

  border: 0;
  outline: 0;

  background: transparent;

  color: var(--mac-text);

  font: inherit;
}

.mac-search input::placeholder {
  color: var(--mac-secondary-text);
}
```

---

# 13. Standard Input

Example:

```css
.mac-input {
  min-height: 30px;

  padding:
    0
    9px;

  border:
    1px solid
    var(--mac-separator);

  border-radius:
    var(--mac-radius-control);

  background:
    var(--mac-control-bg);

  color: var(--mac-text);

  font: inherit;

  outline: none;
}

.mac-input:hover {
  background:
    var(--mac-control-hover-bg);
}

.mac-input:focus {
  border-color:
    color-mix(
      in srgb,
      var(--mac-accent) 75%,
      transparent
    );

  box-shadow:
    0
    0
    0
    2px
    color-mix(
      in srgb,
      var(--mac-accent) 22%,
      transparent
    );
}

.mac-input:disabled {
  opacity: 0.5;
}
```

---

# 14. List Groups

List groups should visually resemble grouped macOS settings rows.

Markup:

```html
<div class="mac-list">
  <button class="mac-list-item">
    <span class="mac-list-icon">
      <!-- icon -->
    </span>

    <span class="mac-list-content">
      <span class="mac-list-label">
        About
      </span>

      <span class="mac-list-description">
        Application information
      </span>
    </span>

    <span class="mac-list-trailing">
      ›
    </span>
  </button>
</div>
```

CSS:

```css
.mac-list {
  overflow: hidden;

  margin-bottom:
    var(--mac-space-4);

  border-radius:
    var(--mac-radius-card);

  background:
    var(--mac-card-bg);
}

.mac-list-item {
  width: 100%;
  min-height: 44px;

  display: flex;
  align-items: center;

  gap: 10px;

  padding:
    7px
    12px;

  border: 0;
  border-bottom:
    1px solid
    var(--mac-separator);

  background: transparent;

  color: var(--mac-text);

  font: inherit;
  text-align: left;

  cursor: default;
}

.mac-list-item:last-child {
  border-bottom: 0;
}

.mac-list-item:hover {
  background:
    rgba(255, 255, 255, 0.025);
}

.mac-list-item:active {
  background:
    rgba(255, 255, 255, 0.04);
}

.mac-list-content {
  min-width: 0;
  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 1px;
}

.mac-list-label {
  color: var(--mac-text);
}

.mac-list-description {
  color: var(--mac-secondary-text);

  font-size: 11px;
}

.mac-list-trailing {
  color: var(--mac-disabled-text);

  font-size: 18px;
  line-height: 1;
}
```

---

# 15. Header Box

Use for page-level information such as a settings category title.

Markup:

```html
<header class="mac-header-box">
  <div class="mac-header-icon">
    <!-- icon -->
  </div>

  <h1>General</h1>

  <p>
    Manage general application settings and preferences.
  </p>
</header>
```

CSS:

```css
.mac-header-box {
  min-height: 130px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding:
    var(--mac-space-5);

  margin-bottom:
    var(--mac-space-3);

  border-radius:
    var(--mac-radius-card);

  background:
    var(--mac-card-bg);

  text-align: center;
}

.mac-header-box h1 {
  margin:
    7px
    0
    2px;

  font-size: 22px;
  line-height: 1.2;
  font-weight: 650;
}

.mac-header-box p {
  max-width: 520px;

  margin: 0;

  color:
    var(--mac-secondary-text);

  font-size: 12px;
  line-height: 1.4;
}
```

---

# 16. Section Titles

Example:

```css
.mac-section-title {
  margin:
    var(--mac-space-6)
    10px
    var(--mac-space-2);

  color:
    var(--mac-text);

  font-size: 13px;
  font-weight: 600;
}
```

---

# 17. Buttons

Neutral button:

```css
.mac-button {
  min-height: 28px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  padding:
    0
    10px;

  border:
    1px solid
    var(--mac-separator);

  border-radius:
    var(--mac-radius-control);

  background:
    var(--mac-control-bg);

  color:
    var(--mac-text);

  font: inherit;

  cursor: default;

  -webkit-app-region: no-drag;
}

.mac-button:hover:not(:disabled) {
  background:
    var(--mac-control-hover-bg);
}

.mac-button:active:not(:disabled) {
  background:
    var(--mac-control-active-bg);
}

.mac-button:disabled {
  opacity: 0.45;
}
```

Primary button:

```css
.mac-button-primary {
  background:
    var(--mac-accent);

  border-color:
    color-mix(
      in srgb,
      var(--mac-accent) 82%,
      black
    );

  color: white;
}

.mac-button-primary:hover:not(:disabled) {
  background:
    color-mix(
      in srgb,
      var(--mac-accent) 90%,
      white
    );
}

.mac-button-primary:active:not(:disabled) {
  background:
    color-mix(
      in srgb,
      var(--mac-accent) 88%,
      black
    );
}
```

---

# 18. Accent Color Usage Rules

Use the system accent color for:

- Active sidebar rows.
- Primary actions.
- Selected states.
- Focus rings.
- Toggle controls.
- Active segmented controls.
- Small emphasis indicators.

Do not use the accent color as a general page background.

Prefer:

```css
background: var(--mac-accent);
```

or derived values:

```css
background:
  color-mix(
    in srgb,
    var(--mac-accent) 20%,
    transparent
  );
```

Avoid manually maintaining separate blue, green, purple, red, and orange themes.

---

# 19. Optional Vibrancy

If vibrancy is enabled at the BrowserWindow level, let CSS transparency determine where it is visible.

Example:

```css
.mac-sidebar {
  background:
    rgba(20, 24, 25, 0.58);
}

.mac-content {
  background:
    rgba(29, 35, 36, 0.97);
}
```

This allows the sidebar to visibly use native macOS vibrancy while the main content remains nearly solid.

Do not assume CSS `backdrop-filter` and native macOS vibrancy are equivalent. They are separate effects.

---

# 20. Accessibility

The design must remain usable, not merely visually similar to macOS.

Requirements:

- Preserve keyboard navigation.
- Use semantic `<button>` elements for clickable actions.
- Add `aria-label` to icon-only buttons.
- Keep visible focus states.
- Respect disabled states.
- Maintain sufficient text contrast.
- Do not use `div` click handlers when a native interactive element is appropriate.
- Do not remove focus outlines without replacing them.
- Respect `prefers-reduced-motion`.

Example:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

# 21. Platform Behavior

The macOS-inspired design may be enabled only on macOS if desired.

Main process:

```ts
const isMacOS =
  process.platform === "darwin";
```

Renderer may receive a safe platform value through preload:

```ts
contextBridge.exposeInMainWorld(
  "platformAPI",
  {
    platform: process.platform,
  },
);
```

Then:

```ts
document.documentElement.dataset.platform =
  window.platformAPI.platform;
```

CSS:

```css
html[data-platform="darwin"] {
  /* macOS-specific refinements */
}
```

Do not expose the entire Node `process` object to the renderer.

---

# 22. Suggested Integration Order

Implement in this order:

1. Inspect the existing Electron main process, preload, renderer entry point, and TypeScript configuration.
2. Preserve all existing BrowserWindow behavior.
3. Add the secure accent-color IPC handler.
4. Extend the preload bridge.
5. Add renderer TypeScript declarations.
6. Initialize `--mac-accent` at renderer startup.
7. Add the design tokens.
8. Add the macOS window layout.
9. Add the draggable titlebar and `no-drag` controls.
10. Add sidebar and navigation components.
11. Add inputs and search controls.
12. Add list groups and list items.
13. Add header boxes and sections.
14. Add button states.
15. Add light/dark mode.
16. Add optional vibrancy.
17. Test accessibility and keyboard behavior.
18. Test on macOS.
19. Verify that non-macOS builds still function.
20. Run the existing test/build/lint pipeline.

---

# 23. Non-Regression Rules

The AI agent must follow these rules:

- Do not rewrite unrelated application code.
- Do not remove existing events or IPC channels.
- Do not rename public APIs unless required.
- Do not change routing behavior.
- Do not replace existing state management.
- Do not introduce a new UI framework unnecessarily.
- Do not enable `nodeIntegration`.
- Do not disable `contextIsolation`.
- Do not expose Node or Electron internals directly to renderer code.
- Do not remove existing security settings.
- Do not modify packaging, signing, or update infrastructure unless required for this feature.
- Do not change current app behavior merely to match macOS visually.
- Reuse existing components where practical.
- Keep TypeScript strictness compatible with the current project.
- Preserve existing Vite configuration unless a change is required.
- If a required Electron API differs by installed Electron version, inspect the installed version first and adapt accordingly.

---

# 24. Acceptance Criteria

The implementation is complete when:

- On macOS, the renderer receives the current system accent color.
- `--mac-accent` is defined and used by the UI.
- The UI falls back safely if the accent-color lookup fails.
- Existing app behavior still works.
- `titleBarStyle: "hiddenInset"` works with a draggable custom titlebar.
- Interactive titlebar controls remain clickable because they use `no-drag`.
- Sidebar selection uses the current accent color.
- Inputs, buttons, lists, navigation controls, section titles, and header boxes share a consistent macOS-inspired appearance.
- Light/dark system appearance is respected unless the app explicitly overrides it.
- Native traffic lights are preserved.
- The renderer does not have unrestricted access to Node.js or Electron APIs.
- TypeScript builds successfully.
- Vite builds successfully.
- The application launches successfully on macOS.
- No existing functionality is lost.

---

# 25. Final Implementation Principle

Treat this as a small internal design system, not as a one-off imitation of a screenshot.

The native Electron window should handle the operating-system-level behavior:

```txt
Electron / macOS
  ├─ Window
  ├─ Traffic lights
  ├─ Native title-bar behavior
  ├─ Vibrancy
  └─ System preferences
```

The renderer should handle reusable visual primitives:

```txt
Renderer
  ├─ Design tokens
  ├─ Sidebar
  ├─ Navigation
  ├─ Search
  ├─ Inputs
  ├─ Buttons
  ├─ Lists
  ├─ Sections
  └─ Header boxes
```

Connect both layers through a minimal, secure preload API.

The result should feel native on macOS while remaining maintainable, secure, and compatible with the existing Electron + Vite + TypeScript application.
