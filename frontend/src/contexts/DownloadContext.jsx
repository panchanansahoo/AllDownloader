import { createContext, useContext, useState, useRef } from "react";
import confetti from "canvas-confetti";

const DownloadContext = createContext();

export function DownloadProvider({ children }) {
  const [downloads, setDownloads] = useState([]); // Active downloads
  const [library, setLibrary] = useState([]); // Completed downloads
  const abortControllers = useRef(new Map());

  const updateDownloadProgress = (id, progress, status = "downloading", errorMessage = null) => {
    setDownloads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, progress, status, errorMessage } : item))
    );
  };

  const runActualDownload = async (dl) => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001";
    let targetUrl = `${API_BASE}/api/download/stream?url=${encodeURIComponent(dl.url)}&format=${dl.format}`;
    
    if (dl.startTime) targetUrl += `&startTime=${encodeURIComponent(dl.startTime)}`;
    if (dl.endTime) targetUrl += `&endTime=${encodeURIComponent(dl.endTime)}`;
    
    const controller = new AbortController();
    abortControllers.current.set(dl.id, controller);

    try {
        const response = await fetch(targetUrl, { signal: controller.signal });
        if (!response.ok) {
            // Try to extract an error message from headers or standard HTTP status
            throw new Error(`Download failed with status ${response.status}`);
        }

        const contentLength = dl.rawSize || parseInt(response.headers.get("content-length") || "0", 10);
        
        const reader = response.body.getReader();
        let receivedLength = 0;
        const chunks = [];
        let simulatedProgress = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            chunks.push(value);
            receivedLength += value.length;

            if (contentLength > 0) {
                const progress = Math.min((receivedLength / contentLength) * 100, 99.9);
                updateDownloadProgress(dl.id, progress);
            } else {
                simulatedProgress = Math.min(simulatedProgress + Math.random() * 2, 99);
                updateDownloadProgress(dl.id, simulatedProgress);
            }
        }

        // We finished reading!
        const mimeType = dl.format === 'mp3' ? 'audio/mpeg' : 'video/mp4';
        const blob = new Blob(chunks, { type: mimeType });
        const objectUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        const ext = dl.format === 'mp3' ? 'mp3' : 'mp4';
        const cleanTitle = (dl.title || "video").replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${cleanTitle}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(objectUrl);

        // Update to complete and move to library
        updateDownloadProgress(dl.id, 100, "completed");
        abortControllers.current.delete(dl.id);
        
        // Trigger success confetti
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#4f46e5', '#8b5cf6', '#ec4899', '#10b981']
        });
        
        setTimeout(() => {
            setLibrary((prev) => [{ ...dl, id: Date.now().toString(), progress: 100, status: "completed", completedAt: Date.now() }, ...prev]);
            setDownloads((prev) => prev.filter(item => item.id !== dl.id));
        }, 500);

    } catch (err) {
        if (err.name === 'AbortError') {
            console.log("Download aborted by user");
        } else {
            console.error("Download error", err);
            updateDownloadProgress(dl.id, 0, "error", err.message || "Network Error or Private Video");
        }
        abortControllers.current.delete(dl.id);
    }
  };

  const startDownload = (mediaInfo) => {
    const id = Date.now().toString();
    const newDownload = {
      id,
      ...mediaInfo,
      progress: 0,
      status: "downloading",
      addedAt: Date.now(),
      errorMessage: null
    };
    
    setDownloads((prev) => [newDownload, ...prev]);
    runActualDownload(newDownload);
  };

  const retryDownload = (id) => {
    const dl = downloads.find(d => d.id === id);
    if (!dl) return;
    updateDownloadProgress(id, 0, "downloading", null);
    runActualDownload(dl);
  };

  const pauseDownload = (id) => {
    setDownloads((prev) =>
      prev.map((dl) => (dl.id === id ? { ...dl, status: "paused" } : dl))
    );
  };

  const resumeDownload = (id) => {
    setDownloads((prev) =>
      prev.map((dl) => (dl.id === id ? { ...dl, status: "downloading" } : dl))
    );
  };

  const cancelDownload = (id) => {
    const controller = abortControllers.current.get(id);
    if (controller) {
      controller.abort();
    }
    setDownloads((prev) => prev.filter((dl) => dl.id !== id));
  };
  
  const deleteFromLibrary = (id) => {
    setLibrary((prev) => prev.filter((item) => item.id !== id));
  };

  const clearLibrary = () => {
    setLibrary([]);
  };

  return (
    <DownloadContext.Provider
      value={{
        downloads,
        library,
        startDownload,
        retryDownload,
        pauseDownload,
        resumeDownload,
        cancelDownload,
        deleteFromLibrary,
        clearLibrary,
      }}
    >
      {children}
    </DownloadContext.Provider>
  );
}

export function useDownload() {
  return useContext(DownloadContext);
}
