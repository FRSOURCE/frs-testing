import { test, expect } from "@playwright/test";
import { isNuxtHydrated, setTestRole } from "../test-utils/utils";

setTestRole("user");

test("on dashboard page renders dashboard container", async ({ page }) => {
  await page.goto("/dashboard");
  await isNuxtHydrated(page);

  await expect(page.getByTestId("dashboard")).toBeVisible();
});

test.describe("when logged in as admin", () => {
  setTestRole("admin");

  test("on dashboard page renders admin navigation button", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await isNuxtHydrated(page);

    await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
  });
});
