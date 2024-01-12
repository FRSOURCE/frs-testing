import { test, expect } from '@playwright/test';
import { isNuxtHydrated } from '../test-utils/utils';

test('has login prompt', async ({ page }) => {
  await page.goto('/');

  await isNuxtHydrated(page);

  await page.getByTestId('pre-auth-login-button').click();
  await expect(page.getByTestId('login-prompt')).toContainText('Zaloguj sięęęęęę!');

  await page.getByTestId('login-form-email').clear();
  await page.getByTestId('login-form-email').pressSequentially('test@test.pl');
  await page.getByTestId('login-form-password').clear();
  await page.getByTestId('login-form-password').pressSequentially('testtest');

  await page.getByTestId('login-prompt-submit-btn').click();

  await expect(page.getByTestId('dashboard')).toBeVisible();
});
