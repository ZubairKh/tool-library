export interface ToolRecommendation {
  toolId: string;
  name: string;
  category: string;
  condition: 'new' | 'good' | 'worn';
  isAvailable: boolean;
  reason: string;
  limitations: string[];
  score: number;
}

export interface RecommendationResponse {
  task: string;
  providerMode: string;
  recommendations: ToolRecommendation[];
  notes: string[];
}
