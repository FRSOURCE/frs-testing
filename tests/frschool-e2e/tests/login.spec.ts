import { test, expect } from "@playwright/test";
import { isNuxtHydrated, handleLoginForm } from "../test-utils/utils";

test("has login prompt", async ({ page }) => {
  await page.goto("/");

  await isNuxtHydrated(page);

  await page.getByTestId("pre-auth-login-button").click();
  await expect(page.getByTestId("login-prompt")).toContainText("Zaloguj się!");

  await handleLoginForm({
    page,
    login: "test@test.pl",
    password: "testtest",
  });

  await expect(page.getByTestId("dashboard")).toBeVisible();
});
