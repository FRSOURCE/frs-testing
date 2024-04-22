import test, { type Page } from "@playwright/test";

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

export const logAppConsoleLogs = (page: Page) => {
  page.on("console", (msg) => {
    console.log("App log", msg);
  });
};
