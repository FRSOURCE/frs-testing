import { test, expect } from "@playwright/test";
import { login } from "../../test-utils/utils.ts";

test("has login prompt", async ({ page }) => {
  await login({ page, login: "admin@admin.pl", password: "testtest" });

  await expect(page).toHaveURL(/.*\/admin\/dashboard/);
});
