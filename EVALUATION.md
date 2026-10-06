# Evaluation — implementation checks, not a user study

## Completed on 2026-10-01

- TypeScript type check: passed.
- Node unit/integration suite: 9 tests passed. Covers ten operators, strict temporal boundary, malformed/missing values, required failures, unknown explanations, provenance suppression, food preference, adaptive routing, and API → SQLite → rules → persisted plan → deletion with session isolation.
- Hypothesis: 20 generated batches (1–40 enrollment values each) passed against the actual TypeScript engine. Checks required-rule failure exclusion and source/version invariants. This is bounded evidence, not exhaustive correctness proof.
- Local engine benchmark: 2,000 evaluations over 15 profiles; p50 0.0087 ms and p95 0.0142 ms on this container. This is only engine computation, not hosted end-to-end or database latency. Do not put it on a resume as an API benchmark.
- Playwright test authored; not executed here because the supported browser-control skill was unavailable. WebMCP browser registration also unverified. No visual QA claim is made.

## Not completed

No discovery interviews, usability participants, baseline comparison, production latency measurement or measured impact. No effectiveness conclusion can be drawn yet. No independent human policy certification. The private deployment is a software demonstration for subsequent review.

## Pre-registered study design

Recruit 20–50 consenting adults. Randomize 1:1 to ordinary official website navigation or AidPath, and counterbalance equivalent scenario sets. Avoid a crossover where learning the same answer makes the second tool appear faster.

Primary metric: median seconds to a correct official resource and next step, judged using a frozen rubric established with advisors before recruitment. Start timing at scenario presentation. Stop at submitted selection. Record failures/timeouts separately; use a fixed 10-minute cap and report completion rate so excluding failures cannot create misleading speed improvements.

Secondary: correct selection, wrong-resource rate, pages opened, completion, confidence (1–5), trust (1–5). The in-app source_opened event alone does not establish correctness and its timestamp is not the primary outcome.

Scenarios:
1. Enrolled student unexpectedly short on rent, resources exhausted, no recent fund award: emergency-fund rent pathway; compare staff confirmation and response time.
2. Enrolled student needs groceries soon: food pantry; explain official access steps.
3. Student needs longer-term food help: CalFresh application assistance, not a claim of benefit eligibility.
4. Planned housing contract gap: housing search resources; do not recommend emergency housing as an approved solution.

Collect participant pseudonym, assignment, scenario, elapsed seconds, correct flag, pages opened, confidence/trust, completion, and optional deidentified feedback. Store study data separately under explicit research consent; do not collect sensitive real-life narratives for this task.

Analysis: report group counts, completion rates, medians and interquartile ranges, plus bootstrap confidence intervals when sample size allows. Inspect wrong-resource cases before emphasizing speed. State small-sample and convenience-sampling limits. Freeze analysis decisions before looking at outcomes.

## Report template

Participants: NOT COLLECTED. Baseline median: NOT MEASURED. AidPath median: NOT MEASURED. Correct-resource rates: NOT MEASURED. Design changes from interviews: NOT YET AVAILABLE. Recommendations: pending study.

## Follow-up fix and design refresh — 2026-10-01

The questionnaire now uses full-width answer buttons that save and advance in one click; the separate Continue step was removed. A request lock prevents duplicate answer submissions. Event-only requests now return without rewriting the session, avoiding stale analytics writes that could overwrite newer answers or plans. New-question headings receive focus for keyboard/screen-reader continuity. The logo, category accents, cards, typography, and question states were refreshed.

All 10 Node checks passed, including a new JSDOM + React DOM interaction test against the real API handlers and SQLite adapter. It clicks Yes, No, and Not sure through the food flow, checks the next question appears, exercises Back, and reaches results. This is simulated-DOM interaction testing, not full browser visual QA. Full-browser and WebMCP verification remain unavailable in this environment.

## Redesign and brief audit — 2026-10-06

TypeScript and all 12 Node tests passed, covering draft-policy exclusion, freshness and malformed dates, persisted restart, stale-revision conflicts, versioned plan content, and the Yes/No/Not sure food flow. Full-browser visual testing is still unavailable. A repeat Hypothesis run could not start because this runtime lacks pytest; the earlier recorded run remains historical evidence, not a new result. See docs/BRIEF_AUDIT.md for outstanding brief requirements.

## Questionnaire continuity — 2026-10-06 follow-up

Production logs showed a 409 on /api/aidpath. Losing the cookie could recreate an empty session and return it as a revision conflict, sending the UI to the category screen. Session cookies now support embedded partitioning, and the client keeps a server-issued random bearer token in memory as a cookie-independent fallback. Lost-session answer requests return an error without replacing questionnaire state. No token enters URLs or persistent client storage. Browser-reload recovery still depends on cookies.

Expanded simulated-DOM coverage completes rent, unsafe housing, deposits, housing search, tenant rights, expenses, technology and food-emergency pathways, including blocked-cookie transport. Full browser and hosted interaction verification remain unavailable.

## Authorized bilingual interface and reminders — 2026-10-06

TypeScript checks and all 15 Node tests passed. New coverage checks Spanish translations for every questionnaire branch and every source-derived summary, rule label, document label, caveat and checklist step; exercises language switching mid-questionnaire and a complete Spanish rent flow; verifies saving/removing reminders through the real API and SQLite adapter; and checks date validation, UTC calendar times, alarm presence, escaping and UTF-8 line limits. Official program names remain in English. These checks do not establish professional translation review, browser visual QA, or notification delivery by a user's calendar app.

The visual update uses a custom ribbon monogram and an SVG support-map illustration, with responsive navigation and date inputs. No other optional feature was added.

## Spanish revision, appearance control and logo — 2026-10-06

Revised Spanish phrasing and replaced concatenated sentence fragments with parameterized full-sentence messages for questionnaire counts, result context, resource counts, plan progress, saved-version dates and score details. Resource display names now have Spanish equivalents; the detail dialog retains the original program name explicitly. This is a code/editorial review, not independent professional translation certification.

Added an accessible light/dark selector. It stores the appearance preference separately from session data and defaults to the device preference when none is saved. Dark styles cover forms, cards, dialogs, reminders and print output. TypeScript and all 15 automated tests pass; the interaction test also verifies theme changes, preference storage, language switching and plan preservation. Full browser visual verification remains unavailable.
