import { test, expect } from '../../src/fixtures/test';
import { PASSWORD, USERS } from '../../src/data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in', { tag: ['@smoke'] }, async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(USERS.standard, PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('locked out user sees an error', { tag: ['@regression'] }, async ({ loginPage, page }) => {
    await loginPage.login(USERS.lockedOut, PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
    await expect(page).not.toHaveURL(/inventory/);
  });

  // Data-driven negative tests: one test per row, each reported separately
  const invalidCases = [
    { title: 'empty username', user: '', pass: PASSWORD, error: 'Epic sadface: Username is required' },
    { title: 'empty password', user: USERS.standard, pass: '', error: 'Epic sadface: Password is required' },
    {
      title: 'wrong password',
      user: USERS.standard,
      pass: 'wrong_password',
      error: 'Epic sadface: Username and password do not match any user in this service',
    },
  ];

  for (const { title, user, pass, error } of invalidCases) {
    test(`shows validation error with ${title}`, { tag: ['@regression'] }, async ({ loginPage }) => {
      await loginPage.login(user, pass);
      await expect(loginPage.errorMessage).toHaveText(error);
    });
  }

  test('protected page redirects to login when not authenticated', { tag: ['@regression'] }, async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.errorMessage).toContainText("You can only access '/inventory.html' when you are logged in");
  });

  test('user can log out', { tag: ['@regression'] }, async ({ loggedInInventory, loginPage }) => {
    await loggedInInventory.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
