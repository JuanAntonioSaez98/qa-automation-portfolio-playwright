import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PASSWORD, USERS } from '../data/users';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /** Inventory page already authenticated as standard_user. */
  loggedInInventory: InventoryPage;
};

/**
 * Custom fixtures: each test receives ready-to-use Page Objects,
 * so specs stay short and focused on behaviour, not on setup.
 */
export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  loggedInInventory: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.standard, PASSWORD);
    const inventory = new InventoryPage(page);
    await expect(inventory.title).toHaveText('Products');
    await use(inventory);
  },
});

export { expect };
