# Afropop Worldwide — Website Design & Build Spec (v1.0)

## 0) Goals & principles
- **Audio-first storytelling:** persistent mini-player, play anywhere.
- **Archive → Discovery:** fast filters (region, genre, era, instrument, artist, host).
- **Credible + contemporary:** minimal, Swiss-leaning UI; culture-forward imagery; NPR/Nat Geo tone.
- **Access for everyone:** transcripts, readable type, keyboard-first nav, high contrast.
- **Performance by default:** LCP ≤ 2.5s (4G), CLS ≤ 0.1, critical CSS/JS ≤ 150KB.

---

## 1) Information architecture (top‑nav)
- Archive
- Episodes
- Features
- Events
- Programs
- Hosts & Contributors
- Support
- Shop
- About
- Search

### URL rules
```text
/episodes/[slug]
/features/[slug]
/events/[slug]
/programs/[slug]
/contributors/[slug]
/archive?type=&region=&genre=&era=&length=&host=&tag=
```
- Slugs: lowercase, hyphenated; immutable once published.

---

## 2) Global shell & key patterns

### Header (sticky)
- Left: Afropop wordmark (SVG)
- Center: primary nav (scrollable on mobile)
- Right: Search (⌘/Ctrl‑K), Donate, Menu (mobile)
- **Now Playing** strip below header → collapses to mini‑player on scroll

### Persistent audio player
- Anchored bottom (mobile) / bottom‑right (desktop); expands to modal
- Controls: play/pause, scrubber, time, ±15s, queue, share, transcript
- State survives route changes (PWA service worker + global store)

### Card system
- **Episode card:** 1:1 image, title (2 lines), region/genre chips, duration, play hover
- **Feature card:** 3:2 image, title, dek (2 lines), author, read time
- **Event card:** 3:4 poster, date badge, city/venue, CTA
- **Program card:** 16:9 image, one‑line purpose, participating artists

### Filters & search
- Facets: Region, Country, Genre, Era/Decade, Mood, Host, Length, Tags
- Combinable, shareable URLs; client instant merge; server canonical for SEO

### Footer
- Mission, newsletter (single input), quick links, socials, attribution

---

## 3) Page templates

### Home
- **Hero:** “Listen now” + top story (16:9, play)
- Modules (CMS‑orderable): New this week, News from the Diaspora, Trending regions, Events near you, From the archive, Programs
- **AC:** Lighthouse Perf ≥ 90 on 4G; modules degrade without JS

### Archive (unified library)
- Left filter rail (desktop) / slide‑over (mobile)
- Sort: newest, relevance, length, most played
- Mixed results (type badges: Episode, Feature, Event)
- **AC:** Filter change < 150ms client; SSR result TTFB < 1s (cached)

### Episode detail
- Hero art, title, hosts, duration, share
- **Pinned player** under title; sticky mini‑player prevents double audio
- Show notes, embedded tracks, people/places, gallery
- **Transcript** toggle; optional time‑sync highlights; MP3 download policy‑dependent
- Related by region/genre/artist
- JSON‑LD: `PodcastEpisode`; OG 1200×630
- **AC:** Transcript keyboard‑navigable; focus never trapped in player

### Feature detail
- Clean reading column, pull‑quotes, captions, footnotes, read time
- JSON‑LD: `Article`

### Events
- Month strip + calendar; upcoming list; ICS + “Add to Google/Apple”
- JSON‑LD: `MusicEvent`

### Programs
- Grid of initiatives/series
- Detail: aims, partners, associated entries, CTA

### Hosts & Contributors
- Tabs: **People** (alpha index), **Shows**
- Profile: bio, social, episodes by person

### Support
- Tiers + one‑time; perks grid; employer match; fiscal sponsor
- **AC:** Transaction ≤ 3 steps; clear tax‑deductible language

### Shop
- If external, integrate header/footer + SSO to cart

### About
- Mission, history, team, press kit, contact; JSON‑LD: `Organization`

---

## 4) Design system

### Grid
| Breakpoint | Columns | Gutter |
|---|---|---|
| ≤640 | 4 | 16 |
| 641–1024 | 8 | 20 |
| 1025–1440 | 12 | 24 |
| ≥1441 | 12 | 32 |

### Type
| Token | Use |
|---|---|
| **DM Sans** | Display |
| **Inter** | Body/UI |
| **IBM Plex Mono** | Timecodes/meta |

Scale: 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64

### Color tokens
| Token | Hex | Use |
|---|---|---|
| --ink | #0B0B0C | Text |
| --paper | #FFFFFF | Background |
| --accent | #FF5A2F | CTA/date badges |
| --accent-2 | #1460F2 | Links/hovers |
| --neutral-100..900 | grayscale | UI |
| --success | #18A957 | Status |
| --warn | #E7A500 | Status |

- Contrast: ≥ 4.5:1 body text

### Spacing & radii
- Base 4px scale; radii 4/8/12/20; dotted borders 1px for tag motif

### Motion
- 120–180ms ease‑out; reduce‑motion respected; player scrubber spring 200ms

### Imagery
- Episode 1:1; Feature 3:2; Event 3:4; Program 16:9; focal point tool in CMS

---

## 5) Accessibility
- Skip‑to‑content; visible focus; semantic landmarks
- Player: ARIA only inside control cluster; shortcuts: space, ←/→, **f**
- Transcripts mandatory for new episodes; backlog queue

---

## 6) Technical architecture

### Frontend
- Next.js 14 (App Router), React 18, TypeScript, Tailwind, shadcn/ui
- ISR for content routes; segment caching; Edge runtime for search
- Next/Image + AVIF/WebP; dominant‑color placeholder
- Audio: `<audio>` + custom UI; Media Session API
- PWA: installable; optional offline queue (last 5 episodes)

### Backend / CMS
- Craft CMS (headless, GraphQL)
- Assets: S3/GCS; Imgproxy/Thumbor optional

### Search
- Typesense or Algolia (facets + synonyms)
- Indexed: title, dek, transcript excerpt, people, regions, genres, countries, tags, duration, year

### Hosting
- Vercel frontend (Edge + ISR); CDN for audio (Cloudfront/Cloudflare)

---

## 7) Craft CMS model (key fields)

**Taxonomies**
- Region, Country, Genre, Era, Mood, Tags, People, Programs

**Episode**
- Title, Dek, Audio, Duration, Transcript, Notes, People, Taxonomies, 1:1 Cover, Related, Publish date, Episode type

**Feature**
- Title, Dek, Body (blocks), Author(s), 3:2 Hero, Taxonomies

**Event**
- Title, 3:4 Poster, Start/End, Venue, City, Country, Ticket link, Program

**Program**
- Title, 16:9 Hero, Summary, Body, Partners, Featured entries

**Contributor**
- Name, Photo, Bio, Roles/Beats, Socials, Related entries

**Page**
- Flexible blocks (About/Support)

**Support Tier**
- Name, Price, Perks, Checkout link

**Automation**
- RSS ingest → Episode stub + transcript placeholder
- Webhooks → reindex search, purge ISR cache

---

## 8) SEO & sharing
- JSON‑LD per type (`PodcastSeries`, `PodcastEpisode`, `Article`, `MusicEvent`, `Organization`)
- OG images: server‑rendered template; include region/flag when relevant
- Canonicals on filtered pages; segmented sitemaps; robots allow audio

---

## 9) Performance budgets
| Metric | Budget |
|---|---|
| LCP | ≤ 2.5s (4G) |
| CLS | ≤ 0.1 |
| TTI | ≤ 3.5s |
| JS (initial) | ≤ 250KB gzip |
| Images | Lazy below fold; responsive srcset |

Monitoring: Web Vitals to GA4 + Vercel Analytics; alerts on 75th percentile breaches.

---

## 10) Analytics & events
- Track: play/complete %, seek, share, transcript open, filter usage, donate funnel, newsletter signup, outbound ticket clicks.

---

## 11) Governance & workflow
- Roles: Editor, Producer, Fact‑checker, Publisher
- States: Draft → In Review → Scheduled → Live → Archived
- Required: cover, region or country, transcript (or “pending” flag)
- Image rights checklist on publish

---

## 12) Build plan (8–10 weeks)

**Phase 1 — System & scaffolding (W1–2)**
- Repo, CI/CD, tokens, base layouts, header/footer, mini‑player skeleton

**Phase 2 — Core content (W3–5)**
- Archive (facets + SSR), Episodes, Features, Contributors

**Phase 3 — Programs & Events (W6)**
- Programs list/detail, Events calendar + ICS

**Phase 4 — Support & About (W7)**
- Donation CTAs, tiers, About & team cards

**Phase 5 — Polish & ship (W8–10)**
- A11y pass, SEO/OG, perf hardening, analytics, 301s, sitemap

---

## 13) Component inventory
- `SiteHeader` (now‑playing aware)
- `MiniPlayer` (Zustand store, Media Session)
- `Card` (episode/feature/event/program)
- `FilterRail` + `Facet` (querystring‑driven)
- `RichText` (Craft blocks → components)
- `DonateBanner` (25% scroll; dismissible)
- `Calendar` (SSR month grid; ICS)
- `Transcript` (collapsible; WebVTT cues)

---

## 14) Microcopy & tone
- Buttons: Listen now, Read story, Explore region, Get tickets, Support Afropop
- Support lead: “Public‑service music journalism, powered by listeners.”

---

## 15) QA checklist
- Keyboard operates all player controls
- Transcript visible without JS
- Filters deep‑link; back/forward works
- Unique OG per entry
- Styled 404/500 with search

---

## What’s intentionally different from dublab
- “Tune In” → “Now Playing / Latest Episode”
- **DJs** → **Hosts & Contributors**
- **Projects** → **Programs**
- **News from the Diaspora** module on Home
- Stronger emphasis on transcripts & feature writing
