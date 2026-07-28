export interface Tool {
  _id: string;
  name: string;
  category: string;
  condition: 'new' | 'good' | 'worn';
  isAvailable: boolean;
  createdAt: string;
}

export type NewTool = Pick<Tool, 'name' | 'category' | 'condition' | 'isAvailable'>;