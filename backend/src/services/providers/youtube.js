const { buildThumbnailSvg, prettifySlug, buildContentSummary } = require("./shared");
const { buildDownloadOptions } = require("../../utils/conversion");
const { createJob } = require("../jobStore");

function extractYouTubeVideoId(url) {
  if (url.hostname.includes("youtu.be")) {
    return url.pathname.replace("/", "").split("/")[0];
  }

  const directId = url.searchParams.get("v");
  if (directId) {
    return directId;
  }

  const parts = url.pathname.split("/").filter(Boolean);
  return parts.includes("shorts") ? parts[parts.indexOf("shorts") + 1] : parts.pop();
}

function buildYouTubeResult(url, preferences) {
  const videoId = extractYouTubeVideoId(url);
  const title = prettifySlug(videoId || "youtube video");
  const allowPermittedDownloads = process.env.ALLOW_PERMITTED_YOUTUBE_DOWNLOADS === "true";
  const summary = buildContentSummary("youtube", preferences.selectedFormat, preferences.selectedQuality);
  const job = createJob({
    sourceUrl: url.toString(),
    platform: "youtube",
    title,
    thumbnail: buildThumbnailSvg("youtube", title),
    message:
      "YouTube link detected. Only proceed for content you own or are authorized to download, and wire this handler to a compliant permitted-content workflow.",
    ...summary,
  });
  const jobUrl = `/api/download/media/${job.id}`;

  return {
    status: allowPermittedDownloads ? "ready" : "warning",
    platform: "youtube",
    title,
    thumbnail: buildThumbnailSvg("youtube", title),
    selectedFormat: preferences.selectedFormat,
    selectedQuality: preferences.selectedQuality,
    downloadUrl: jobUrl,
    mediaPageUrl: jobUrl,
    downloadOptions: buildDownloadOptions({
      format: preferences.selectedFormat,
      quality: preferences.selectedQuality,
      mediaPageUrl: jobUrl,
    }),
    message: allowPermittedDownloads
      ? "YouTube link detected. The permitted-content workflow is enabled, and the backend can now open the generated media summary page."
      : "YouTube link detected. Only proceed for content you own or are authorized to download, and wire this handler to a compliant permitted-content workflow.",
  };
}

module.exports = { buildYouTubeResult };
