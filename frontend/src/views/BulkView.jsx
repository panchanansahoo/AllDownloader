import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layers, Loader2, Play, AlertCircle } from "lucide-react";
import { downloadVideo } from "../lib/api";
import { isLikelySupportedUrl, normalizeInput } from "../lib/validation";
import { useDownload } from "../contexts/DownloadContext";

export default function BulkView({ setToast }) {
  const [urlsText, setUrlsText] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { startDownload } = useDownload();

  const handleBulkStart = async () => {
    // split by newline, comma, or space
    const rawUrls = urlsText.split(/[\n, ]+/).map(u => normalizeInput(u)).filter(Boolean);
    const validUrls = rawUrls.filter(u => isLikelySupportedUrl(u));
    
    if (validUrls.length === 0) {
      setToast({ type: "error", message: "No valid URLs found." });
      return;
    }

    setLoading(true);
    let successCount = 0;

    for (const url of validUrls) {
      try {
        const data = await downloadVideo(url, "mp4", "auto");
        startDownload(data);
        successCount++;
      } catch (err) {
        console.error("Failed for", url, err);
      }
    }

    setLoading(false);
    setToast({ 
      type: successCount > 0 ? "success" : "error", 
      message: `Started ${successCount} downloads.` 
    });
    
    if (successCount > 0) {
      setUrlsText("");
    }
  };

  return (
    <div className="pb-16 relative">
      <div className="relative overflow-hidden pt-24 pb-12 flex justify-center text-center">
        <div className="relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 text-sm font-medium mb-6 ring-1 ring-cyan-500/20"
          >
            <Layers className="w-4 h-4" />
            <span>Bulk Media Downloader</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Queue them <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">all up.</span>
          </motion.h1>
        </div>
      </div>
      
      <div className="mx-auto max-w-3xl px-4 w-full">
        <motion.div layout className="glass-panel p-4 sm:p-6 rounded-[2rem] relative z-20">
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6 flex gap-3 text-blue-800 dark:text-blue-200 text-sm items-start">
             <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <p>Paste multiple links separated by newlines or commas. We'll analyze each one and send them directly to your Active Downloads queue.</p>
          </div>

          <div className="relative flex flex-col bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-inner p-2 border border-slate-100 dark:border-white/5">
            <textarea
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              placeholder="https://youtube.com/...&#10;https://twitter.com/..."
              rows={8}
              className="w-full bg-transparent border-0 focus:ring-0 text-sm py-4 px-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none resize-none font-mono"
            />
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleBulkStart}
              disabled={loading || urlsText.trim().length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 text-white py-4 px-8 rounded-xl font-bold transition-all disabled:opacity-70 shadow-lg shadow-cyan-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Batch Download
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
