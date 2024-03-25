import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const getWebServerConfig = (): PlaywrightTestConfig["webServer"] => {
  if (process.env.CI && !process.env.E2E_TARGET_URL) {
    return [
      {
        command: [
          "cd ../../frschool_source_code",
          "pnpm --filter @frsource/frschool-api prisma:generate:prod",
          "pnpm --filter @frsource/frschool-api db:migration:reset --force --skip-generate",
          "pnpm --filter @frsource/frschool-api api:dev",
        ].join(" && "),
        url: "http://localhost:4000/graphql",
        reuseExistingServer: false,
        timeout: 120 * 1000,
        stdout: "pipe",
      },
      {
        command: [
          "cd ../../frschool_source_code",
          "pnpm --filter @frsource/frschool-elearning-web dev",
        ].join(" && "),
        url: "http://localhost:3000",
        reuseExistingServer: false,
        timeout: 160 * 1000,
        stdout: "pipe",
      },
    ];
  }

  return undefined;
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CLIENT_BASE_URL || "https://stage.frschool.pl",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project
    { name: "setup", testMatch: /.*\.setup\.ts/ },

    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      dependencies: ["setup"],
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      dependencies: ["setup"],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: getWebServerConfig(),
});
