const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV ? "http://localhost:4001" : "");

export async function downloadVideo(url, format, quality) {
  const response = await fetch(`${API_BASE}/api/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, format, quality }),
  });

  const data = await response.json();
  if (!response.ok || data.status === "error") {
    throw new Error(data?.message || "Unable to process the link.");
  }

  return { ...data, format, quality };
}
