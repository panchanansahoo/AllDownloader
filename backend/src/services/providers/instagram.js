const { buildThumbnailSvg, prettifySlug, buildContentSummary } = require("./shared");
const { buildDownloadOptions } = require("../../utils/conversion");
const { createJob } = require("../jobStore");

function buildInstagramResult(url, preferences) {
  const slug = url.pathname.split("/").filter(Boolean).pop() || "instagram reel";
  const title = prettifySlug(decodeURIComponent(slug));
  const summary = buildContentSummary("instagram", preferences.selectedFormat, preferences.selectedQuality);
  const job = createJob({
    sourceUrl: url.toString(),
    platform: "instagram",
    title,
    thumbnail: buildThumbnailSvg("instagram", title),
    message:
      "Instagram link detected. Attach a compliant provider or scraping service before exposing direct media downloads.",
    ...summary,
  });
  const jobUrl = `/api/download/media/${job.id}`;

  return {
    status: "warning",
    platform: "instagram",
    title,
    thumbnail: buildThumbnailSvg("instagram", title),
    selectedFormat: preferences.selectedFormat,
    selectedQuality: preferences.selectedQuality,
    downloadUrl: jobUrl,
    mediaPageUrl: jobUrl,
    downloadOptions: buildDownloadOptions({
      format: preferences.selectedFormat,
      quality: preferences.selectedQuality,
      mediaPageUrl: jobUrl,
    }),
    message:
      "Instagram link detected. Attach a compliant provider or scraping service before exposing direct media downloads.",
  };
}

module.exports = { buildInstagramResult };
