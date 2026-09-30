import { test, expect } from '../../src/fixtures/test';
import { PRODUCTS } from '../../src/data/users';

test.describe('Shopping cart', () => {
  test('adding products updates the cart badge', { tag: ['@smoke'] }, async ({ loggedInInventory }) => {
    await loggedInInventory.addToCart(PRODUCTS.backpack.id);
    await expect(loggedInInventory.cartBadge).toHaveText('1');

    await loggedInInventory.addToCart(PRODUCTS.bikeLight.id);
    await expect(loggedInInventory.cartBadge).toHaveText('2');
  });

  test('removing a product from inventory updates the badge', { tag: ['@regression'] }, async ({ loggedInInventory }) => {
    await loggedInInventory.addToCart(PRODUCTS.backpack.id);
    await loggedInInventory.removeFromCart(PRODUCTS.backpack.id);

    await expect(loggedInInventory.cartBadge).toBeHidden();
  });

  test('cart lists the selected products', { tag: ['@regression'] }, async ({ loggedInInventory, cartPage }) => {
    await loggedInInventory.addToCart(PRODUCTS.backpack.id);
    await loggedInInventory.addToCart(PRODUCTS.boltTShirt.id);
    await loggedInInventory.openCart();

    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.itemNames).toHaveText([PRODUCTS.backpack.name, PRODUCTS.boltTShirt.name]);
  });

  test('cart content persists after page reload', { tag: ['@regression'] }, async ({ loggedInInventory, page }) => {
    await loggedInInventory.addToCart(PRODUCTS.backpack.id);
    await page.reload();

    await expect(loggedInInventory.cartBadge).toHaveText('1');
  });

  test('product can be removed from the cart page', { tag: ['@regression'] }, async ({ loggedInInventory, cartPage }) => {
    await loggedInInventory.addToCart(PRODUCTS.backpack.id);
    await loggedInInventory.openCart();
    await cartPage.removeItem(PRODUCTS.backpack.id);

    await expect(cartPage.cartItems).toHaveCount(0);
  });
});
