import type { Tool } from '../types/tool';
import { ToolListItem } from './ToolListItem';

export function ToolList({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) {
    return <p className="section-subtitle">No tools yet. Add your first tool above.</p>;
  }
  return (
    <ul className="tool-grid">
      {tools.map(t => <ToolListItem key={t._id} tool={t} />)}
    </ul>
  );
}