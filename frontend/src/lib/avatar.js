import { resolveBackendAssetUrl } from './urls';

export function getProfileImageUrl(user) {
  const profileImage = user?.profileImage || '';

  if (!profileImage || profileImage.includes('ui-avatars.com/api/?name=User')) {
    return '';
  }

  return resolveBackendAssetUrl(profileImage);
}

export function getUserFirstName(user) {
  const name = user?.name?.trim() || 'User';
  return name.split(/\s+/)[0];
}

export function hasRealProfileImage(user) {
  const profileImage = user?.profileImage || '';
  return Boolean(profileImage && !profileImage.includes('ui-avatars.com/api/?name=User'));
}
