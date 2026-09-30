import { test, expect } from '../../src/fixtures/test';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { CUSTOMER, PRODUCTS } from '../../src/data/users';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedInInventory, cartPage }) => {
    await loggedInInventory.addToCart(PRODUCTS.backpack.id);
    await loggedInInventory.addToCart(PRODUCTS.bikeLight.id);
    await loggedInInventory.openCart();
    await cartPage.checkout();
  });

  test('end-to-end purchase is completed', { tag: ['@smoke', '@e2e'] }, async ({ checkoutPage, page }) => {
    await test.step('fill in customer information', async () => {
      await checkoutPage.fillInformation(CUSTOMER);
      await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    });

    await test.step('finish the order', async () => {
      await checkoutPage.finish();
      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });
  });

  test('order total equals subtotal + tax', { tag: ['@regression'] }, async ({ checkoutPage }) => {
    await checkoutPage.fillInformation(CUSTOMER);

    const subtotal = CheckoutPage.parseAmount(await checkoutPage.subtotalLabel.innerText());
    const tax = CheckoutPage.parseAmount(await checkoutPage.taxLabel.innerText());
    const total = CheckoutPage.parseAmount(await checkoutPage.totalLabel.innerText());

    // Backpack ($29.99) + Bike Light ($9.99)
    expect(subtotal).toBeCloseTo(39.98, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  const missingFields = [
    { field: 'first name', info: { ...CUSTOMER, firstName: '' }, error: 'Error: First Name is required' },
    { field: 'last name', info: { ...CUSTOMER, lastName: '' }, error: 'Error: Last Name is required' },
    { field: 'postal code', info: { ...CUSTOMER, postalCode: '' }, error: 'Error: Postal Code is required' },
  ];

  for (const { field, info, error } of missingFields) {
    test(`cannot continue without ${field}`, { tag: ['@regression'] }, async ({ checkoutPage }) => {
      await checkoutPage.fillInformation(info);
      await expect(checkoutPage.errorMessage).toHaveText(error);
    });
  }
});
