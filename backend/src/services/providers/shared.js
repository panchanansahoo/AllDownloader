function prettifySlug(value) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase()) || "Untitled video";
}

function buildThumbnailSvg(platform, title) {
  const safeTitle = title.replace(/[<>&"]/g, "");
  const colors = {
    facebook: ["#1877f2", "#0f172a"],
    instagram: ["#e1306c", "#312e81"],
    youtube: ["#ff0033", "#111827"],
  };
  const [accent, base] = colors[platform] || colors.youtube;
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${accent}"/>
        <stop offset="100%" stop-color="${base}"/>
      </linearGradient>
    </defs>
    <rect width="1280" height="720" rx="56" fill="url(#g)"/>
    <circle cx="1040" cy="140" r="90" fill="rgba(255,255,255,0.12)"/>
    <circle cx="180" cy="600" r="130" fill="rgba(255,255,255,0.08)"/>
    <text x="80" y="180" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700">${platform.toUpperCase()}</text>
    <text x="80" y="290" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="44">${safeTitle}</text>
    <rect x="80" y="520" width="260" height="84" rx="42" fill="rgba(255,255,255,0.18)"/>
    <text x="180" y="575" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">Preview only</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function buildContentSummary(platform, selectedFormat, selectedQuality) {
  const availableFormats = platform === "youtube" ? ["mp4", "mp3"] : ["mp4"];
  const availableQualities = selectedFormat === "mp3"
    ? ["auto", "320kbps", "192kbps", "128kbps"]
    : ["auto", "1080p", "720p", "480p", "360p"];

  return {
    selectedFormat,
    selectedQuality,
    availableFormats,
    availableQualities,
  };
}

module.exports = {
  prettifySlug,
  buildThumbnailSvg,
  buildContentSummary,
};
