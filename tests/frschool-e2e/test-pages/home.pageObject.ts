import {
  test as base,
  expect,
  type Locator,
  type Page,
} from "@playwright/test";
import { BasePage } from "./base.pageObject";

export class HomePage extends BasePage {
  private readonly loginNavigationLink: Locator;

  constructor(page: Page) {
    super(page);
    this.loginNavigationLink = this.page.getByTestId("pre-auth-login-button");
  }

  async goto() {
    await this.page.goto("/");
    await this.isNuxtHydrated();
  }

  async expectLoginNavigationLinkToBeVisible() {
    await expect(this.loginNavigationLink).toBeVisible();
  }

  async loginNavigationLinkClick() {
    await this.loginNavigationLink.click();
  }
}

export const homepageTest = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    const pageObject = new HomePage(page);
    await pageObject.goto();
    await use(pageObject);
  },
});
