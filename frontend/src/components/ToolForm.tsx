import { useState } from 'react';
import type { NewTool } from '../types/tool';

interface Props {
  onAdd: (tool: NewTool) => void;
}

export function ToolForm({ onAdd }: Props) {
  const [form, setForm] = useState<NewTool>({ name: '', category: '', condition: 'new', isAvailable: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm({ name: '', category: '', condition: 'new', isAvailable: true });
  };

  return (
    <form onSubmit={handleSubmit} className="tool-form">
      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="input-field"
      />
      <input
        placeholder="Category"
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
        className="input-field"
      />
      <select
        value={form.condition}
        onChange={e => setForm({ ...form, condition: e.target.value as NewTool['condition'] })}
        className="input-field"
      >
        <option value="new">New</option>
        <option value="good">Good</option>
        <option value="worn">Worn</option>
      </select>
      <select
        value={form.isAvailable ? 'available' : 'in-use'}
        onChange={e => setForm({ ...form, isAvailable: e.target.value === 'available' })}
        className="input-field"
      >
        <option value="available">Available</option>
        <option value="in-use">In Use</option>
      </select>
      <button type="submit" className="primary-btn">
        Add Tool
      </button>
    </form>
  );
}