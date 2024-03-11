import { test, expect } from "@playwright/test";
import { isNuxtHydrated, testAsRole } from "../test-utils/utils";

testAsRole("user");

test("on dashboard page renders dashboard container", async ({ page }) => {
  await page.goto("/dashboard");
  await isNuxtHydrated(page);

  await expect(page.getByTestId("dashboard")).toBeVisible();
});

test.describe("when logged in as admin", () => {
  testAsRole("admin");

  test("on dashboard page renders admin navigation button", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await isNuxtHydrated(page);

    await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
  });
});
