export function getProfileImageUrl(user) {
  const profileImage = user?.profileImage || '';
  const name = user?.name || 'User';

  if (!profileImage || profileImage.includes('ui-avatars.com/api/?name=User')) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
  }

  return profileImage;
}

export function getUserInitial(user) {
  const name = user?.name?.trim() || 'User';
  return name.charAt(0).toUpperCase();
}

export function hasRealProfileImage(user) {
  const profileImage = user?.profileImage || '';
  return Boolean(profileImage && !profileImage.includes('ui-avatars.com/api/?name=User'));
}
