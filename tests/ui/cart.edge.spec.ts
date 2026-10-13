import { test, expect } from '../../src/fixtures/test';

test.describe('Cart - edge cases', () => {
  test('all products can be added and the badge shows the maximum', { tag: ['@regression', '@edge'] }, async ({ loggedInInventory, page }) => {
    const addButtons = page.getByRole('button', { name: 'Add to cart' });
    const total = await addButtons.count();
    for (let i = 0; i < total; i++) {
      await addButtons.first().click();
    }

    await expect(loggedInInventory.cartBadge).toHaveText(String(total));
  });

  test('removing the last item hides the badge and empties the cart', { tag: ['@regression', '@edge'] }, async ({ loggedInInventory, cartPage, page }) => {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await loggedInInventory.openCart();
    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(cartPage.cartBadge).toBeHidden();
  });

  test('checkout with an empty cart: documents the app behaviour', { tag: ['@regression', '@edge'] }, async ({ loggedInInventory, cartPage, page }) => {
    await loggedInInventory.openCart();
    await expect(cartPage.cartItems).toHaveCount(0);
    await cartPage.checkout();

    // A real shop should block this; record what the app does today so a change gets noticed.
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
