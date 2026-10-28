# oguzakkas.com

Source for my personal website, [oguzakkas.com](https://oguzakkas.com). Built with React, Vite, Tailwind CSS and Framer Motion, deployed on Netlify.

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Start the dev server on http://localhost:3000:
   `npm run dev`
3. Build for production (output in `dist/`):
   `npm run build`

The `/api/*` Netlify Functions don't run under `npm run dev`; use `npx netlify dev` to run them locally.

## Where things live

- `data/profile.ts`: all page content, also used by the chat assistant
- `data/demo.ts`: demo documents, answer keys, and scoring
- `netlify/functions/chat.ts`: "Ask about Oguz" assistant (Gemini)
- `netlify/functions/extract.ts`: live demo extraction (Gemini)
- `lib/gemini.ts`: shared Gemini call and rate limit handling

Both functions need a `GEMINI_API_KEY` environment variable in Netlify.

## Maintenance scripts

- `npm run check:chat`: asks the real assistant on- and off-topic questions to check its guardrails
- `npm run demo:save`: runs each demo document through the live site and saves the results shown before a visitor runs it
- `npm run images:render`: re-renders the demo documents and the link preview image from `scripts/*.html` (needs Chrome and cwebp)
