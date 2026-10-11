# Lecture 2 (2.5h): Solution Design and AI Integration

## Session goal

Design a safe, testable architecture for AI recommendations with mock mode and provider adapter.

## Delivery timeline (150 minutes)

- 0-25 min: architecture lecture
- 25-60 min: stage-1 and stage-2 walkthrough
- 60-90 min: design studio
- 90-120 min: student progress presentations
- 120-145 min: feedback and risk review
- 145-150 min: close

## Instructor script

### 0-25 min

Say:
- "Do not couple your app directly to one AI vendor."
- "Always validate model output before returning it to the client."
- "Mock mode is a teaching and reliability feature, not a hack."

Core concepts:
- Provider adapter pattern
- Structured output contract
- Timeout/error mapping
- Catalogue-grounded validation

### 25-60 min (live demo)

Use:
```bash
git checkout stage-1
git checkout stage-2
```

Show progression:
1. Stage 1: recommendation endpoint + mock mode
2. Stage 2: real provider integration + parser/validation

Code references to show:
- endpoint: ../backend/routes/recommendations.js
- adapter: ../backend/services/recommendationProvider.js
- mock logic: ../backend/services/mockRecommender.js
- real provider: ../backend/services/openAIProvider.js
- validation: ../backend/services/recommendationValidation.js

### 60-90 min (design studio)

Student outputs:
1. API request/response schema
2. Allowed provider input fields
3. Error handling matrix
4. Validation rules for model output

### 90-120 min (presentations)

Ask each team:
- What happens if provider is down?
- How do you ensure no invented tool IDs are returned?
- What fields are never sent to provider?

### 120-145 min (feedback)

Use risk checklist:
- hallucination risk
- timeout and retry strategy
- output schema enforcement
- security of API key

### 145-150 min

Assign:
- implement backend AI path
- add tests for invalid input, timeout, malformed output

## Code example

```js
// output validation concept
const toolById = new Map(tools.map((t) => [t.id, t]));
const recommendations = output.recommendations
  .filter((item) => item && typeof item.toolId === 'string')
  .map((item) => toolById.get(item.toolId) ? item : null)
  .filter(Boolean);
```

Teaching point:
- Model output is untrusted until validated against current catalogue.
