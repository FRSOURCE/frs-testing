import { type Page } from "@playwright/test";

export abstract class BasePage {
  constructor(public readonly page: Page) {}

  abstract goto(): Promise<void>;

  async isNuxtHydrated() {
    return await this.page.waitForFunction(
      () => window?.useNuxtApp?.().isHydrating === false
    );
  }
}
