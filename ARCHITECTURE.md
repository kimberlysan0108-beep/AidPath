# Architecture and decisions

React client → same-origin typed JSON API → D1 prepared statements → deterministic policy engine → ranked explanations. Production code is under app/ and lib/ rather than separate frontend/backend folders to keep deployment coherent.

## Data ownership

An unguessable 256-bit HttpOnly, Secure, SameSite=Strict cookie identifies a device session. Users are not asked to create accounts. Every session read/write uses this token; no request can provide another session ID in a body. This is possession-based access, not identity verification. Deployments remain owner-private until reviewed.

Sessions own coarse answers and saved checklists. Policy versions are immutable JSON records keyed by program + version. Source state is mutable and separate: changes can suppress all affected recommendations without altering historical rules. Events are minimized and never contain answer values or free text. Actual policy source snapshots are version controlled, not generated at request time.

## Policy evaluation

Ten operators return matched, failed or unknown. Missing/invalid data never silently passes. A required failure blocks a match; unknown optional and required conditions remain visible. No status is ever called confirmed eligible. Routing predicates are labeled separately from published conditions. Questions use an explicit graph: it is auditable and avoids asking irrelevant housing details in the food flow, but new policies require deliberate graph maintenance. Staff-only conditions are deliberately left unknown.

## Ranking

Weights: category 30, evidence 25, urgency 15, priority 10, declared food preference 20. Evidence is the fraction of all rules matched; missing rules reduce the score. Score components are returned by the server and shown in explanations. Scores are routing heuristics, not probabilities. Stable ID tie-break gives deterministic results. Future tuning needs outcome evidence, not arbitrary optimization.

## Freshness and review

Source snapshot normalization strips script/style blocks, comments, markup, and repeated whitespace. It preserves visible content, including some navigation, favoring false-positive review alerts over silently missing changes. SHA-256 compares complete normalized text. A changed page becomes REVIEW_REQUIRED and remains blocked until an authenticated human review approves a newly bundled fingerprint/version. Fetch failure becomes UNAVAILABLE. Redirects during runtime checks are rejected; source relocation needs a manual review. A source older than 30 days is excluded even if automated maintenance is not configured.

## Persistence tradeoffs

D1 supports the available deployment; PostgreSQL/FastAPI would require a second provisioned service and new operational setup. Raw prepared statements prevent SQL injection. Generated Drizzle migrations own all DDL. Multi-statement operations use D1 batches. Anonymous sessions simplify access but cannot be recovered on another browser; this is documented in the UI.

## Remaining engineering risks

Concurrent writes to the same session are last-write-wins; the UI serializes mutations, but multiple tabs can race. A public rollout should add optimistic concurrency and edge rate limits. No broad free-text or LLM inference is used. Page fingerprints do not prove accurate policy interpretation. Availability and office deadlines need staff confirmation. Human review, browser QA in a supported environment, production benchmark and scheduler activation remain launch gates.
