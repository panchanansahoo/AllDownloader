const { detectPlatform, normalizeUrl } = require("../utils/platform");
const { getQualityOptions } = require("../utils/conversion");
const { buildFacebookResult } = require("./providers/facebook");
const { buildInstagramResult } = require("./providers/instagram");
const { buildYouTubeResult } = require("./providers/youtube");

function normalizeQuality(format, quality) {
  const allowed = getQualityOptions(format);
  if (!quality || quality === "auto") {
    return allowed[0];
  }

  return allowed.includes(quality) ? quality : allowed[0];
}

async function resolveDownload(input, preferences = {}) {
  const url = normalizeUrl(input);
  if (!url) {
    return {
      status: "error",
      platform: null,
      title: null,
      thumbnail: null,
      downloadUrl: null,
      downloadOptions: [],
      message: "Please enter a valid Facebook, Instagram, or YouTube URL.",
    };
  }

  const platform = detectPlatform(url);
  if (!platform) {
    return {
      status: "error",
      platform: null,
      title: null,
      thumbnail: null,
      downloadUrl: null,
      downloadOptions: [],
      message: "Only Facebook, Instagram, and YouTube links are supported.",
    };
  }

  const selectedFormat =
    platform === "youtube" && preferences.format === "mp3" ? "mp3" : "mp4";
  const selectedQuality = normalizeQuality(selectedFormat, preferences.quality);

  if (platform === "facebook") {
    return buildFacebookResult(url, { selectedFormat, selectedQuality });
  }

  if (platform === "instagram") {
    return buildInstagramResult(url, { selectedFormat, selectedQuality });
  }

  return buildYouTubeResult(url, { selectedFormat, selectedQuality });
}

module.exports = { resolveDownload };
