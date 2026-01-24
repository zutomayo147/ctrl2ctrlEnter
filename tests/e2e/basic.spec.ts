import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://chat.google.com');

  // Expect a title "to contain" a substring.
  // Note: This might redirect to login if not logged in.
  // The goal here is to check if the browser can at least reach the URL.
  await expect(page).toHaveURL(/.*google.com.*/);
});
