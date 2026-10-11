# Instructor Quick Start (B198c16)

This one-pager helps you run each lecture smoothly in hyflex mode.

## 1) Pre-Lecture Setup Checklist (30-45 min before class)

### Repo and stage checkpoints

- Pull latest changes:

```bash
git checkout main
git pull
```

- Verify stage tags exist:

```bash
git tag --list "stage-*"
```

Expected:
- stage-0
- stage-1
- stage-2
- stage-3
- stage-4

### Runtime checks

- Backend test smoke check:

```bash
cd backend
npm test
```

- Frontend build smoke check:

```bash
cd ../frontend
npm run build
```

- Evaluation smoke check (for Lecture 4):

```bash
cd ../backend
npm run eval:recommendations
```

### Environment checks

- Confirm `backend/.env` exists.
- If using live provider mode, verify:
- `AI_MOCK_MODE=false`
- `AI_PROVIDER=openai`
- `AI_API_KEY` is set correctly
- For reliable classroom demo, prefer:
- `AI_MOCK_MODE=true`

### Delivery setup

- Open only the lecture file for the day in `teaching/`.
- Open terminal tabs for:
1. backend
2. frontend
3. git checkout commands
- Keep one browser tab logged in for faster live demo.

## 2) In-Class API Failure Fallback Plan

Use this plan if AI provider fails, times out, or network is unstable.

### A. Immediate recovery path

1. State clearly to students:
- "The AI provider call failed, which is a realistic production scenario."

2. Switch to mock mode:

```bash
cd backend
# edit .env
AI_MOCK_MODE=true
npm run dev
```

3. Re-run same prompt in UI and compare behavior.

Teaching message:
- Resilience and fallback behavior are part of real engineering quality.

### B. If backend server is unstable

1. Restart backend and frontend.
2. Use known-good stage tag for that lecture.

```bash
git checkout stage-3
```

3. Continue with prepared scripted prompts from lecture files.

### C. If frontend cannot reach backend

- Check API base URL in:
- `frontend/src/api/auth.ts`
- `frontend/src/api/tool.ts`
- `frontend/src/api/recommendation.ts`

Expected default:
- `http://localhost:4000/api`

## 3) Progress Presentation Grading Rubric (Template)

Use a simple 20-point rubric per team per lecture.

| Criterion | Description | Points |
|---|---|---:|
| Problem Framing | Clear business problem and user context | 0-4 |
| AI Suitability | Justifies why AI is needed vs non-AI option | 0-4 |
| Technical Quality | Sound architecture/code decisions and constraints | 0-4 |
| Evidence and Evaluation | Tests/metrics/logs used to support claims | 0-4 |
| Communication and Reflection | Clear presentation, limitations, next steps | 0-4 |

Total: 20

### Performance bands

- 17-20: Excellent
- 13-16: Good
- 9-12: Satisfactory
- 0-8: Needs improvement

## 4) Rapid Feedback Prompts

After each presentation, ask:

1. "What assumption in your design is most risky?"
2. "How do you detect if recommendations are poor quality?"
3. "What does failure look like for a user, and how do you recover?"
4. "What data is excluded from provider calls for privacy/security?"
5. "What is your next measurable milestone before the next lecture?"

## 5) End-of-Day Tutor Notes Template

- What worked well:
- Common student blockers:
- Concepts needing reinforcement next class:
- Teams needing targeted support:
- Action items for next lecture:
