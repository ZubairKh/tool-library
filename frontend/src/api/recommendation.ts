import type { RecommendationResponse } from '../types/recommendation';

const API = 'http://localhost:4000/api';

export async function fetchRecommendations(task: string): Promise<RecommendationResponse> {
  const res = await fetch(`${API}/tools/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  });

  if (!res.ok) {
    let message = 'Failed to fetch recommendations';
    try {
      const json = await res.json();
      if (typeof json?.error === 'string' && json.error.trim()) message = json.error;
    } catch {
      // Keep generic message when response body is not JSON.
    }
    throw new Error(message);
  }

  return res.json();
}
