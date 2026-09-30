import { test, expect } from '@playwright/test';
import { BookingClient, buildBooking } from '../../src/api/BookingClient';

/**
 * Contract-style checks: validates the shape and types of the response,
 * not only the values. Catches breaking API changes early.
 */
test('booking response matches the expected contract', { tag: ['@api', '@contract'] }, async ({ request }) => {
  const client = new BookingClient(request);
  const res = await client.create(buildBooking());
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/json');

  const { booking } = await res.json();
  expect(booking).toEqual({
    firstname: expect.any(String),
    lastname: expect.any(String),
    totalprice: expect.any(Number),
    depositpaid: expect.any(Boolean),
    bookingdates: {
      checkin: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      checkout: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    },
    additionalneeds: expect.any(String),
  });
});

test('booking list responds in under 3 seconds', { tag: ['@api', '@performance'] }, async ({ request }) => {
  const start = Date.now();
  const res = await new BookingClient(request).list();
  const elapsed = Date.now() - start;

  expect(res.ok()).toBeTruthy();
  expect(elapsed, `Response took ${elapsed}ms`).toBeLessThan(3_000);
});
