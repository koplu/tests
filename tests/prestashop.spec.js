const { test, expect } = require('@playwright/test');

const baseUrl = 'https://prestashop.tesena.com/cs/';
const productName = 'Hummingbird printed t-shirt';

test('Navigace z hlavní stránky na detail produktu', async ({ page }) => {
  await page.goto(baseUrl);

  await page.getByRole('link', { name: productName }).first().click();

  await expect(page.locator('h1')).toContainText(productName, {
    ignoreCase: true
  });

  await expect(page.locator('.add-to-cart')).toBeVisible();
});

test('Přidání produktu do košíku a kontrola množství', async ({ page }) => {
  await page.goto(
    'https://prestashop.tesena.com/cs/men/1-1-hummingbird-printed-t-shirt.html#/1-velikost-s/8-barva-bila'
  );

  await page.locator('.add-to-cart').click();

  const modal = page.locator('#blockcart-modal');
  await expect(modal).toBeVisible();

  await modal.getByRole('link', { name: /Pokračovat do pokladny/i }).click();

  const cartItem = page.locator('.cart-item').filter({
    hasText: productName
  });

  await expect(cartItem).toBeVisible();

  await expect(
    cartItem.locator('input[name="product-quantity-spin"]')
  ).toHaveValue('1');
});