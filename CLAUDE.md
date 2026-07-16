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

**Overall winners** (contested by the class winners of a division after judging; not
classes in the running order): add to the `OVERALLS` array in `data.js` as
`{ title: "<Division> Overall", n: <number> }`, e.g.
`{ title: "Men's Physique Open Overall", n: 27 }`. The "<Division> Overall" title
format matters — the app matches the division name to detect pro cards (below).
Overalls render as a ⭐ line on the competitor's lookup card.

**OCB pro cards — never entered by hand, the app derives them (👑):**
- Single-class PQ division (e.g. "Men's Physique 40+ PQ"): the class winner from
  RESULTS goes pro automatically.
- Multi-class PQ division (A/B/C splits, e.g. "Men's Physique Open A/B/C PQ"): class
  winners do NOT go pro — the pro card attaches to the division's Overall entry
  ("Men's Physique Open Overall"). Non-PQ overalls (Debut/Novice) get ⭐ only.
Pro card winners appear in a gold "👑 OCB Pro Card Winners" card at the top of the
Lineup page and as a 👑 line on the competitor's card.
Emoji lanes: 🏆 class placements · ⭐ overalls · 👑 pro cards.

**Consistency check before pushing an overall:** the overall winner must already be
recorded as 1st in one of that division's classes in RESULTS. If they aren't, either
the number is mis-keyed or the class results haven't been sent yet — ask the promoter
to confirm before pushing; never auto-fill the missing class result.

The 39 class names, in running order (use verbatim as RESULTS keys). PQ suffixes were
removed 2026-07-15 from classes without enough athletes to qualify — this list is current:
Men's Bodybuilding Debut · Men's Bodybuilding Novice · Men's Bodybuilding 60+ ·
Men's Bodybuilding Open · Men's Physique Debut A · Men's Physique Debut B ·
Men's Physique Novice A · Men's Physique Novice B · Men's Physique Novice C ·
Men's Physique 40+ PQ · Men's Physique 50+ · Men's Physique Open A PQ ·
Men's Physique Open B PQ · Men's Physique Open C PQ · Men's Classic Physique Debut A ·
Men's Classic Physique Debut B · Men's Classic Physique Novice A ·
Men's Classic Physique Novice B · Men's Classic Physique 40+ ·
Men's Classic Physique Open A PQ · Men's Classic Physique Open B PQ ·
Women's Physique Debut · Women's Physique Novice · Women's Physique Open ·
Women's Figure Debut · Women's Figure Novice · Women's Figure 35+ ·
Women's Figure 50+ · Women's Figure 60+ · Women's Figure Open PQ ·
Women's Bikini Debut · Women's Bikini Novice A · Women's Bikini Novice B ·
Women's Bikini 35+ · Women's Bikini Open PQ · Women's Wellness Debut ·
Women's Wellness Novice · Women's Wellness 35+ · Women's Wellness Open
(Women's masters classes are 35+; men's are 40+ — the age split differs by gender.)

## Refreshing the site for a new year's show

The site is rebuilt annually from the same bones. The Netlify site/URL stays the same
(jackkingsclassic.netlify.app), which means printed QR codes stay valid year to year —
do not create a new Netlify project or rename it without explicit direction.

1. **Gather from the promoter (Stacey):** show date, venue + address, session times,
   the competitor CSV (number, name, category, divisions — her list is authoritative,
   including any intentionally skipped numbers), the class lineup in running order with
   PQ markings, and sponsor/vendor changes with logo files.
2. **Ask which PQ classes actually award pro cards** — divisions without enough
   athletes lose their PQ suffix (this happened in 2026). Curate before launch.
3. **Update `data.js`:** COMPETITORS, CLASSES, EVENT, SPONSORS. Reset `RESULTS = {}`
   and `OVERALLS = []`.
4. **Validate, don't eyeball:** write a small script that parses the promoter's
   provided list and diffs it against data.js (count, every number→name→category,
   every class's numbers, no invented entries). All checks must pass before deploy.
5. **Update year strings** in index.html (title, h1, meta description), CLAUDE.md
   (class-name list in this file), and `poster/poster.html`; re-render the poster:
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new
   --no-pdf-header-footer --print-to-pdf=poster/jkc-<year>-poster.pdf
   "file://<repo>/poster/poster.html"`
6. **New logos** go in `assets/logos/`, web-optimized copies in `assets/logos/web/`
   (resize ≤600px with sips), referenced from data.js, added to sw.js PRECACHE.
7. **Bump `VERSION` in sw.js**, push, then verify live: search a number, open every
   division accordion, check the sponsors/about pages, confirm the service worker
   installs, and re-scan a printed QR code with a real phone.

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
