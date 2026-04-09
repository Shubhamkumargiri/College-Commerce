import { getProfileImageUrl, getUserInitial, hasRealProfileImage } from '../lib/avatar';

export default function ProfileAvatar({ user, size = 48, className = '', fallbackClassName = '' }) {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  if (hasRealProfileImage(user)) {
    return (
      <img
        src={getProfileImageUrl(user)}
        alt={user?.name || 'User'}
        className={`rounded-full object-cover ${className}`}
        style={{ width: dimension, height: dimension }}
      />
    );
  }

  return (
    <div
      className={`grid rounded-full bg-slate-950 text-white ${fallbackClassName}`}
      style={{ width: dimension, height: dimension }}
    >
      <span className="m-auto text-sm font-semibold">{getUserInitial(user)}</span>
    </div>
  );
}
