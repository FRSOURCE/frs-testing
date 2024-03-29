import test, { Page, expect } from "@playwright/test";

export const AUTH_FILE_PATH = "playwright/.auth/user.json" as const;
export const AUTH_ADMIN_FILE_PATH = "playwright/.auth/admin.json" as const;

export const setTestRole = (role: "user" | "admin" | "guest") => {
  if (role === "guest") {
    return test.use({ storageState: { cookies: [], origins: [] } });
  }

  return test.use({
    storageState: role === "admin" ? AUTH_ADMIN_FILE_PATH : AUTH_FILE_PATH,
  });
};

export const isNuxtHydrated = async (page: Page) => {
  return await page.waitForFunction(
    () => window?.useNuxtApp?.().isHydrating === false
  );
};

export const logAppConsoleLogs = (page: Page) => {
  page.on("console", (msg) => {
    console.log("App log", msg);
  });
};

export const handleLoginForm = async ({
  page,
  login,
  password,
}: {
  page: Page;
  login: string;
  password: string;
}) => {
  await page.getByTestId("login-form-email").clear();
  await page.getByTestId("login-form-email").pressSequentially(login);
  await page.getByTestId("login-form-password").clear();
  await page.getByTestId("login-form-password").pressSequentially(password);

  const awaitResponse = page.waitForResponse(
    async (response) =>
      response.url().endsWith("/graphql") &&
      response.request().postDataJSON().operationName === "Login"
  );

  await page.getByTestId("login-prompt-submit-btn").click();

  const response = await awaitResponse;
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.not.toHaveProperty("errors");
};

export const login = async ({
  page,
  login,
  password,
}: {
  page: Page;
  login: string;
  password: string;
}) => {
  await page.goto("/login");

  await isNuxtHydrated(page);

  await handleLoginForm({ page, login, password });
};
