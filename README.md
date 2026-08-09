# SafePlate
Cook confidently, no matter the diet.
SafePlate takes any recipe and rewrites it to fit one or more dietary
restrictions (vegan, gluten-free, dairy-free, and more) — swapping out
non-compliant ingredients and explaining *why* each substitution works,
not just what to swap.
## The Problem
Dietary restrictions and allergies make everyday recipes hard to use
as-is. Most substitution guides are generic ("just use almond flour!")
without explaining why a swap works, or what else in the recipe needs to
change alongside it. SafePlate rewrites the whole recipe — ingredients
and instructions — and shows the reasoning behind each change.
## How It Works
1. Paste in any recipe.
2. Select one or more dietary restrictions (toggle buttons — combine
   vegan + gluten-free, for example).
3. SafePlate sends the recipe to an LLM (via [Featherless.ai](https://featherless.ai))
   with a structured prompt asking for a full, internally-consistent
   rewrite.
4. The app renders the rewritten ingredients, instructions, and a list of
   substitutions with plain-language explanations for each one.
## Tech Stack
- **Backend:** Node.js + Express
- **Frontend:** Vanilla HTML/CSS/JavaScript (no framework)
- **AI:** Featherless.ai API (DeepSeek-V3, `temperature: 0.2` for more
  literal/careful output)
## Running It Locally
```bash
git clone https://github.com/miamatic04/safe-plate
cd safe-plate
npm install
```
Create a `.env` file in the project root:
```
FEATHERLESS_API_KEY=your_key_here
```
Start the server:
```bash
node server.js
```
Open **http://localhost:3000** in your browser.
## Project Structure
```
safe-plate/
├── server.js          # Express server + /api/rewrite route (calls Featherless)
├── public/
│   ├── index.html     # Form UI (restriction toggle buttons, recipe input)
│   ├── style.css       # Styling
│   └── script.js       # Frontend logic (fetch, rendering, status/spinner, copy button)
├── .env                # API key (not committed)
└── package.json
```
## A Note on Reliability
SafePlate uses AI, and AI can make mistakes — including missing a
non-compliant ingredient or getting a detail wrong. The app displays a
disclaimer for exactly this reason: always double-check a rewritten
recipe yourself before cooking or eating, especially for allergies or
medical dietary needs.
## Challenges Faced
- **Getting the AI to catch every non-compliant ingredient**, not just
  the obvious ones (e.g. it initially missed eggs when rewriting a
  recipe as vegan, and initially missed that regular chocolate chips can
  contain dairy). Fixed by tightening the prompt to explicitly require
  checking every ingredient, including indirect/hidden cases.
- **Internal consistency between sections** — early versions would list
  a substitution (e.g. eggs → aquafaba) without actually including the
  replacement, with a quantity, in the ingredients list, making the
  recipe impossible to follow. Fixed with an explicit "every ingredient
  mentioned in instructions must appear in ingredients with a quantity"
  rule, plus a self-check step in the prompt.
- **Run-to-run inconsistency** — the same recipe and restrictions could
  occasionally produce different (and sometimes worse) results between
  runs. Lowering `temperature` and switching to a larger model
  (DeepSeek-V3) noticeably improved consistency, though it isn't
  perfect — hence the disclaimer.
- **A silent `undefined` bug** where the recipe text wasn't reaching the
  backend due to a key-name mismatch between the frontend fetch body and
  `req.body` on the server — a reminder that both sides of an API
  contract need to match exactly.
## What's Next
- Nutrition delta (e.g. "23% less sodium") shown alongside the rewrite
- Automated validation that flags inconsistencies (like a missing
  ingredient quantity) before showing the result to the user
- Save/share rewritten recipes
- Browser extension to rewrite recipes directly on any site
