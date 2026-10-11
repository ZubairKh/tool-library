# Lecture 3 (2.5h): Solution Implementation and Frontend Integration

## Session goal

Connect the backend recommendation endpoint to an understandable UI with robust user states.

## Delivery timeline (150 minutes)

- 0-20 min: UI/UX for AI features
- 20-60 min: stage-3 live implementation walkthrough
- 60-90 min: guided lab
- 90-120 min: progress presentations
- 120-145 min: code review and improvement discussion
- 145-150 min: close

## Instructor script

### 0-20 min

Say:
- "AI UX must show uncertainty and limitations, not false confidence."
- "Error and empty states are part of the core feature, not edge cases."

### 20-60 min (live demo)

Use:
```bash
git checkout stage-3
```

Demo flow:
1. enter natural-language task
2. call recommendation endpoint
3. show results with reasons and limitations
4. highlight unavailable tools

Code references to show:
- UI component: ../frontend/src/components/AIToolFinder.tsx
- API call: ../frontend/src/api/recommendation.ts
- app integration: ../frontend/src/App.tsx
- styling: ../frontend/src/App.css

### 60-90 min (guided lab)

Students implement:
1. input validation (short task block)
2. loading state
3. empty recommendation state
4. backend error state
5. unavailability badge

### 90-120 min (presentations)

Each team shows:
- one user journey that works
- one failure scenario and how UI handles it

### 120-145 min (review)

Review prompts:
- Is the feature understandable to non-technical users?
- Does UI clearly distinguish unavailable tools?
- Does text overclaim confidence?

### 145-150 min

Assign:
- prepare fixed evaluation cases
- define expected tools for each task

## Code example

```ts
// frontend/src/api/recommendation.ts
export async function fetchRecommendations(task: string) {
  const res = await fetch('http://localhost:4000/api/tools/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  });
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}
```

Teaching point:
- Keep frontend provider-agnostic; all AI secrets remain backend-only.
