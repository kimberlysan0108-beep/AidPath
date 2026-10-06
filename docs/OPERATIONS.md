# Operations

## Local database

Build once to emit `dist/server/wrangler.json`. Apply generated SQL to local D1 using:

```
pnpm exec wrangler d1 migrations apply DB --local --config dist/server/wrangler.json --persist-to .wrangler/state
```

Use the supervised Sites preview in managed environments. In a conventional workstation use the retained framework dev workflow. HTTPS is required for the secure session cookie; local HTTP tooling may treat localhost as a secure context. Do not remove Secure in production.

## Publication

The Sites workflow compiles the Worker ESM and assets, validates the archive, applies immutable migrations, synchronizes source, and publishes an owner-private version. No Cloudflare account setup is required for Sites. Raw PostgreSQL TCP is not available in this host.

## Maintenance and policy approval

Set a strong MAINTENANCE_TOKEN as a server secret through hosting environment management. Keep the same secret in a scheduler secret store. `POST /api/maintenance` with that bearer token daily. `.github/workflows/source-check.yml` is provided if this source is mirrored into GitHub; configure AIDPATH_BASE_URL and AIDPATH_MAINTENANCE_TOKEN secrets. A workflow file in the current source host does not itself create a running GitHub schedule.

Changed sources become REVIEW_REQUIRED and are excluded. Humans compare the snapshot, consult the official policy, edit rules and advance policy_version; commit a fresh content fingerprint. Deploy the new catalog. Run maintenance, then POST the source URL and new version with human_reviewed true to /api/policy-review. Approval rejects hash/version mismatch. Never edit historical database policy rows.

The seed script is intended for initial catalog generation, not unattended policy promotion. It re-fetches sources but cannot certify interpretation. For updates, edit the catalog deliberately and advance versions. Keep previous source snapshots.

## Monitoring and errors

Errors emit structured JSON and a failures row with no request bodies. Inspect failure counts, stale source status, recommendation completion and source-open events. Alerts via an external monitoring provider are not configured. Failed source fetches suppress recommendations; the directory still links to official pages for manual verification. Restore a bad deployment through a prior Site version; applied schema migrations are not rolled back automatically.

## Retention

Daily maintenance deletes stale data. Application startup requests also run cleanup to ensure expired records do not accumulate indefinitely if scheduling is missed. GET excludes expired sessions. Session expiry does not require the cookie to remain in the browser.

## Before public release

Complete human policy review, activate maintenance, run browser/device QA, test hosted deletion, configure alert delivery/rate limits, and conduct actual discovery and evaluation. Do not present this prototype as university-authorized advice.
