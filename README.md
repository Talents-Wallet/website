# Talents Wallet Website

The static public landing page for Talents, a mobile wallet designed for private
payments on Aztec.

## Local development

Install dependencies without running package lifecycle scripts, then start the
Vite development server:

```bash
npm ci --ignore-scripts
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Run tests

Install the browsers once after `npm ci`:

```bash
npx playwright install --with-deps chromium firefox webkit
```

Run the tests:

```bash
npm run test
```

Regenerate test baselines after an intentional design change:

```bash
npm run test:update
```

## Checks and production build

```bash
npm run check
```

The check verifies known dependency vulnerabilities and registry signatures,
creates the production site in `dist/`, and runs the test suite.
To build or preview separately:

```bash
npm run build
npm run preview
```

## License

Released under the [MIT License](LICENSE).
