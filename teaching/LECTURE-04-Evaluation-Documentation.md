# Lecture 4 (2.5h): Evaluation, Documentation, and Final Demonstration

## Session goal

Evaluate recommendation quality with evidence, discuss limitations, and finalize reproducible documentation.

## Delivery timeline (150 minutes)

- 0-25 min: evaluation methods lecture
- 25-55 min: stage-4 metrics demo
- 55-85 min: documentation workshop
- 85-120 min: final progress presentations
- 120-145 min: synthesis and reflection
- 145-150 min: submission wrap-up

## Instructor script

### 0-25 min

Say:
- "A working demo is not evidence of quality."
- "Today we use fixed test cases and measurable metrics."

Explain:
- Hit@1
- Hit@3
- MRR
- limits of small benchmark sets

### 25-55 min (live demo)

Use:
```bash
git checkout stage-4
cd backend
npm test
npm run eval:recommendations
```

Code references to show:
- evaluation cases: ../backend/evaluation/recommendation-cases.json
- evaluation script: ../backend/scripts/evaluate-recommendations.js
- relevance test: ../backend/tests/recommendationRelevance.test.js

### 55-85 min (documentation workshop)

Students update README with:
1. architecture summary
2. env and mock mode usage
3. endpoint contract
4. evaluation instructions
5. known limitations and caveats

### 85-120 min (final presentations)

Ask teams to show:
- one successful case
- one weak/failure case
- metrics and interpretation
- next improvement idea

### 120-145 min (synthesis)

Discuss:
- where AI helped clearly
- where rule-based logic may be enough
- ethical and reliability tradeoffs

### 145-150 min

Close with final checklist.

## End-of-module checklist

- Backend tests pass
- Evaluation script produces metrics
- Recommendations remain catalogue-grounded
- Documentation is reproducible
- Limitations are explicitly documented

## Code example (metric)

```js
function hitAtK(predictedIds, expectedIds, k) {
  return predictedIds.slice(0, k).some((id) => expectedIds.includes(id)) ? 1 : 0;
}
```

Teaching point:
- Metrics provide evidence, but always pair them with qualitative analysis.
