export function detectPlatformLabel(value) {
  try {
    const host = new URL(value).hostname.toLowerCase();
    if (host.includes("facebook.com") || host.includes("fb.watch")) return "Facebook";
    if (host.includes("instagram.com") || host.includes("instagr.am")) return "Instagram";
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "YouTube";
  } catch {
    return null;
  }
  return null;
}

