# Internship Project Brief — AidPath
## Product Engineering Intern Simulation

**Intern:** Kimberly Sánchez  
**Role:** Software Engineering Intern — Product Engineering  
**Project Duration:** 10 weeks  
**Project:** AidPath — Policy-Aware Student Support Navigator  
**Primary Stack:** TypeScript, React, Next.js, Python, FastAPI, PostgreSQL  
**Working Style:** Product + Engineering + User Research  
**Expected Ownership:** End-to-end

---

# 1. Welcome to the Team

You are joining a small product engineering team responsible for helping students navigate complex institutional services.

The organization already has resource pages, forms, program descriptions, and support offices. The problem is not that resources do not exist.

The problem is that users often do not know:

- which resource applies to them,
- which information is current,
- which program should be contacted first,
- what documentation is needed,
- how urgent their situation is relative to available programs,
- or how to turn a list of links into an actionable next step.

Your internship project is to investigate this problem and build a working product that measurably reduces the effort required for a student to identify an appropriate resource.

You are expected to operate like a product engineer.

That means your job is **not simply to implement a predetermined specification**.

You will be responsible for:

1. understanding the user problem,
2. validating assumptions,
3. proposing the product experience,
4. designing the architecture,
5. implementing the system,
6. instrumenting it,
7. testing it with users,
8. analyzing failures,
9. iterating,
10. and presenting a final recommendation.

---

# 2. Project Mission

Build **AidPath**, a trustworthy student-support navigation system that converts fragmented institutional policies and resources into explainable, personalized action plans.

A successful project should answer:

> Can we help students identify the correct support resource faster and with greater confidence than normal web navigation, without presenting unofficial guidance as an authoritative eligibility decision?

---

# 3. Example User Problem

A student says:

> "My hours at work were cut. I am $500 short on rent next month and I don't know what Berkeley resources I should use."

Today, the student may:

1. search Google,
2. open several university pages,
3. encounter unfamiliar terminology,
4. compare overlapping programs,
5. misunderstand an eligibility condition,
6. give up,
7. or contact the wrong office.

AidPath should guide the student through a structured process.

Possible output:

```text
Recommended first step
────────────────────────────────

Emergency Housing / Basic Needs Support

Why this appears relevant:
✓ Currently enrolled
✓ Housing-related financial difficulty
✓ Time-sensitive situation
? Final program eligibility requires staff review

Next steps:
1. Review official requirements
2. Prepare listed documentation
3. Submit official assistance form

Official source:
[verified university source]

Last policy check:
[date]
```

---

# 4. Important Product Constraint

AidPath is **not an eligibility authority**.

The system may say:

> "This program appears relevant based on the published requirements."

It must not say:

> "You qualify."

unless the underlying institution explicitly exposes a deterministic eligibility API that provides that answer.

Trustworthiness is a core product requirement.

---

# 5. Your Responsibilities

You own the project across six areas.

## Product Discovery

Determine what students actually find difficult.

You should conduct user interviews before locking the implementation.

## Product Design

Design the end-to-end flow from problem description to actionable recommendation.

## Backend Engineering

Build the policy, questionnaire, ranking, provenance, and user-state systems.

## Frontend Engineering

Build a usable and responsive student experience.

## Data / Experimentation

Instrument user behavior and quantitatively evaluate whether the product helps.

## Reliability

Prevent stale, unsupported, or unexplained recommendations.

---


# 6. Execution Model

This project is intentionally **not** organized as a week-by-week build plan and should not be treated as an MVP checklist.

Operate like an intern on an ambiguous product problem:

- identify the highest-risk assumptions,
- choose the next most valuable product or engineering task,
- ship meaningful increments,
- validate decisions with users and data,
- revise the scope when evidence changes,
- and prioritize correctness and impact over feature count.

The sequencing is yours to own. The project should evolve based on what you learn rather than follow a fixed calendar.

## Manager Check-In Questions

Be prepared to answer:

1. What did you learn since the last check-in?
2. What changed your mind?
3. What is the highest-risk assumption now?
4. What did you ship or validate?
5. What failed?
6. What are you prioritizing next, and why?
7. What are you intentionally not building?
8. What metric or user signal influenced your decision?
9. Where did Codex/Claude Code help?
10. Where did you reject its recommendation?

# 7. Project Goals

By the end of the internship, the team should have:

### Goal 1 — Working Product

A deployed application that a real student can use.

### Goal 2 — Real Policy Representation

At least 10–20 real programs represented in a structured, versioned format.

### Goal 3 — Explainability

Every recommendation should be traceable to:

- user inputs,
- explicit policy rules,
- a policy version,
- and an official source.

### Goal 4 — Evaluation

Conduct a usability study comparing AidPath with normal resource discovery.

### Goal 5 — Engineering Quality

The system should include:

- automated tests,
- structured logging,
- error handling,
- source versioning,
- deployment,
- analytics,
- and documentation.

---

# 8. Non-Goals

Do not spend the internship building:

- a generic university chatbot,
- a social network,
- a giant student dashboard,
- an unofficial financial advisor,
- an AI system that makes final eligibility decisions,
- a scraper that blindly republishes content,
- or a visually elaborate interface with no evaluation.

The core product question is:

> Does AidPath make navigating support systems meaningfully easier?

---

# 9. Product Discovery Assignment

## Discovery Requirement

Interview at least **8–10 potential users** before finalizing the product specification.

Suggested participants:

- first-year students,
- first-generation students,
- transfer students,
- students who have previously used university resources,
- peer advisors.

Ask questions such as:

- Tell me about the last time you needed help from the university.
- How did you figure out where to go?
- What was confusing?
- What information did you wish you had?
- What caused you to trust or distrust a resource?
- Have you ever abandoned the process?
- Would you rather answer questions or browse programs?
- What would make a recommendation feel trustworthy?

Do not pitch AidPath immediately.

Understand the workflow first.

---

# 10. Product Requirement Document

After the initial discovery interviews, write a short internal PRD containing:

## Problem

What specific user problem are we solving?

## User

Who experiences it most strongly?

## Current Workflow

How does the user solve the problem today?

## Pain Points

Where does the current workflow fail?

## Proposed Experience

What does AidPath change?

## Success Metric

What observable result tells us the product helped?

## Non-Goals

What are we explicitly not solving?

---

# 11. Core Product Flow

The initial version should support:

```text
LANDING
   ↓
START SESSION
   ↓
IDENTIFY NEED
   ↓
ADAPTIVE QUESTIONS
   ↓
POLICY EVALUATION
   ↓
RANK RESOURCES
   ↓
EXPLAIN RECOMMENDATION
   ↓
ACTION PLAN
   ↓
OFFICIAL SOURCE
   ↓
USER FEEDBACK
```

---

# 12. Technical Architecture

Recommended starting architecture:

```text
┌──────────────────────────────┐
│ Next.js / React Frontend     │
└───────────────┬──────────────┘
                │
                ↓
┌──────────────────────────────┐
│ FastAPI Backend              │
└───────────────┬──────────────┘
                │
     ┌──────────┼───────────┐
     ↓          ↓           ↓
Questionnaire  Ranking    Policy
Engine         Service    Engine
     │          │           │
     └──────────┼───────────┘
                ↓
┌──────────────────────────────┐
│ PostgreSQL                   │
└───────────────┬──────────────┘
                ↓
┌──────────────────────────────┐
│ Policy Version / Provenance  │
└──────────────────────────────┘
```

You may change this architecture if you can justify the decision.

---

# 13. Core Backend Objects

Suggested entities:

```text
User
StudentProfile
Program
PolicyVersion
PolicyRule
Question
QuestionnaireSession
Answer
Recommendation
RecommendationReason
UserEvent
Source
```

Do not blindly implement these entities.

First determine:

- which are actually necessary,
- which relationships belong in the database,
- which data should be immutable,
- which data needs versioning.

Document important decisions.

---

# 14. Policy Engine

Build a deterministic rules engine.

Example policy:

```yaml
program: emergency_support

rules:
  - field: enrollment_status
    operator: equals
    value: enrolled
    required: true

  - field: need_category
    operator: in
    value:
      - housing
      - food
      - emergency_expense
    required: true
```

The engine should return more than a boolean.

Example:

```json
{
  "status": "potential_match",
  "matched": [
    "enrollment_status",
    "need_category"
  ],
  "failed": [],
  "unknown": [
    "prior_award_date"
  ]
}
```

This information will power explanations.

---

# 15. Required Rule Operators

At minimum support:

```text
equals
not_equals
in
not_in
less_than
greater_than
exists
before
after
older_than_days
```

Design the system so new operators can be added without rewriting the entire evaluator.

---

# 16. Adaptive Questionnaire

A strong implementation should avoid asking unnecessary questions.

Example:

```text
Need = housing
    ↓
Ask housing urgency

Need = food
    ↓
Do not ask housing urgency
```

Possible implementation approaches:

- explicit decision graph,
- required-field planning,
- policy-driven question generation.

You must choose one and explain the tradeoff.

---

# 17. Ranking

Multiple programs may partially match.

Design a ranking function.

Potential factors:

```text
eligibility evidence
urgency
category relevance
information completeness
program priority
user preference
```

The first version may be heuristic.

However, the weights should be:

- configurable,
- explainable,
- testable.

You should be able to answer:

> Why did Program A appear above Program B?

---

# 18. Policy Provenance

Every recommendation must link to its source.

Required metadata:

```text
source_url
retrieved_at
effective_date if known
source_hash
policy_version
review_status
```

Never display a recommendation with an unknown policy version.

---

# 19. Policy Change Detection

Implement a background job that detects source changes.

```text
fetch source
    ↓
normalize
    ↓
hash
    ↓
compare
```

If changed:

```text
policy.status = REVIEW_REQUIRED
```

The system should not silently continue treating changed content as verified.

---

# 20. Optional AI Component

AI may assist in converting policy documents into candidate structured rules.

Pipeline:

```text
source
   ↓
LLM extraction
   ↓
candidate rules
   ↓
human review
   ↓
approved version
```

Important:

**LLM output may not automatically become production policy.**

This is intentionally designed to test engineering judgment.

---

# 21. Analytics

Instrument the product from the first usable version.

Required events:

```text
session_started
need_selected
question_answered
questionnaire_abandoned
recommendation_shown
recommendation_clicked
source_opened
action_started
feedback_submitted
```

Avoid collecting unnecessary sensitive information.

---

# 22. Primary Success Metric

Define one primary metric before evaluating the first production-quality user flow.

Recommended:

> Median time required to identify an appropriate official resource.

Secondary metrics:

```text
correct resource rate
questionnaire completion
source-open rate
user confidence
recommendation trust
wrong-resource rate
```

---

# 23. Evaluation Study

Near the end of the internship, recruit **20–50 participants**.

Give participants predefined scenarios.

Example:

> You are an enrolled student who unexpectedly lost income and needs urgent housing assistance. Identify the most appropriate official resource and next step.

Randomly assign:

### Baseline

Use normal university web resources.

### AidPath

Use AidPath.

Measure:

```text
time to correct resource
correct selection
wrong pages opened
confidence
completion
```

Write an evaluation report.

Do not manufacture results.

---

# 24. Engineering Requirements

The project is not complete unless it includes:

- database migrations,
- typed APIs,
- unit tests,
- integration tests,
- end-to-end tests,
- CI,
- structured logging,
- production error monitoring,
- deployment,
- analytics,
- README,
- architecture documentation.

---

# 25. Testing Expectations

## Unit

Test policy behavior.

Examples:

```text
required rule fails
unknown optional rule
temporal predicate boundary
invalid field
```

## Property-Based Tests

Use Hypothesis.

Invariant:

```text
A program with a failed required rule
may not be marked as confirmed eligible.
```

Invariant:

```text
Every recommendation must have a source.
```

## Integration

Test:

```text
API → database → policy engine
```

## End-to-End

Use Playwright:

```text
start session
→ answer questions
→ receive recommendation
→ inspect explanation
→ open source
```

---

# 26. Performance Targets

These are engineering goals, not required accomplishments.

Aim for:

```text
policy evaluation p95 < 100 ms
recommendation API p95 < 250 ms
zero unhandled server errors in demo flow
```

Benchmark before optimizing.

Do not optimize prematurely.

---

# 27. Privacy Review

Before launch, write a short privacy review answering:

- What user data are we collecting?
- Why do we need each field?
- Which fields could be sensitive?
- How long is data retained?
- Can the product work without account creation?
- What appears in logs?
- Could analytics accidentally contain private information?

Default toward collecting less.

---

# 28. Codex / Claude Code Expectations

You are encouraged to use coding agents heavily.

You are still responsible for:

- architecture,
- correctness,
- understanding generated code,
- security,
- tests,
- user impact,
- and final decisions.

Example workflow:

```text
write issue
   ↓
ask agent to inspect codebase
   ↓
review proposed plan
   ↓
agent implements
   ↓
review diff
   ↓
run tests
   ↓
inspect behavior
   ↓
modify/reject as needed
```

Maintain an optional engineering log:

```text
AI-assisted decision
What the agent proposed
What I accepted
What I rejected
Why
```

This can become excellent interview material.

---

# 29. Stretch Projects

Only attempt these after the core product works.

### Stretch A — Policy Extraction Review Console

Interface for approving/rejecting LLM-extracted policy rules.

### Stretch B — Multi-University Schema

Test whether the policy model generalizes to another university.

### Stretch C — Learned Ranking

Train a ranking model from real interaction data.

### Stretch D — Reminder Engine

Deadline and follow-up notifications.

### Stretch E — Advisor Mode

Give trained advisors a professional interface for navigating cases.

---

# 30. Final Internship Presentation

Your final presentation should answer:

## 1. What problem did you discover?

Use actual user evidence.

## 2. What did you build?

Demo the product.

## 3. Why this architecture?

Discuss important tradeoffs.

## 4. What went wrong?

Show failures.

## 5. Did it work?

Present evaluation.

## 6. What did you learn from users?

Explain product changes.

## 7. What would you build next?

Prioritize realistically.

---

# 31. Final Engineering Deliverables

Repository should contain:

```text
README.md
ARCHITECTURE.md
PRD.md
PRIVACY.md
EVALUATION.md
docs/
frontend/
backend/
tests/
scripts/
```

README should include:

- problem,
- demo,
- setup,
- architecture,
- metrics,
- limitations.

---

# 32. How You Will Be Evaluated

### Product Judgment — 25%

Did you identify and solve the right problem?

### Engineering Quality — 25%

Is the system reliable, understandable, and tested?

### Execution — 20%

Did you consistently ship?

### User Impact — 15%

Did the product measurably help users?

### Technical Communication — 10%

Can you explain your decisions?

### Ownership — 5%

Did you act like this was your product rather than an assignment?

---

# 33. What Excellent Performance Looks Like

Excellent performance is not:

> "I implemented everything in the brief."

Excellent performance looks like:

> "The original assumption was wrong. Interviews showed that students were not primarily confused about eligibility; they were confused about which action to take first. I changed the product around prioritized next steps, shipped the new experience, and the usability study showed a measurable improvement."

That is product engineering.

---

# 34. Resume Output

At the end of the project, write resume bullets only from measured results.

Template:

**AidPath — Product Engineering**

- Built a policy-aware student resource platform translating **[N]** versioned programs into adaptive, source-backed workflows using Next.js, FastAPI, and PostgreSQL.
- Reduced median resource-discovery time by **[X%]** across **[N]** usability participants while maintaining **[Y%]** correct-resource selection.
- Instrumented **[N]** product events and shipped **[N]** user-driven iterations / experiments based on behavioral and qualitative feedback.

Never invent metrics.
