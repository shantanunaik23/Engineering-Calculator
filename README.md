# Shan's Engineering Calculator

A comprehensive browser-based engineering formula calculator — no server, no build step, no dependencies. Just open `index.html`.

## Features

- **375+ formulas** across 21 engineering disciplines
- **AI-powered workflows** — connect any AI provider and type anything in plain English. The AI reads your query and generates a custom multi-step calculation workflow with correct formulas, standards references, and pre-populated inputs
- **43 built-in workflows** — works offline too, with hardcoded intent recognition for common queries
- **Auto-propagation** — results from Step 1 automatically fill into Step 2 inputs
- **Robust formula evaluator** — handles Unicode math (×, ÷, ², √, π, ln)
- **Collapsible formula browser** at page bottom
- **Export** — TXT report, CSV, Print

## Standards covered

BS EN 1990–1998 (Eurocodes), ASME VIII Div.1, BS 7671, IEC 60364/60909, CIBSE Guides A/B/C, ASHRAE Fundamentals, BS EN 12845, API 520, ISO 5167, BS EN 752, BS EN 806, BS 7910, and 50+ more.

## Usage

Open `index.html` in any modern browser. No install needed.

### New API-based backend (optional)
- A small Express backend is added to support programmatic access to formulas and calculation via REST:
- Endpoints:
- `GET /api/formulas` — list available formulas
- `POST /api/calculate` — evaluate a formula with inputs: { formula_id, inputs }
- Simple in-browser UI at `/public/index.html` for quick testing (loads from the API)

- Lightweight server (`server.js`) and formulas catalog (`formulas.json`).
- Web UI scaffold (`public/index.html`) to test formulas locally.
- Four example formulas to demonstrate: rectangle area, circle area, triangle area, rectangle perimeter.
- Persistence layer with `store.json` to keep user-defined formulas across restarts.
- Basic input validation and safer calculation logic via a shared calculator module.
- Placeholder for AI-driven workflows via API endpoint.
- Updatable user formulas via POST /api/formulas, with in-memory refresh.
- AI workflow endpoints at /api/workflow/:id (stub implementation).
- Simple export capability via UI (TXT/CSV downloads).
- Lightweight server (`server.js`) and formulas catalog (`formulas.json`).
- Web UI scaffold (`public/index.html`) to test formulas locally.
- Four example formulas to demonstrate: rectangle area, circle area, triangle area, rectangle perimeter.
- Persistence layer with `store.json` to keep user-defined formulas across restarts.
- Basic input validation and safer calculation logic via a shared calculator module.
- Placeholder for AI-driven workflows via API endpoint.

Next ideas (optional):
- Add unit handling and input validation with type coercion and error messages.
- Persist user-generated formulas and inputs in a local store or database.
- AI-assisted workflow generator to propose multiple-step calculations.
- Export results as TXT/CSV and print-ready formats.
- Add automated tests for API and calculator logic.
- A small Express backend is added to support programmatic access to formulas and calculation via REST:
- Endpoints:
- `GET /api/formulas` — list available formulas
- `POST /api/calculate` — evaluate a formula with inputs: { formula_id, inputs }
- Simple in-browser UI at `/public/index.html` for quick testing (loads from the API)

What I added:
- Lightweight server (`server.js`) and formulas catalog (`formulas.json`).
- Web UI scaffold (`public/index.html`) to test formulas locally.
- Four example formulas to demonstrate: rectangle area, circle area, triangle area, rectangle perimeter.

Next ideas (optional):
- Add unit handling and input validation with type coercion and error messages.
- Persist user-generated formulas and inputs in a local store or database.
- AI-assisted workflow generator to propose multiple-step calculations.
- Export results as TXT/CSV and print-ready formats.

## AI Providers (optional but recommended)

| Provider | Cost | Notes |
|---|---|---|
| Local AI (WebLLM) | Free | Runs entirely in-browser, no key needed |
| Anthropic Claude | Pay per use | Paste API key in Connect AI modal |
| OpenAI GPT-4 | Pay per use | Paste API key in Connect AI modal |
| Groq | Free tier | Paste API key in Connect AI modal |

When AI is connected, every search query is sent to the AI first — it understands your intent and returns a structured multi-step workflow. Falls back to the built-in database if AI is unavailable.

## License

MIT
