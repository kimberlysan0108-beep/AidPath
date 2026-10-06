# Privacy review

Collected: coarse need category, enrollment yes/no/unknown, urgency, relevant circumstance flags, checklist IDs/completion, session timestamps, anonymous interaction events, confidence 1–5.
Purpose: choose relevant questions, explain recommendations, resume action plans, evaluate navigation. Some flags imply hardship or disability-related need and are sensitive even without a name. No diagnosis, immigration status, income amount, address, identifier, documents, free text, email or precise location is collected.
Storage: persistent D1, random browser cookie; owner-private Site access also uses hosting authentication outside the app's anonymous session. Do not promise anonymity from the hosting provider.
Retention: session access expires after 30 days without updates; maintenance deletes expired sessions, events and error records. Events older than 30 days are purged. Activate daily maintenance before public launch; without a running job physical deletion occurs on subsequent application cleanup, not exactly at day 30.
Deletion: Delete my session data removes the session and its associated event rows immediately and expires its cookie. A new empty session may then be created. Device loss/cleared cookies prevents association for immediate deletion; retention remains the fallback.
Logs: level, error category, route/request ID, source-check count. No answer payloads, session cookies, tokens, URLs containing user data, or free-text answers in app logs. Platform access logs can have their own retention policy.
Analytics: event name, program ID if applicable, time, confidence scalar. No raw answer values. Identifiers remain pseudonymous, not inherently anonymous.
Launch actions: approve retention and access policy, configure scheduler, test deletion in production, run privacy review with institutional stakeholders. No marketing trackers or external error-monitoring SDK included.

For embedded browsers that block cookies, a server-issued session bearer token is kept in tab memory. Closing or reloading that tab can lose access if no cookie is retained. The token is not placed in URLs or local storage. Session cookies are partitioned for embedded browsing.

Language choice is stored locally under aidpath-language. A chosen reminder timestamp is saved with its action-plan entry under the same session retention policy. Calendar export includes the program name and official source URL, but no questionnaire answers. Importing it places that event under the user's calendar provider and notification settings. Removing the AidPath reminder or session does not delete an imported calendar event.

Appearance preference is stored locally under aidpath-theme. It contains only light or dark and is independent of questionnaire answers.
