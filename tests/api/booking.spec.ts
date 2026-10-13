import { test, expect, type APIRequestContext } from '@playwright/test';
import { BookingClient, buildBooking, type Booking } from '../../src/api/BookingClient';
import invalidPayloads from '../../src/data/booking-invalid-payloads.json';

/**
 * CRUD tests against Restful-Booker.
 * Serial mode: the tests share one booking (create -> read -> update -> delete).
 */
test.describe('Booking API - CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  let context: APIRequestContext;
  let client: BookingClient;
  let token: string;
  let bookingId: number;
  const booking = buildBooking();

  // One shared API context for the whole serial flow (reuses baseURL + headers from the config)
  test.beforeAll(async ({ playwright, baseURL, extraHTTPHeaders }) => {
    context = await playwright.request.newContext({ baseURL, extraHTTPHeaders });
    client = new BookingClient(context);
    token = await client.createToken();
  });

  test.afterAll(async () => {
    await context.dispose();
  });

  test('health check responds 201', { tag: ['@smoke', '@api'] }, async () => {
    const res = await client.health();
    expect(res.status()).toBe(201);
  });

  test('POST /booking creates a booking', { tag: ['@smoke', '@api'] }, async () => {
    const res = await client.create(booking);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toMatchObject(booking);
    bookingId = body.bookingid;
  });

  test('GET /booking/:id returns the created booking', { tag: ['@api'] }, async () => {
    const res = await client.get(bookingId);
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(booking);
  });

  test('GET /booking can filter by name', { tag: ['@api'] }, async () => {
    const res = await client.list({ firstname: booking.firstname, lastname: booking.lastname });
    expect(res.status()).toBe(200);

    const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(bookingId);
  });

  test('PUT /booking/:id updates the booking with a valid token', { tag: ['@api'] }, async () => {
    const updated = { ...booking, totalprice: 999, additionalneeds: 'Late checkout' };
    const res = await client.update(bookingId, updated, token);

    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(updated);
  });

  test('PATCH /booking/:id partially updates the booking', { tag: ['@api'] }, async () => {
    const res = await client.partialUpdate(bookingId, { firstname: 'Lucía' }, token);

    expect(res.status()).toBe(200);
    expect((await res.json()).firstname).toBe('Lucía');
  });

  test('DELETE /booking/:id removes the booking', { tag: ['@api'] }, async () => {
    const res = await client.delete(bookingId, token);
    expect(res.status()).toBe(201);

    const getRes = await client.get(bookingId);
    expect(getRes.status()).toBe(404);
  });
});

test.describe('Booking API - negative & security', () => {
  test('PUT without token is forbidden', { tag: ['@api', '@security'] }, async ({ request }) => {
    const client = new BookingClient(request);
    const created = await (await client.create(buildBooking())).json();

    const res = await client.update(created.bookingid, buildBooking({ firstname: 'Hacker' }));
    expect(res.status()).toBe(403);
  });

  test('DELETE with invalid token is forbidden', { tag: ['@api', '@security'] }, async ({ request }) => {
    const client = new BookingClient(request);
    const created = await (await client.create(buildBooking())).json();

    const res = await client.delete(created.bookingid, 'invalid-token');
    expect(res.status()).toBe(403);
  });

  test('auth with wrong credentials does not return a token', { tag: ['@api', '@security'] }, async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
    const body = await res.json();

    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });

  test('GET a non-existing booking returns 404', { tag: ['@api'] }, async ({ request }) => {
    const res = await new BookingClient(request).get(999_999_999);
    expect(res.status()).toBe(404);
  });
});

test.describe('Booking API - edge cases', () => {
  for (const { title, remove, override, knownGap } of invalidPayloads) {
    test(`POST /booking rejects payload with ${title}`, { tag: ['@api', '@edge'] }, async ({ request }) => {
      test.fail(!!knownGap, 'Known API gap: Restful-Booker does not validate this field and answers 200');
      const payload: Record<string, unknown> = { ...buildBooking(), ...override };
      for (const key of remove ?? []) delete payload[key];

      const res = await new BookingClient(request).create(payload as unknown as Booking);

      // Restful-Booker answers 400/500 for malformed payloads; it must never create the booking (200).
      expect(res.status()).toBeGreaterThanOrEqual(400);
    });
  }

  for (const id of ['abc', '-1', '0', '99999999999']) {
    test(`GET /booking/${id} does not return a booking`, { tag: ['@api', '@edge'] }, async ({ request }) => {
      const res = await request.get(`/booking/${id}`);
      expect(res.status()).toBe(404);
    });
  }

  test('POST /booking with zero and negative totalprice', { tag: ['@api', '@edge'] }, async ({ request }) => {
    test.fail(true, 'Known API gap: Restful-Booker accepts negative prices without validation');
    const res = await new BookingClient(request).create(buildBooking({ totalprice: -50 }));

    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
