import { test, expect } from "@playwright/test";
import {
  isNuxtHydrated,
  handleLoginForm,
  login,
  AUTH_FILE_PATH,
  AUTH_ADMIN_FILE_PATH,
} from "../test-utils/utils";

const skipIfAuthCookieValid = async (authFilePath: string) => {
  const authFile = await import(`../${authFilePath}`).catch(() => {});
  if (!authFile) return;

  const authCookie = authFile.cookies.find(({ name }) =>
    name.startsWith("frs_")
  );
  if (!authCookie) return;

  const cookieExpirationDate = new Date(authCookie.expires * 1000);

  test.skip(
    // expiration cookie is valid for next 30min
    cookieExpirationDate.getTime() > new Date().getTime() + 30 * 60 * 1000,
    "Skipping user login - auth file already exists"
  );
};

test("has login prompt", async ({ page }) => {
  await skipIfAuthCookieValid(AUTH_FILE_PATH);

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

  await page.context().storageState({ path: AUTH_FILE_PATH });
});

test.describe("when logging in as an admin", () => {
  test("has login prompt", async ({ page }) => {
    await skipIfAuthCookieValid(AUTH_ADMIN_FILE_PATH);

    await login({ page, login: "admin@admin.pl", password: "testtest" });

    await expect(page).toHaveURL(/.*\/admin\/dashboard/);

    await page.context().storageState({ path: AUTH_ADMIN_FILE_PATH });
  });
});
