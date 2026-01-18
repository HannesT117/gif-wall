# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
yarn dev      # Start development server at http://localhost:3000
yarn build    # Production build
yarn start    # Start production server
yarn lint     # Run ESLint
```

## Usage

Access the app with a search query: `http://localhost:3000?q=party`

Query parameters:
- `q` - Search term(s), comma-separated for multiple (required)
- `r` - Refresh interval in milliseconds (default: 5000)

## Environment Setup

Copy `.env.template` to `.env` and configure:
- `API_KEY` - Giphy API key (required)
- `RATING` - Content rating (default: "pg")
- `API_LIMIT` - Max GIFs to fetch (default: 50)

## Architecture

This is a Next.js Pages Router app for displaying fullscreen rotating GIFs.

**Data flow:**
1. `pages/index.tsx` reads query params via `useRouter`
2. SWR fetches GIF data from `/api/search`
3. API route (`pages/api/search.ts`) proxies requests to Giphy API
4. Timer interval cycles through GIFs, avoiding repeats via `usedIndices` Set
5. Next.js Image component displays current GIF fullscreen

**Key files:**
- `pages/index.tsx` - Main page with GIF display logic and state management
- `pages/api/search.ts` - Giphy API proxy endpoint
- `lib/random-int.ts` - Random number utility for GIF selection
- `next.config.js` - Image domain whitelist for `i.giphy.com`
