# Lecture 1 (2.5h): Project Initiation and Problem Definition

## Session goal

Define a strong AI business use case, boundaries, and success criteria using the existing Tool Library baseline.

## Delivery timeline (150 minutes)

- 0-20 min: interactive lecture
- 20-50 min: baseline walkthrough (stage-0)
- 50-80 min: workshop (problem definition)
- 80-115 min: student progress presentations
- 115-140 min: feedback clinic
- 140-150 min: wrap-up and independent study tasks

## Instructor script (talk track)

### 0-20 min

Say:
- "AI is only valuable when it solves a real user problem with measurable improvement."
- "Today we decide whether this is an AI-worthy use case or not."

Prompt questions:
- What user decision is difficult without AI?
- What data do we already have in the product?
- What is the smallest useful AI capability?

### 20-50 min (live demo)

Use:
```bash
git checkout stage-0
```

Show current app flow:
- auth and tool listing in frontend
- tool model in backend
- no AI endpoint yet

Code references to show:
- frontend app shell: ../frontend/src/App.tsx
- mongo tool schema: ../backend/models/Tools.js
- mongo routes: ../backend/routes/tools.js

### 50-80 min (workshop task)

Students produce:
1. Problem statement (2-3 lines)
2. Users and context
3. AI/non-AI alternatives
4. MVP scope and non-goals
5. Success criteria (metrics)

Template:
- Problem:
- Current pain:
- Why AI:
- MVP feature:
- Success metrics:
- Risks/ethics:

### 80-115 min (presentations)

Each team presents for 4-5 minutes:
- business problem
- why AI is appropriate
- what they will not build

### 115-140 min (feedback clinic)

Feedback checklist:
- Is scope achievable in 4 lectures?
- Is there a clear measurable outcome?
- Any privacy or hallucination risk?

### 140-150 min (close)

Assign independent study:
- finalise use case
- draft architecture diagram
- prepare API contract proposal for lecture 2

## Code example (discussion only)

Use this example to show existing tool data shape:

```js
// backend/models/Tools.js
const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, enum: ['new', 'good', 'worn'], default: 'good' },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });
```

Teaching point:
- This schema is enough to start an explainable recommendation MVP.
