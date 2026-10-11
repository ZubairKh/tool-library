import { useMemo, useState } from 'react';
import { fetchRecommendations } from '../api/recommendation';
import type { Tool } from '../types/tool';
import type { RecommendationResponse } from '../types/recommendation';

interface AIToolFinderProps {
  tools: Tool[];
}

const EXAMPLES = [
  'I need to assemble furniture in a new apartment.',
  'I need to drill into a concrete wall for a shelf.',
  'I need to cut wooden trim pieces for a door frame.',
];

export function AIToolFinder({ tools }: AIToolFinderProps) {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const hasTools = tools.length > 0;
  const unavailableCount = useMemo(() => tools.filter((t) => !t.isAvailable).length, [tools]);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = task.trim();
    if (trimmed.length < 5) {
      setError('Please describe the task in at least 5 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchRecommendations(trimmed);
      setResult(data);
    } catch (err: any) {
      setResult(null);
      setError(err?.message || 'Unable to generate recommendations right now.');
    } finally {
      setLoading(false);
    }
  };

  const applyExample = (example: string) => {
    setTask(example);
    setError('');
  };

  return (
    <section className="library-panel ai-finder-panel">
      <div className="library-panel-head">
        <p className="eyebrow">AI Assistant</p>
        <h2 className="section-title">AI Tool Finder and Recommendation Assistant</h2>
        <p className="section-subtitle">
          Describe a task in natural language and get catalogue-grounded tool suggestions with reasons and caveats.
        </p>
      </div>

      <form onSubmit={handleRun} className="ai-finder-form">
        <label htmlFor="ai-task" className="ai-label">Describe the task</label>
        <textarea
          id="ai-task"
          className="input-field ai-task-input"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Example: I need to drill into a concrete wall to install a floating shelf."
          rows={4}
          disabled={loading}
        />

        <div className="ai-example-row">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              className="example-chip"
              onClick={() => applyExample(example)}
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>

        <div className="ai-actions-row">
          <button className="primary-btn" type="submit" disabled={loading || !hasTools}>
            {loading ? 'Generating Suggestions...' : 'Find Recommended Tools'}
          </button>
          <p className="section-subtitle ai-inline-note">
            Catalogue size: {tools.length} tools ({unavailableCount} unavailable)
          </p>
        </div>
      </form>

      {!hasTools && (
        <p className="form-error">
          The tool catalogue is empty. Add tools first, then run AI recommendations.
        </p>
      )}

      {error && <p className="form-error">{error}</p>}

      {result && result.recommendations.length === 0 && !error && (
        <div className="ai-result-block">
          <h3 className="tool-name">No Matching Recommendations</h3>
          <p className="section-subtitle">
            The assistant could not find strong matches in the current catalogue for this task.
          </p>
          {result.notes.length > 0 && (
            <ul className="ai-note-list">
              {result.notes.map((note, idx) => <li key={`${note}-${idx}`}>{note}</li>)}
            </ul>
          )}
        </div>
      )}

      {result && result.recommendations.length > 0 && (
        <div className="ai-result-block">
          <div className="ai-result-head">
            <h3 className="tool-name">Recommendations</h3>
            <span className="badge badge-neutral">Mode: {result.providerMode}</span>
          </div>

          <ul className="tool-grid ai-result-grid">
            {result.recommendations.map((item) => (
              <li className="tool-card" key={item.toolId}>
                <div>
                  <h4 className="tool-name">{item.name}</h4>
                  <p className="tool-category">{item.category}</p>
                </div>
                <div className="tool-meta">
                  <span className="badge badge-neutral">{item.condition}</span>
                  <span className={`badge ${item.isAvailable ? 'badge-success' : 'badge-warning'}`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <p className="tool-date">Why: {item.reason}</p>
                {item.limitations.length > 0 && (
                  <ul className="ai-limitations-list">
                    {item.limitations.map((limitation, idx) => <li key={`${limitation}-${idx}`}>{limitation}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {result.notes.length > 0 && (
            <div className="ai-notes-box">
              <p className="eyebrow">Additional Notes</p>
              <ul className="ai-note-list">
                {result.notes.map((note, idx) => <li key={`${note}-${idx}`}>{note}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
