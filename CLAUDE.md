# OCB Jack King's Classic 2026 — digital program

Static site, no build step. Live at **https://jackkingsclassic.netlify.app** — Netlify
auto-deploys every push to `main`. The event is Saturday, July 18, 2026.

## Data integrity rules (read before touching data.js)

- Competitor numbers run 11–66. **Number 46 is intentionally missing** (withdrew).
  Never renumber, never fill the gap, never treat it as a bug.
- Class names in `CLASSES` must stay exactly as written, including "PQ" suffixes and
  A/B/C splits. They are keys for `RESULTS` and `DIVISION_INFO`.
- Never invent competitors, classes, or sponsors.

## Day-of results workflow (show day: July 18, 2026)

The promoter (Stacey) will send placements from the venue, e.g. "Class 12: 1st 25,
2nd 16, 3rd 13" or "Bikini Open — winner 56, then 59, 57".

1. Add an entry to `RESULTS` in `data.js`, keyed by the **exact** class name, value =
   competitor numbers in placement order (1st first, up to 5 places). Partial results
   (winner only) are fine.
2. **Echo the parsed result back with names** (e.g. "1st: 25 Davonte Ruffin") so a
   mis-keyed number is caught before it goes public. Numbers→names are in
   `COMPETITORS` in data.js.
3. Bump `VERSION` in `sw.js` (e.g. v5 → v6) — required on every content change.
4. Commit and push to `main`. Verify with:
   `curl -s https://jackkingsclassic.netlify.app/data.js | grep "<class name>"`
   (allow ~30s for the deploy).

Class 12 = the 12th entry in `CLASSES` (1-indexed). If a message references a class
by number, map it through `CLASSES` and confirm the name in the echo-back.

The 39 class names, in running order (use verbatim as RESULTS keys):
Men's Bodybuilding Debut · Men's Bodybuilding Novice · Men's Bodybuilding 60+ ·
Men's Bodybuilding Open PQ · Men's Physique Debut A · Men's Physique Debut B ·
Men's Physique Novice A · Men's Physique Novice B · Men's Physique Novice C ·
Men's Physique 40+ PQ · Men's Physique 50+ · Men's Physique Open A PQ ·
Men's Physique Open B PQ · Men's Physique Open C PQ · Men's Classic Physique Debut A ·
Men's Classic Physique Debut B · Men's Classic Physique Novice A ·
Men's Classic Physique Novice B · Men's Classic Physique 40+ PQ ·
Men's Classic Physique Open A PQ · Men's Classic Physique Open B PQ ·
Women's Physique Debut · Women's Physique Novice · Women's Physique Open PQ ·
Women's Figure Debut · Women's Figure Novice · Women's Figure 40+ PQ ·
Women's Figure 50+ · Women's Figure 60+ · Women's Figure Open PQ ·
Women's Bikini Debut · Women's Bikini Novice A · Women's Bikini Novice B ·
Women's Bikini 40+ PQ · Women's Bikini Open PQ · Women's Wellness Debut ·
Women's Wellness Novice · Women's Wellness 40+ PQ · Women's Wellness Open PQ

## Other conventions

- Any change to competitor/class data (not just results) must be re-validated against
  the promoter's authoritative list before pushing — ask if unsure.
- The service worker (`sw.js`) serves HTML and data.js network-first (so day-of pushes
  reach phones immediately) and everything else cache-first (offline support at the
  venue). Keep that split.
- Sponsor tiers: King's Advantage is Title Sponsor (visually dominant); Mammoth
  Nutrition, Greg's Muffins, Viva Barista Cafe, and the Curbing UR Appetite food truck
  are vendors; Jack King's Gym hosts. Mammoth's logo is a low-res placeholder awaiting
  a better file.
