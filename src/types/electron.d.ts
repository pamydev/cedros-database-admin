export {};

declare global {
  interface Window {
    systemAPI: {
      getAccentColor(): Promise<string>;
    };
  }
}
