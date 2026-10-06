# API contract

GET /api/aidpath → {revision, answers, plan, programs, recommendations, previewRecommendations, question, totalQuestions, answeredQuestions}. Cache-Control: no-store. Sets/renews secure session cookie.

POST /api/aidpath, JSON, same-origin required:
- {action: 'select_need', need: 'housing'|'food'|'financial'|'technology'}
- {action: 'answer', field: currentQuestion.field, value: one of currentQuestion.options}
- {action: 'restart'} clears persisted answers and retains saved plans
- {action: 'back'} removes the last answer
- {action: 'save', program: catalogId}
- {action: 'check', program: savedId, step: validIndex, checked: boolean}
- {action: 'remove', program: savedId}
- {action: 'event', name: 'recommendation_clicked'|'source_opened'|'questionnaire_abandoned', program?: catalogId}
- {action: 'feedback', confidence: integer 1–5}
- {action: 'delete'} → {deleted: true}

Mutations may include the last returned revision. A stale revision returns 409 with current state; the first-party UI always supplies it. Saved plan entries include their immutable versioned program payload. Recommendations require exact-version human approval; unreviewed matches are returned separately as previewRecommendations.

Errors: 400 invalid action/answer, 403 origin mismatch, 413 oversized request, 503 storage/service unavailable with safe error message and request ID. All mutations scoped to cookie, never a supplied session key. Source URLs are curated server data, never user destinations.

POST /api/maintenance, Authorization: Bearer MAINTENANCE_TOKEN: checks curated sources and runs retention cleanup. Requires a server secret and is never called with a browser-visible token.

POST /api/policy-review, same bearer secret, {source_url, policy_version, human_reviewed:true}: only succeeds when live source hash equals every referenced bundled policy's fingerprint and version. Update versioned catalog after human interpretation review first. Never approve arbitrary fetched extraction output.

Embedded session continuity: responses expose a random server-issued X-AidPath-Session token to the same-origin client; requests can send it as Authorization: Bearer. It is kept only in tab memory, never URLs or persistent browser storage. Cookies use Secure, HttpOnly, SameSite=None and Partitioned. Same-origin POST checks still apply. A lost-session mutation returns 401 without replacement questionnaire state.

POST action reminder: {action:'reminder', program:savedProgramId, at:canonicalFutureISOString|null, revision}. The resource must already be saved. A future UTC timestamp saves or replaces its reminder; null removes it. The reminder appears as plan[].reminder.at. Invalid, past and impossible dates return 400. No migration is needed: reminders are optional fields in the existing plan JSON.
