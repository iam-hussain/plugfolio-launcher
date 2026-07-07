# Plugfolio Launcher

Coming-soon landing page for [plugfolio.com](https://plugfolio.com) — countdown, early-access email capture, full SEO/social metadata.

## Stack

- Next.js (App Router, client-side rendered page)
- Prisma 6 + MongoDB (subscriber emails)
- Fonts: Sora / Inter / Space Mono via `next/font`

## Setup

```bash
npm install
cp .env.example .env   # set DATABASE_URL to your MongoDB connection string
npm run db:push        # create the Subscriber collection/indexes
npm run dev
```

## API

`POST /api/subscribe` — body `{ "email": "you@email.com" }`. Writes to the `Subscriber` collection; duplicate emails return success.

## Assets

All icons and social share images (`app/icon.png`, `apple-icon.png`, `favicon.ico`, `opengraph-image.png`, `twitter-image.png`) are generated from the PlugMark brand SVG:

```bash
npm run generate:assets
```

## Launch date

Edit `LAUNCH_DATE` in `app/page.tsx`.
