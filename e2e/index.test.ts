import { test, expect } from '@playwright/test';

test('Verify that the page renders properly', async ({ page }) => {
  await page.goto('http://localhost:5173');

  const res = await page.evaluate(async () => {
    const pageContent = document.body.innerHTML;
    return pageContent.includes('That');
  });

  expect(res).toBe(true);
});
