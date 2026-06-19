import { test } from '@playwright/test';
test.use({ baseURL: 'http://localhost:4321' });
test('check colors', async ({ page }) => {
  await page.goto('/es/');
  const result = await page.evaluate(() => {
    const btn = document.querySelector('.button-primary') as HTMLElement;
    const span = document.querySelector('.button-primary > span') as HTMLElement;
    return {
      btnBg: btn ? window.getComputedStyle(btn).backgroundColor : 'not found',
      spanBg: span ? window.getComputedStyle(span).backgroundColor : 'not found',
      dataTheme: document.documentElement.getAttribute('data-theme'),
      primaryVar: getComputedStyle(document.documentElement).getPropertyValue('--color-primary-800'),
    };
  });
  console.log('\n\n== COLOR DEBUG ==\n', JSON.stringify(result, null, 2), '\n==');
});
