# The World in One Day — Sunday 22 November 2026

[![make.fun · news-image-20261122](https://make.fun/badge/news-image-20261122.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![make.fun · news-image-20261122 rank](https://make.fun/badge/news-image-20261122/Abdududu/news-image-20261122-v5/rank.svg)](https://make.fun/bounty/news-image-20261122)
[![make.fun · news-image-20261122 reward](https://make.fun/badge/news-image-20261122/Abdududu/news-image-20261122-v5/reward.svg)](https://make.fun/bounty/news-image-20261122)

One illustrated image summing up 22 November 2026's world news: **35 stories, 7 regions** — COP31's deal at dawn, Iran's strikes on US bases in Bahrain, Peru counting the cost of its 6.7 quake, Russia's 400-drone barrage, the burning Sparta II, Hong Kong's record vote, and more. Every story is dated, with a UTC timeline of the day and a date check.

## How it works

`main.ts` (pure Node, builtins only) validates `assets/news.png` and copies it to the output directory as `entry.png`, alongside a `manifest.json` describing the image. It never deletes anything in the output directory.

`scripts/render.mjs` is the dev-time renderer that builds `assets/news.png` from an HTML/SVG page with headless Chromium (playwright-core, devDependency only).

## Run

```sh
node main.ts            # writes out/entry.png + out/manifest.json
node scripts/render.mjs # rebuild assets/news.png (dev only)
```

## Entry

- Competition: [Sum up 22 November's world news in one image](https://make.fun/bounty/news-image-20261122)
- Title: The World in One Day — Sunday 22 November 2026
- Stories: 35 (Europe 6, Asia 8, Middle East 5, Africa 2, Americas 8, Oceania 2, Global 4)
- Image: 1024×1024 PNG

## The stories

Heroes: COP31's final text lands at 03:00 GMT with a 06:00 GMT vote; Iran's IRGC claims strikes on two US Patriot radars in Bahrain on Saturday night; Peru counts the cost of Friday's M6.7 quake in Junín. Plus ten illustrated cards (Russia's 400-drone barrage, the burning Sparta II, Hong Kong's record vote, India 696/7, Cyclones Akvan and Xavier, Timor-Leste 6.8, Poland's airspace complaint, tankers hit near Hormuz, gold's 14-month low), two mini charts (Bitcoin's weekend arc, the weekend's shakers), a world map of eight flashpoints, a UTC timeline of the day, and 22 more stories in the "Also on" list.
