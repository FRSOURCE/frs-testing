import { Page } from '@playwright/test';

export const isNuxtHydrated = async (page: Page) => {
  return await page.waitForFunction(
    () => window?.useNuxtApp?.().isHydrating === false,
  );
};

export const logAppConsoleLogs = (page: Page) => {
  page.on('console', (msg) => {
    console.log('App log', msg);
  });
};
