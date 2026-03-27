# Changelog

## 2026-03-27 — Visual Redesign: Warm Editorial Theme
- Complete overhaul from dark terminal theme to warm light editorial design
- New palette: cream (#FAF9F6) bg, coral (#E8553A) accent, ink (#1a1715) text
- Glass blur nav with pill-shaped CTA, shadow cards, rounded-2xl containers
- Segmented sort controls with active state highlight
- All 7 components + 3 pages rewritten for new design system
- Added Twitter/X ingestion pipeline (scripts/ingest-tweets.ts)
- NLP-based extraction: airport codes, wait times, sentiment analysis

## 2026-03-27 — Initial Build
- Created Airport TSA Times platform
- "Terminal Board" design: dark theme, amber accents, JetBrains Mono for numbers
- 50 US airports seeded with realistic checkpoint data
- Home dashboard with search, sort (longest/shortest/active/A-Z), live feed sidebar
- Airport detail pages with checkpoint breakdown, hourly trend charts, pro tips
- 3-step report flow: airport → checkpoint → slider → submit
- Color-coded wait times: green (<15m), yellow (15-30m), red (>30m)
- Supabase client scaffolded (needs project + env vars to go live)
- Mobile-first responsive design
