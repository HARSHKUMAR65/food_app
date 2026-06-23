export class MenuItemUnavailableError extends Error {
  constructor() {
    super("One or more menu items do not exist or are unavailable");
    this.name = "MenuItemUnavailableError";
  }
}
