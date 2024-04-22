import { dashboardTest as test } from "../test-pages/dashboard.pageObject";
import { setTestRole } from "../test-utils/utils";

setTestRole("user");

test("on dashboard page renders dashboard container", async ({
  dashboardPage,
}) => {
  await dashboardPage.expectContentToBeVisible();
});

test.describe("when logged in as admin", () => {
  setTestRole("admin");

  test("on dashboard page renders admin navigation button", async ({
    dashboardPage,
  }) => {
    await dashboardPage.expectAdminNavigationLinkToBeVisible();
  });
});
