import {
  test as base,
  type Locator,
  expect,
  type Page,
} from "@playwright/test";
import { BasePage } from "./base.pageObject";

export class DashboardPage extends BasePage {
  private readonly contentWrapper: Locator;
  private readonly adminNavigationLink: Locator;

  constructor(page: Page) {
    super(page);
    this.contentWrapper = this.page.getByTestId("dashboard");
    this.adminNavigationLink = this.page.getByRole("link", { name: "Admin" });
  }

  async goto() {
    await this.page.goto("/dashboard");
    await this.isNuxtHydrated();
  }

  async expectContentToBeVisible() {
    await expect(this.contentWrapper).toBeVisible();
  }

  async expectAdminNavigationLinkToBeVisible() {
    await expect(this.adminNavigationLink).toBeVisible();
  }
}

export const dashboardTest = base.extend<{ dashboardPage: DashboardPage }>({
  dashboardPage: async ({ page }, use) => {
    const pageObject = new DashboardPage(page);
    await pageObject.goto();
    await use(pageObject);
  },
});
