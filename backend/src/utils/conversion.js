const VIDEO_QUALITIES = ["auto", "1080p", "720p", "480p", "360p", "240p"];
const AUDIO_QUALITIES = ["auto", "320kbps", "192kbps", "128kbps", "96kbps"];

function getQualityOptions(format) {
  return format === "mp3" ? AUDIO_QUALITIES : VIDEO_QUALITIES;
}

function getDownloadLabel(format, quality) {
  const normalizedQuality = quality === "auto" ? "Auto" : quality.toUpperCase();
  return `${format.toUpperCase()} ${normalizedQuality}`;
}

function buildDownloadOptions({ format, quality, mediaPageUrl }) {
  return getQualityOptions(format).map((candidate) => ({
    label: getDownloadLabel(format, candidate),
    format,
    quality: candidate,
    available: candidate === quality,
    downloadUrl: candidate === quality ? mediaPageUrl : null,
  }));
}

module.exports = {
  getQualityOptions,
  getDownloadLabel,
  buildDownloadOptions,
};
