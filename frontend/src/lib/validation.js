export function normalizeInput(value) {
  return value.trim().replace(/\u0000/g, "");
}

export function isLikelySupportedUrl(value) {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol);
  } catch {
    return false;
  }
}

