export const FORMAT_OPTIONS = [
  { value: "mp4", label: "MP4 video" },
  { value: "mp3", label: "MP3 audio" },
];

export const QUALITY_OPTIONS = {
  mp4: [
    { value: "auto", label: "Auto" },
    { value: "1080p", label: "1080p" },
    { value: "720p", label: "720p" },
    { value: "480p", label: "480p" },
    { value: "360p", label: "360p" },
    { value: "240p", label: "240p" },
  ],
  mp3: [
    { value: "auto", label: "Auto" },
    { value: "320kbps", label: "320 kbps" },
    { value: "192kbps", label: "192 kbps" },
    { value: "128kbps", label: "128 kbps" },
    { value: "96kbps", label: "96 kbps" },
  ],
};

export function getQualityOptions(format) {
  return QUALITY_OPTIONS[format] || QUALITY_OPTIONS.mp4;
}

export function getFormatOptions(detectedPlatform) {
  if (!detectedPlatform) {
    return FORMAT_OPTIONS;
  }

  return detectedPlatform === "YouTube" ? FORMAT_OPTIONS : [FORMAT_OPTIONS[0]];
}

export function getFormatLabel(format) {
  return FORMAT_OPTIONS.find((option) => option.value === format)?.label || "MP4 video";
}
