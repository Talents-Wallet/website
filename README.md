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

## Checks and production build

```bash
npm run check
```

The check verifies known dependency vulnerabilities and registry signatures,
then creates the production site in `dist/`. To build or preview separately:

```bash
npm run build
npm run preview
```

## License

Released under the [MIT License](LICENSE).
