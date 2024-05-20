import { test as base, expect } from "@playwright/test";
import { AUTH_FILE_PATH, AUTH_ADMIN_FILE_PATH } from "../test-utils/utils";
import { LoginPage } from "../test-pages/login.pageObject";
import { HomePage } from "../test-pages/home.pageObject";
import { DashboardPage } from "../test-pages/dashboard.pageObject";

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

const test = base.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
  dashboardPage: DashboardPage;
}>({
  loginPage: ({ page }, use) => use(new LoginPage(page)),
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },
  dashboardPage: ({ page }, use) => use(new DashboardPage(page)),
});

test("has login prompt", async ({
  page,
  homePage,
  loginPage,
  dashboardPage,
}) => {
  await skipIfAuthCookieValid(AUTH_FILE_PATH);
  await homePage.loginNavigationLinkClick();

  await loginPage.expectHeadingToContain("Zaloguj się!");
  await loginPage.handleLogin({
    login: "test@test.pl",
    password: "testtest",
  });

  await dashboardPage.expectContentToBeVisible();

  await page.context().storageState({ path: AUTH_FILE_PATH });
});

test.describe("when logging in as an admin", () => {
  test("has login prompt", async ({ page, loginPage }) => {
    await skipIfAuthCookieValid(AUTH_ADMIN_FILE_PATH);
    await loginPage.goto();
    await loginPage.handleLogin({
      login: "admin@admin.pl",
      password: "testtest",
    });

    await expect(page).toHaveURL(/.*\/admin\/dashboard/);

    await page.context().storageState({ path: AUTH_ADMIN_FILE_PATH });
  });
});
