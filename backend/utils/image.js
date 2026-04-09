function fileToDataUrl(file) {
  if (!file?.buffer || !file?.mimetype) {
    return '';
  }

  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}

module.exports = {
  fileToDataUrl,
};
