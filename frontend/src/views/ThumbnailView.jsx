import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, DownloadCloud, Link2, Loader2 } from "lucide-react";
import { downloadVideo } from "../lib/api";
import { isLikelySupportedUrl, normalizeInput } from "../lib/validation";

export default function ThumbnailView({ setToast }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasValue = value.trim().length > 0;

  async function handleSubmit() {
    const normalized = normalizeInput(value);
    if (!normalized || !isLikelySupportedUrl(normalized)) {
      setError("Please paste a valid URL.");
      setToast({ type: "error", message: "Invalid URL." });
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await downloadVideo(normalized, "mp4", "auto");
      setResult(data);
      setToast({ type: "success", message: "Thumbnail extracted." });
    } catch (err) {
      console.error("API failed:", err);
      setError(err.message || "Failed to extract thumbnail.");
      setToast({ type: "error", message: "Failed to connect to backend." });
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = async () => {
    if (!result || !result.thumbnail) return;
    
    try {
      const response = await fetch(result.thumbnail);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.title || 'thumbnail'}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setToast({ type: "success", message: "Thumbnail downloaded!" });
    } catch (err) {
      console.error(err);
      // Fallback: open in new tab
      window.open(result.thumbnail, '_blank');
    }
  };

  return (
    <div className="pb-16 relative">
      <div className="relative overflow-hidden pt-24 pb-12 flex justify-center text-center">
        <div className="relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-sm font-medium mb-6 ring-1 ring-emerald-500/20"
          >
            <ImageIcon className="w-4 h-4" />
            <span>HQ Thumbnail Extractor</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Grab the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Cover Art.</span>
          </motion.h1>
        </div>
      </div>
      
      <div className="mx-auto max-w-3xl px-4 w-full">
        <motion.div layout className="glass-panel p-3 rounded-[2rem] relative z-20">
          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-inner p-1 pl-4 border border-slate-100 dark:border-white/5">
            <Link2 className="w-6 h-6 text-slate-400 flex-shrink-0" />
            <input
              type="url"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Paste video link here..."
              className="flex-1 w-full bg-transparent border-0 focus:ring-0 text-lg py-4 px-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !hasValue}
              className="mr-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-70 shadow-lg shadow-emerald-500/30"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Extract"}
            </button>
          </div>
          {error && (
            <div className="px-4 pt-4 pb-1 text-sm font-medium text-rose-500 flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}
        </motion.div>
      </div>
      
      <AnimatePresence mode="popLayout">
        {loading && !result && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mx-auto max-w-3xl px-4 py-8 relative z-10"
          >
            <div className="relative overflow-hidden rounded-[2rem] glass p-1 shadow-2xl">
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.8rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5">
                 <div className="w-full aspect-video rounded-2xl shimmer-bg bg-slate-200 dark:bg-slate-800 mb-6" />
                 <div className="h-8 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-lg shimmer-bg mx-auto" />
              </div>
            </div>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mx-auto max-w-3xl px-4 py-8 relative z-10"
          >
            <div className="relative overflow-hidden rounded-[2rem] glass p-1 shadow-2xl group">
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.8rem] p-4 border border-slate-200/50 dark:border-white/5 flex flex-col items-center">
                 {result.thumbnail && (
                   <motion.div 
                     whileHover={{ scale: 1.02 }}
                     className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg relative mb-6"
                   >
                     <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                   </motion.div>
                 )}
                 <h3 className="text-xl font-bold line-clamp-2 text-center text-slate-900 dark:text-white mb-6">
                   {result.title || "Unknown Media"}
                 </h3>
                 
                 <button 
                    onClick={handleDownload}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white px-12 py-4 rounded-xl font-bold shadow-xl shadow-emerald-500/25 transition-all text-lg"
                 >
                   <DownloadCloud className="w-6 h-6" />
                   Download Image
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
