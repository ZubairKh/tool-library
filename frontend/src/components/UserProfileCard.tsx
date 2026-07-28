import type { User } from '../types/auth';

export function UserProfileCard({ user }: { user: User }) {
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <article className="profile-card">
      <div className="profile-avatar" aria-hidden="true">{initials || 'U'}</div>
      <div>
        <p className="eyebrow">User Profile</p>
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
      </div>
      <dl className="profile-meta">
        <div>
          <dt>Status</dt>
          <dd>Active</dd>
        </div>
        <div>
          <dt>Access</dt>
          <dd>Member</dd>
        </div>
      </dl>
    </article>
  );
}
