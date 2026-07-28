import { useEffect, useState, useCallback } from 'react';
import { fetchTools, createTool } from '../api/tool';
import { useAuth } from '../context/AuthContext';
import type { Tool, NewTool } from '../types/tool';

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const loadTools = useCallback(async () => {
    setLoading(true);
    try {
      setTools(await fetchTools());
    } finally {
      setLoading(false);
    }
  }, []);

  const addTool = async (newTool: NewTool) => {
    if (!token) throw new Error('Not authenticated');
    await createTool(newTool, token);
    await loadTools();
  };

  useEffect(() => { loadTools(); }, [loadTools]);

  return { tools, loading, addTool };
}