import { test, expect } from '../../src/fixtures/test';
import { PASSWORD, USERS, PRODUCTS } from '../../src/data/users';

test.describe('Special users - problem_user', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.problem, PASSWORD);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  // Known application bugs for problem_user: each test asserts the CORRECT behaviour
  // and is marked as expected-to-fail, so it turns red the day the bug is fixed.
  test('every product shows its own image', { tag: ['@regression', '@edge'] }, async ({ inventoryPage, page }) => {
    test.fail(true, 'Known bug: problem_user sees the same image for every product');
    const sources = await page.locator('img.inventory_item_img').evaluateAll((imgs) =>
      imgs.map((img) => (img as HTMLImageElement).getAttribute('src')),
    );

    expect(new Set(sources).size).toBe(sources.length);
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('sorting by price low→high works', { tag: ['@regression', '@edge'] }, async ({ inventoryPage }) => {
    test.fail(true, 'Known bug: sorting does nothing for problem_user');
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('a product can be added to the cart', { tag: ['@regression', '@edge'] }, async ({ inventoryPage }) => {
    test.fail(true, 'Known bug: the Add to cart button does not work for some products');
    await inventoryPage.addToCart(PRODUCTS.boltTShirt.id);

    await expect(inventoryPage.cartBadge).toHaveText('1', { timeout: 3_000 });
  });
});

test.describe('Special users - performance_glitch_user', () => {
  test('can log in despite the slow response', { tag: ['@regression', '@edge', '@performance'] }, async ({ loginPage, inventoryPage, page }) => {
    test.setTimeout(60_000);
    await loginPage.goto();
    const start = Date.now();
    await loginPage.login(USERS.performanceGlitch, PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/, { timeout: 25_000 });
    await expect(inventoryPage.items).toHaveCount(6, { timeout: 20_000 });
    // Slowness is the point of this user: document how long it took.
    test.info().annotations.push({ type: 'login-duration-ms', description: String(Date.now() - start) });
  });
});
