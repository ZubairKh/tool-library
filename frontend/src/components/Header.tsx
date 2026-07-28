import type { User } from '../types/auth';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Community Platform</p>
        <h1 className="brand-title">Tool Library</h1>
      </div>
      {user ? (
        <div className="header-actions">
          <span className="user-pill">{user.name}</span>
          <button type="button" onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        <p className="section-subtitle">Build your local tool-sharing network.</p>
      )}
    </header>
  );
}
