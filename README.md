# SafePlate

Cook confidently, no matter the diet.

SafePlate takes any recipe and rewrites it to fit a dietary restriction
(vegan, gluten-free, dairy-free, etc.) — swapping out non-compliant
ingredients and explaining *why* each substitution works, not just what
to swap.

## The Problem

Dietary restrictions and allergies make everyday recipes hard to use
as-is. Most substitution guides are generic ("just use almond flour!")
without explaining why a swap works, or what else in the recipe needs to
change alongside it. SafePlate rewrites the whole recipe — ingredients
and instructions — and shows the reasoning behind each change.

## How It Works

1. Paste in any recipe.
2. Pick a dietary restriction from the dropdown.
3. SafePlate sends the recipe to an LLM (via [Featherless.ai](https://featherless.ai))
   with a structured prompt asking for a full rewrite.
4. The app renders the rewritten ingredients, instructions, and a list of
   substitutions with plain-language explanations for each one.

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla HTML/CSS/JavaScript (no framework)
- **AI:** Featherless.ai API (Qwen2.5-7B-Instruct)

## Running It Locally

```bash
git clone https://github.com/miamatic04/iris-hacks-iv
cd iris-hacks-iv
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
iris-hacks-iv/
├── server.js          # Express server + /api/rewrite route (calls Featherless)
├── public/
│   ├── index.html     # Form UI
│   ├── style.css       # Styling
│   └── script.js       # Frontend logic (fetch, rendering, status messages)
├── .env                # API key (not committed)
└── package.json
```

## Challenges Faced

- **Getting the AI to catch every non-compliant ingredient**, not just the
  obvious ones (e.g. it initially missed eggs when rewriting a recipe as
  vegan). Fixed by tightening the prompt and lowering `temperature` for
  more literal, careful output.
- **Debugging a silent `undefined` bug** where the recipe text wasn't
  reaching the backend due to a key-name mismatch between the frontend
  fetch body and `req.body` on the server — a good reminder that both
  sides of an API contract need to match exactly.

## What's Next

- Nutrition delta (e.g. "23% less sodium") shown alongside the rewrite
- Support for multiple restrictions at once (e.g. vegan *and* gluten-free)
- Save/share rewritten recipes
- Browser extension to rewrite recipes directly on any site
