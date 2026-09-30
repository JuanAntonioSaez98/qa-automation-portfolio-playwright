# Test Strategy

This document explains *why* the suite looks the way it does. It connects my background in manual testing with the automated suite: every automated test started as a manual test case.

## 1. Scope

| In scope | Out of scope |
|---|---|
| Critical user journeys of SauceDemo (login → browse → cart → checkout) | Visual design / pixel perfection (planned: visual regression) |
| Functional validation and error messages | Load testing |
| REST API CRUD, auth and contract of Restful-Booker | Mobile browsers |

## 2. Selection criteria: what to automate

I prioritised with a simple **risk × frequency** matrix:

| Priority | Criteria | Examples |
|---|---|---|
| **P1 – Smoke** | Blocks the business if broken; run on every commit | Login, add to cart, complete purchase, create booking |
| **P2 – Regression** | Important rules and negative paths | Validation messages, sorting, totals, locked user |
| **P3 – Security / contract** | Low frequency, high impact | 403 without token, response schema |

Scenarios that are exploratory, change often or require human judgement (UX, look & feel) stay manual.

## 3. Test design techniques

| Technique | Where it is applied |
|---|---|
| **Equivalence partitioning** | Login: valid user / locked user / invalid credentials |
| **Boundary / empty values** | Empty username, empty password, empty checkout fields |
| **Decision table** | Checkout form: each mandatory field missing → specific error |
| **State transition** | Cart: empty → 1 item → 2 items → item removed → empty |
| **CRUD lifecycle** | API: create → read → update → partial update → delete → 404 |
| **Negative / security testing** | API calls without token or with invalid token |

## 4. Traceability (manual test case → automated test)

| ID | Manual test case | Automated test |
|---|---|---|
| TC-01 | Valid login redirects to the product list | `login.spec.ts` › standard user can log in |
| TC-02 | Locked user cannot log in | `login.spec.ts` › locked out user |
| TC-03 | Invalid credentials show an error | `login.spec.ts` › validation error (×3) |
| TC-04 | Protected URL requires login | `login.spec.ts` › protected page redirects |
| TC-05 | Products can be sorted | `inventory.spec.ts` (×4) |
| TC-06 | Cart badge reflects the number of items | `cart.spec.ts` |
| TC-07 | Complete purchase | `checkout.spec.ts` › end-to-end purchase |
| TC-08 | Order total = subtotal + tax | `checkout.spec.ts` › order total |
| TC-09 | Checkout mandatory fields | `checkout.spec.ts` (×3) |
| API-01 | Booking CRUD | `booking.spec.ts` › CRUD |
| API-02 | Modifications require a valid token | `booking.spec.ts` › negative & security |
| API-03 | Response contract | `booking.schema.spec.ts` |

## 5. Environments and execution

| Trigger | What runs |
|---|---|
| Pull request / push to `main` | Full suite |
| Scheduled (weekdays 06:00 UTC) | Full suite |
| Manual (`workflow_dispatch`) | Full suite on demand |

## 6. Flakiness policy

- No fixed waits; only auto-waiting / explicit waits.
- Retries **only in CI** (Playwright `retries: 2`) and a retried test is still visible as *flaky* in the report so it gets investigated, not hidden.
- Tests do not depend on each other, except the explicit serial API CRUD flow.

## 7. Known issues found

SauceDemo intentionally ships buggy users (`problem_user`, `error_user`). Defects found are reported as GitHub Issues using the [bug report template](../.github/ISSUE_TEMPLATE/bug_report.md) (steps to reproduce, expected vs actual, severity/priority, evidence).
