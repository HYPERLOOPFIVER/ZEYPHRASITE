# ZEYPHRA website

The site is a Vite static build with two public routes:

- `/` — Ello for individuals
- `/business` — Ello for Business landing page

The Business page is mobile-first and uses static React/CSS with no client-side UI framework beyond the app already in the project. Its demo request function stores each validated form submission as JSON in Netlify Blobs. If `VITE_DEMO_ENDPOINT` is not configured, the demo form opens WhatsApp with the entered fields prefilled instead.

## Run locally

```sh
npm install
npm run dev
```

Vite serves the site at `http://localhost:5173`. With no environment variables, the demo form uses its WhatsApp fallback. To run the Netlify function locally, install the Netlify CLI and run `netlify dev`; the included `netlify.toml` configures the build and function paths.

## Environment variables

Copy `.env.example` to `.env` when needed.

- `VITE_DEMO_ENDPOINT` — set to `/.netlify/functions/demo` to store demo requests in Netlify Blobs. `netlify.toml` sets this for Netlify production builds.
- `VITE_WHATSAPP_NUMBER` — optional business WhatsApp number in international digits-only format. If omitted, `wa.me/?text=...` opens WhatsApp’s contact picker with the message prefilled; no business number is fabricated in the code.

## Deploy to Netlify

1. Import the Git repository into Netlify.
2. Keep the repository’s `netlify.toml` settings: build command `npm run build`, publish directory `dist`, and functions directory `netlify/functions`.
3. Add `VITE_WHATSAPP_NUMBER` in the Netlify site environment if you want WhatsApp links to open a specific business chat.
4. Deploy. Netlify builds the static site and the `demo` serverless function. The function validates the lead fields and stores a JSON object in the `ello-business-demo-leads` Blobs store.

## Deploy to Vercel

The static pages can be hosted on Vercel with `npm run build` and `dist` as the output directory. The included JSON lead-storage function is Netlify-specific; for Vercel, either configure `VITE_DEMO_ENDPOINT` to point to your own JSON-accepting endpoint or leave it unset to use the WhatsApp fallback.

## Product and legal notes

- The `Try for ₹49/week` buttons open a prefilled WhatsApp message; no checkout or payment processor is included.
- Add the real WhatsApp business number in deployment settings before advertising direct chat links.
- MSME delayed-payment remedies depend on supplier eligibility and the facts of each claim. The marketing page says partner advocates review formal escalation; it does not guarantee a filing, legal outcome, or recovery.
- The illustrative ledger and chat are examples, not customer records or recovery results.
- Do not publish the claims about registered channels or advocate support until those business processes are operational.

## Build

```sh
npm run build
```

Vite writes the static site to `dist/`.
