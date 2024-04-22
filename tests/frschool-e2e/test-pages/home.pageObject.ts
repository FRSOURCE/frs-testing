import { type Locator, type Page } from "@playwright/test";
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

  async loginNavigationLinkClick() {
    await this.loginNavigationLink.click();
  }
}
