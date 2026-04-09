function getBackendPublicPrefix() {
  if (process.env.PUBLIC_BACKEND_PREFIX) {
    return process.env.PUBLIC_BACKEND_PREFIX;
  }

  return process.env.VERCEL ? '/_/backend' : '';
}

function buildPublicUploadUrl(req, filename) {
  const prefix = getBackendPublicPrefix();
  return `${req.protocol}://${req.get('host')}${prefix}/uploads/${filename}`;
}

module.exports = {
  buildPublicUploadUrl,
};
