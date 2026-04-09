import { useEffect, useState } from 'react';
import { getProfileImageUrl, getUserFirstName, hasRealProfileImage } from '../lib/avatar';

export default function ProfileAvatar({ user, size = 48, className = '', fallbackClassName = '' }) {
  const dimension = typeof size === 'number' ? `${size}px` : size;
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [user?.profileImage]);

  if (hasRealProfileImage(user) && !imageFailed) {
    return (
      <img
        src={getProfileImageUrl(user)}
        alt={user?.name || 'User'}
        className={`rounded-full object-cover ${className}`}
        style={{ width: dimension, height: dimension }}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className={`grid rounded-full bg-slate-950 text-white ${fallbackClassName}`}
      style={{ width: dimension, height: dimension }}
    >
      <span className="m-auto px-2 text-center text-sm font-semibold leading-tight">{getUserFirstName(user)}</span>
    </div>
  );
}
