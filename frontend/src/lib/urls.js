const LOCAL_API_URL = 'http://localhost:3000/api';
const PROD_API_URL = '/_/backend/api';
export const PRODUCT_PLACEHOLDER_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="No image available">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#10b981" />
      </linearGradient>
    </defs>
    <rect width="1200" height="900" rx="56" fill="url(#g)" />
    <circle cx="600" cy="390" r="112" fill="rgba(255,255,255,0.18)" />
    <path d="M405 655l140-160 98 113 74-84 178 131H405z" fill="rgba(255,255,255,0.32)" />
    <text x="600" y="780" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="54" font-weight="700">
      Marketplace image coming soon
    </text>
  </svg>
`)}`

export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PROD_API_URL : LOCAL_API_URL);

function getBackendRoot() {
  if (/^https?:\/\//i.test(API_BASE_URL)) {
    const url = new URL(API_BASE_URL);
    return `${url.origin}${url.pathname.replace(/\/api\/?$/, '').replace(/\/$/, '')}`;
  }

  return API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
}

export function resolveBackendAssetUrl(assetPath) {
  if (!assetPath) {
    return '';
  }

  if (/^(https?:)?\/\//i.test(assetPath) || assetPath.startsWith('data:') || assetPath.startsWith('blob:')) {
    return assetPath;
  }

  const backendRoot = getBackendRoot();
  const normalizedPath = assetPath.replace(/^\/+/, '');

  return backendRoot ? `${backendRoot}/${normalizedPath}` : `/${normalizedPath}`;
}
