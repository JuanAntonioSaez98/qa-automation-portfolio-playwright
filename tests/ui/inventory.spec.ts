import { test, expect } from '../../src/fixtures/test';

test.describe('Inventory - sorting', () => {
  test('sorts products by name A→Z (default)', { tag: ['@regression'] }, async ({ loggedInInventory }) => {
    const names = await loggedInInventory.getNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sorts products by name Z→A', { tag: ['@regression'] }, async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('za');
    const names = await loggedInInventory.getNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('sorts products by price low→high', { tag: ['@smoke'] }, async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('lohi');
    const prices = await loggedInInventory.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts products by price high→low', { tag: ['@regression'] }, async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('hilo');
    const prices = await loggedInInventory.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
