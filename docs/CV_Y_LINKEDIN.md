# Textos para CV, LinkedIn y entrevistas

> Este archivo es para ti. Si prefieres que no esté en el repo público, muévelo fuera antes de hacer push (o añádelo al `.gitignore`).
> Sustituye `JuanAntonioSaez98` por tu usuario de GitHub.

---

## 1. Titular (CV / LinkedIn)

**ES:** QA Engineer | Automatización con Playwright (TypeScript) | API Testing | 3 años en testing manual

**EN:** QA Engineer | Test Automation with Playwright (TypeScript) | API Testing | 3 years of manual QA

---

## 2. Resumen profesional

**ES:**
QA Engineer con 3 años de experiencia en testing manual funcional, de regresión y exploratorio, diseño de casos de prueba y gestión de defectos. Actualmente enfocado en automatización: he construido un framework de pruebas UI y API con Playwright + TypeScript, aplicando Page Object Model, pruebas data-driven, ejecución en paralelo e integración continua con GitHub Actions. Combino la visión de negocio y el criterio de riesgo del testing manual con la eficiencia de la automatización.

**EN:**
QA Engineer with 3 years of experience in manual functional, regression and exploratory testing, test case design and defect management. Currently focused on test automation: I built a UI and API test framework with Playwright + TypeScript, applying the Page Object Model, data-driven testing, parallel execution and continuous integration with GitHub Actions. I combine the business perspective and risk-based thinking of manual testing with the efficiency of automation.

---

## 3. Sección "Proyectos" del CV

**QA Automation Portfolio** — github.com/JuanAntonioSaez98/qa-automation-portfolio-playwright

**ES:**
- Diseñé y automaticé +30 escenarios UI y API de un e-commerce y una API REST con **Playwright (TypeScript)**.
- Implementé **Page Object Model**, fixtures personalizadas que permiten **ejecución en paralelo** y cross-browser (Chromium, Firefox).
- Automaticé pruebas de **API REST** (CRUD, autenticación por token, seguridad y contrato) con Playwright.
- Configuré pipelines de **CI/CD en GitHub Actions**: ejecución en cada push/PR, ejecución programada diaria y publicación del informe HTML en GitHub Pages.
- Apliqué técnicas de diseño de pruebas (particiones de equivalencia, valores límite, tablas de decisión, transición de estados) y documenté la trazabilidad de casos manuales a automatizados.

**EN:**
- Designed and automated 30+ UI and API scenarios for an e-commerce app and a REST API using **Playwright (TypeScript)**.
- Implemented the **Page Object Model**, custom fixtures enabling **parallel** and cross-browser execution (Chromium, Firefox).
- Automated **REST API** tests (CRUD, token auth, security and contract checks) with Playwright.
- Set up **CI/CD pipelines in GitHub Actions**: runs on every push/PR, nightly scheduled runs and HTML report published to GitHub Pages.
- Applied test design techniques (equivalence partitioning, boundary values, decision tables, state transitions) and documented traceability from manual to automated test cases.

---

## 4. Sección "Skills"

- **Automatización:** Playwright
- **Lenguajes:** TypeScript, JavaScript
- **Testing:** funcional, regresión, smoke, exploratorio, API, cross-browser, E2E
- **Diseño de pruebas:** particiones de equivalencia, valores límite, tablas de decisión, transición de estados
- **Herramientas:** Git, GitHub Actions, npm, Postman, Jira *(añade las que uses en tu trabajo: TestRail, Xray, Zephyr, etc.)*
- **Metodologías:** Agile / Scrum, ISTQB *(si lo tienes)*

---

## 5. Post para LinkedIn (anunciando el proyecto)

> Después de 3 años haciendo testing manual, he dado el salto a la automatización 🚀
>
> He creado un portfolio de automatización con Playwright + TypeScript 🎭
>
> Incluye tests de UI y de API, Page Object Model, pruebas data-driven, ejecución en paralelo y CI con GitHub Actions que publica el informe automáticamente.
>
> Lo que más me ha ayudado viniendo del manual: saber QUÉ merece la pena automatizar. Cada test automatizado nació como un caso de prueba manual, y lo he documentado en una estrategia de pruebas con trazabilidad.
>
> 👉 github.com/JuanAntonioSaez98/qa-automation-portfolio-playwright
>
> ¡Cualquier feedback es bienvenido!
>
> #QA #TestAutomation #Playwright #SoftwareTesting

---

## 6. Preguntas de entrevista que te pueden hacer sobre este proyecto

| Pregunta | Idea clave para tu respuesta |
|---|---|
| ¿Por qué Page Object Model? | Separa localizadores y acciones de las aserciones; si cambia la UI se toca un solo archivo. |
| ¿Cómo evitas los tests flaky? | Nada de `sleep`: auto-waiting de Playwright y aserciones *web-first* con reintento; localizadores `data-test`; tests independientes; retries solo en CI y visibles como *flaky*. |
| ¿Cómo paralelizas? | `fullyParallel` con workers; cada test tiene su propio contexto de navegador aislado (cookies y storage limpios). |
| Playwright vs Selenium | Playwright: auto-waiting, trazas, API testing integrado, más rápido. Selenium: estándar W3C, más lenguajes, ecosistema enorme, muy presente en empresas (conviene conocer la diferencia aunque el portfolio use Playwright). |
| ¿Qué automatizarías primero? | Lo de mayor riesgo y frecuencia (smoke: login, compra). Lo exploratorio o de UX, manual. |
| ¿Cómo gestionas los datos de prueba? | Builders con valores por defecto (`buildBooking()`), cada test crea sus datos; credenciales por variables de entorno. |
| ¿Qué harías distinto en un proyecto real? | Secretos en un vault/GitHub Secrets, entornos (dev/staging), Allure, tests visuales y de accesibilidad, ejecución en Docker/Grid. |

---

## 7. Checklist para publicarlo

1. Crea el repo público `qa-automation-portfolio-playwright` en GitHub.
2. Desde la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "QA automation portfolio: Playwright (TypeScript)"
   git branch -M main
   git remote add origin https://github.com/JuanAntonioSaez98/qa-automation-portfolio-playwright.git
   git push -u origin main
   ```
3. En GitHub → **Settings → Pages → Source: GitHub Actions** (para publicar el informe de Playwright).
4. Añade tu enlace de LinkedIn al final del `README.md` cuando quieras.
5. Fija el repo en tu perfil de GitHub (**Customize your pins**).
6. Añade una descripción y *topics* al repo: `playwright`, `typescript`, `test-automation`, `qa`.
7. Opcional: crea 1–2 Issues con la plantilla de bug describiendo fallos reales de `problem_user` en SauceDemo. Demuestra tu experiencia reportando defectos.
