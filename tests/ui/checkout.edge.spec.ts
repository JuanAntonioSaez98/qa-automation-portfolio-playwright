import { test, expect } from '../../src/fixtures/test';
import { PRODUCTS } from '../../src/data/users';
import edgeCases from '../../src/data/checkout-edge-cases.json';

test.describe('Checkout - edge cases', () => {
  test.beforeEach(async ({ loggedInInventory, cartPage }) => {
    await loggedInInventory.addToCart(PRODUCTS.backpack.id);
    await loggedInInventory.openCart();
    await cartPage.checkout();
  });

  for (const { title, firstName, lastName, postalCode, repeat } of edgeCases) {
    test(`accepts customer data with ${title}`, { tag: ['@regression', '@edge'] }, async ({ checkoutPage }) => {
      const times = repeat ?? 1;
      await checkoutPage.fillInformation({
        firstName: firstName.repeat(times),
        lastName: lastName.repeat(times),
        postalCode: postalCode.repeat(times),
      });

      await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    });
  }

  test('data typed is not executed as script', { tag: ['@regression', '@edge', '@security'] }, async ({ checkoutPage, page }) => {
    let dialogOpened = false;
    page.on('dialog', async (dialog) => {
      dialogOpened = true;
      await dialog.dismiss();
    });

    await checkoutPage.fillInformation({
      firstName: '<img src=x onerror=alert(1)>',
      lastName: 'QA',
      postalCode: '28001',
    });
    await checkoutPage.finish();

    await expect(checkoutPage.completeHeader).toBeVisible();
    expect(dialogOpened).toBe(false);
  });
});
