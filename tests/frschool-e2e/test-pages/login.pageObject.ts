import { type Locator, expect, type Page } from "@playwright/test";
import { BasePage } from "./base.pageObject";

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = this.page.getByTestId("login-form-email");
    this.passwordInput = this.page.getByTestId("login-form-password");
    this.submitBtn = this.page.getByTestId("login-prompt-submit-btn");
  }

  async goto() {
    await this.page.goto("/login");
    await this.isNuxtHydrated();
  }

  async handleLogin({ login, password }: { login: string; password: string }) {
    await this.emailInput.clear();
    await this.emailInput.pressSequentially(login);
    await this.passwordInput.clear();
    await this.passwordInput.pressSequentially(password);

    const awaitResponse = this.page.waitForResponse(
      async (response) =>
        response.url().endsWith("/graphql") &&
        response.request().postDataJSON().operationName === "Login"
    );

    await this.submitBtn.click();

    const response = await awaitResponse;
    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.not.toHaveProperty("errors");
  }

  async expectHeadingToContain(text: string) {
    await expect(
      this.page.getByRole("heading", { name: text, level: 1 })
    ).toBeVisible();
  }
}
