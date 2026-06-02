const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001";

export async function downloadVideo(url, format, quality) {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();
  if (!response.ok || data.status === "error") {
    throw new Error(data?.message || "Unable to process the link.");
  }

  return { ...data, format, quality };
}
