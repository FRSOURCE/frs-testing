import { homepageTest as test } from "../test-pages/home.pageObject";

test("on home page renders dashboard container", async ({ homePage }) => {
  await homePage.expectLoginNavigationLinkToBeVisible();
});

test("fulfills WCAG standards", async ({ homePage }) => {
  await homePage.expectPageToBeAccessible({
    disableRules: ["landmark-unique", "region", "landmark-no-duplicate-banner"],
  });
});
