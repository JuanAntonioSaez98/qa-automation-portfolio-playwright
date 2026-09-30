# QA Automation Portfolio

[![Playwright](https://github.com/JuanAntonioSaez98/qa-automation-portfolio-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/JuanAntonioSaez98/qa-automation-portfolio-playwright/actions/workflows/playwright.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)

UI and API test automation by **Juan Antonio Saez** — QA Engineer with 3 years of testing experience, now focused on test automation. Built with **Playwright + TypeScript**: Page Object Model, custom fixtures, data-driven tests and CI/CD with GitHub Actions.

📊 **Live Playwright report:** https://juanantoniosaez98.github.io/qa-automation-portfolio-playwright/

**55 tests** (UI × Chromium + Firefox, plus API) across 6 spec files.

---

## Applications under test

- **UI:** [SauceDemo](https://www.saucedemo.com) — demo e-commerce (login, product list, cart, checkout).
- **API:** [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html) — REST API with token auth for hotel bookings.

## What is covered

| Area | Scenarios |
|---|---|
| Login | Valid login, locked user, data-driven negative cases, access control on protected pages, logout |
| Inventory | Sorting by name and price (A→Z, Z→A, low→high, high→low) |
| Cart | Add/remove products, badge counter, persistence after reload, cart contents |
| Checkout | End-to-end purchase, total = subtotal + tax, mandatory field validation |
| API — CRUD | Create, read, filter, full update (PUT), partial update (PATCH), delete |
| API — Security | Updates/deletes without or with invalid token return 403, bad credentials |
| API — Contract & performance | Response schema/types, response time threshold |

See [`docs/TEST_STRATEGY.md`](docs/TEST_STRATEGY.md) for the test design rationale (how manual test cases were turned into automated ones).

## Key practices

- **Page Object Model** — locators and actions live in one place; specs read like test cases.
- **Stable locators** — `data-test` attributes instead of brittle XPath/CSS chains.
- **No hard waits** — Playwright auto-waiting and web-first assertions, never fixed sleeps.
- **Test isolation** — fresh browser context per test; API tests create their own data.
- **Data-driven tests** — parametrised test loops.
- **Tagging** — `@smoke`, `@regression`, `@api`, `@security` to run subsets.
- **Parallel execution** — `fullyParallel` workers, each test in its own isolated browser context.
- **Failure evidence** — screenshots, videos and traces on failure.
- **Configuration outside the code** — base URLs and credentials via env vars.
- **CI/CD** — GitHub Actions on every push/PR, nightly scheduled run, manual trigger with parameters.

## Run locally

Requires Node.js 20+.

```bash
npm ci
npx playwright install
npm test                 # everything
npm run test:ui          # UI only (Chromium + Firefox)
npm run test:api         # API only
npm run test:smoke       # @smoke tag only
npm run test:headed      # watch the browser
npm run report           # open the HTML report
```

Config via env vars (all optional, defaults point to the public demo apps): `UI_BASE_URL`, `API_BASE_URL`, `SAUCE_PASSWORD`, `BOOKER_USER`, `BOOKER_PASSWORD`.

## Project structure

```
├── .github/workflows/        # CI pipeline
├── docs/TEST_STRATEGY.md     # Test approach and traceability
├── src/
│   ├── pages/                # Page Objects
│   ├── fixtures/             # Custom fixtures (injected Page Objects, logged-in state)
│   ├── api/                  # API client + test data builders
│   └── data/                 # Test data
├── tests/{ui,api}/           # Specs
└── playwright.config.ts
```

## Roadmap

- [ ] Visual regression tests (Playwright `toHaveScreenshot`)
- [ ] Accessibility checks with axe-core
- [ ] Allure reports
- [ ] Docker execution

## Contact

- LinkedIn: https://www.linkedin.com/in/juanantoniosaezbarcelo
- Email: juanantoniosaez98@gmail.com
