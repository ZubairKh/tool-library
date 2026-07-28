import type { Tool, NewTool } from '../types/tool';

const API = 'http://localhost:4000/api';

export async function fetchTools(category?: string): Promise<Tool[]> {
  const url = category ? `${API}/tools?category=${category}` : `${API}/tools`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tools');
  return res.json();
}

export async function createTool(tool: NewTool, token: string): Promise<Tool> {
  const res = await fetch(`${API}/tools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(tool),
  });
  if (!res.ok) throw new Error('Failed to create tool');
  return res.json();
}