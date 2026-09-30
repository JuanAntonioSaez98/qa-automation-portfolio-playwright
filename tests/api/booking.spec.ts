import { test, expect, type APIRequestContext } from '@playwright/test';
import { BookingClient, buildBooking } from '../../src/api/BookingClient';

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
