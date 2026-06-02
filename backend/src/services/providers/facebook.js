const { buildThumbnailSvg, prettifySlug, buildContentSummary } = require("./shared");
const { buildDownloadOptions } = require("../../utils/conversion");
const { createJob } = require("../jobStore");

function buildFacebookResult(url, preferences) {
  const slug = url.pathname.split("/").filter(Boolean).pop() || "facebook video";
  const title = prettifySlug(decodeURIComponent(slug));
  const summary = buildContentSummary("facebook", preferences.selectedFormat, preferences.selectedQuality);
  const job = createJob({
    sourceUrl: url.toString(),
    platform: "facebook",
    title,
    thumbnail: buildThumbnailSvg("facebook", title),
    message:
      "Facebook link detected. Connect an authorized downloader or scraping service to enable compliant media retrieval.",
    ...summary,
  });
  const jobUrl = `/api/download/media/${job.id}`;

  return {
    status: "warning",
    platform: "facebook",
    title,
    thumbnail: buildThumbnailSvg("facebook", title),
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
      "Facebook link detected. Connect an authorized downloader or scraping service to enable compliant media retrieval.",
  };
}

module.exports = { buildFacebookResult };
