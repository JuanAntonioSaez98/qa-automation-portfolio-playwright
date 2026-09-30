import { type APIRequestContext, type APIResponse } from '@playwright/test';

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

export type CreatedBooking = {
  bookingid: number;
  booking: Booking;
};

/**
 * Thin client for the Restful-Booker API (https://restful-booker.herokuapp.com/apidoc).
 * Keeps endpoints and auth in one place so specs only express intent.
 */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async createToken(
    username = process.env.BOOKER_USER ?? 'admin',
    password = process.env.BOOKER_PASSWORD ?? 'password123',
  ): Promise<string> {
    const res = await this.request.post('/auth', { data: { username, password } });
    const body = await res.json();
    if (!body.token) throw new Error(`Auth failed: ${JSON.stringify(body)}`);
    return body.token as string;
  }

  health(): Promise<APIResponse> {
    return this.request.get('/ping');
  }

  list(filters?: Record<string, string>): Promise<APIResponse> {
    return this.request.get('/booking', { params: filters });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  create(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  update(id: number, booking: Booking, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }

  partialUpdate(id: number, patch: Partial<Booking>, token: string): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      data: patch,
      headers: { Cookie: `token=${token}` },
    });
  }

  delete(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }
}

/** Builds a valid booking; override any field per test. */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'Lucas',
    lastname: `QA-${Date.now()}`,
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-10-01', checkout: '2026-10-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
