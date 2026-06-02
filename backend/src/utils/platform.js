function normalizeUrl(input) {
  if (typeof input !== "string") {
    return null;
  }

  const trimmed = input.trim().replace(/\u0000/g, "");
  if (!trimmed) {
    return null;
  }

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return null;
  }

  return url;
}

function detectPlatform(url) {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

  if (
    hostname.endsWith("facebook.com") ||
    hostname.endsWith("fb.watch") ||
    hostname.endsWith("m.facebook.com")
  ) {
    return "facebook";
  }

  if (hostname.endsWith("instagram.com") || hostname.endsWith("instagr.am")) {
    return "instagram";
  }

  if (
    hostname.endsWith("youtube.com") ||
    hostname.endsWith("youtu.be") ||
    hostname.endsWith("m.youtube.com")
  ) {
    return "youtube";
  }

  return null;
}

module.exports = {
  normalizeUrl,
  detectPlatform,
};

