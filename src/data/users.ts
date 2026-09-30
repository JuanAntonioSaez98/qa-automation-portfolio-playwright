/**
 * Test data for SauceDemo. These are the public demo credentials published on the login page.
 * In a real project, secrets would come from environment variables / a vault, never from the repo.
 */
export const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
} as const;

export type UserKey = keyof typeof USERS;

export const CUSTOMER = {
  firstName: 'Lucas',
  lastName: 'QA',
  postalCode: '28001',
};

export const PRODUCTS = {
  backpack: { id: 'sauce-labs-backpack', name: 'Sauce Labs Backpack' },
  bikeLight: { id: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light' },
  boltTShirt: { id: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt' },
} as const;
