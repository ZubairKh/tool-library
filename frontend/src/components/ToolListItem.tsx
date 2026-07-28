import type { Tool } from '../types/tool';

export function ToolListItem({ tool }: { tool: Tool }) {
  const createdAt = new Date(tool.createdAt).toLocaleDateString();

  return (
    <li className="tool-card">
      <div>
        <h3 className="tool-name">{tool.name}</h3>
        <p className="tool-category">{tool.category}</p>
      </div>
      <div className="tool-meta">
        <span className="badge badge-neutral">{tool.condition}</span>
        <span className={`badge ${tool.isAvailable ? 'badge-success' : 'badge-warning'}`}>
          {tool.isAvailable ? 'Available' : 'In Use'}
        </span>
      </div>
      <p className="tool-date">Added {createdAt}</p>
    </li>
  );
}