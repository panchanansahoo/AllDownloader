import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, DownloadCloud, Clock, AlertCircle } from "lucide-react";
import { downloadVideo } from "../lib/api";
import { detectPlatformLabel } from "../lib/platform";
import { isLikelySupportedUrl, normalizeInput } from "../lib/validation";
import { useDownload } from "../contexts/DownloadContext";

export default function StoryView({ setToast }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { startDownload } = useDownload();

  const detectedPlatform = useMemo(() => {
    const normalized = normalizeInput(value);
    return normalized ? detectPlatformLabel(normalized) : null;
  }, [value]);

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
      // Stories are typically mp4 video
      const data = await downloadVideo(normalized, "mp4", "auto");
      setResult(data);
      setToast({ type: "success", message: "Story analyzed." });
    } catch (err) {
      console.error("API failed:", err);
      setError(err.message || "Failed to analyze story.");
      setToast({ type: "error", message: "Failed to connect. (Note: Private stories may not work)" });
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = () => {
    if (result) {
      startDownload({
        ...result,
        format: "mp4" // Always mp4 for stories
      });
      setToast({ type: "success", message: "Story download started!" });
      setResult(null);
      setValue("");
    }
  };

  return (
    <div className="pb-16 relative">
      <div className="relative overflow-hidden pt-24 pb-12 flex justify-center text-center">
        <div className="relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 text-sm font-medium mb-6 ring-1 ring-fuchsia-500/20"
          >
            <Smartphone className="w-4 h-4" />
            <span>Social Story Downloader</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Save their <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">Stories.</span>
          </motion.h1>
        </div>
      </div>
      
      <div className="mx-auto max-w-2xl px-4 w-full">
        <motion.div layout className="glass-panel p-3 rounded-[2rem] relative z-20">
          
          <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-fuchsia-200 dark:border-fuchsia-800/50 rounded-2xl p-3 mb-4 mx-1 flex gap-3 text-fuchsia-800 dark:text-fuchsia-200 text-xs sm:text-sm items-start">
             <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <p>Paste the link to a public story (e.g., Instagram, Facebook). Note that stories from private accounts or those requiring login cannot be downloaded.</p>
          </div>

          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-inner p-1 pl-4 border border-slate-100 dark:border-white/5">
            <input
              type="url"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Paste story link here..."
              className="flex-1 w-full bg-transparent border-0 focus:ring-0 text-lg py-4 px-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !hasValue}
              className="mr-1 flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 active:scale-95 text-white py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-70 shadow-lg shadow-fuchsia-500/30"
            >
              {loading ? "Analyzing..." : "Fetch"}
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
            className="mx-auto max-w-sm px-4 py-8 relative z-10"
          >
            <div className="relative overflow-hidden rounded-[2.5rem] glass p-1 shadow-2xl">
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.3rem] p-4 border border-slate-200/50 dark:border-white/5 h-[500px] flex flex-col">
                 <div className="w-full h-full rounded-[1.8rem] shimmer-bg bg-slate-200 dark:bg-slate-800" />
                 <div className="mt-4 h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl shimmer-bg" />
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
            className="mx-auto max-w-sm px-4 py-8 relative z-10"
          >
            <div className="relative overflow-hidden rounded-[2.5rem] glass p-1 shadow-2xl group">
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.3rem] p-4 border border-slate-200/50 dark:border-white/5 flex flex-col items-center">
                 {/* Vertical Aspect Ratio for Stories */}
                 {result.thumbnail && (
                   <motion.div 
                     className="w-full aspect-[9/16] rounded-[1.8rem] overflow-hidden shadow-lg relative mb-4 bg-black"
                   >
                     <img src={result.thumbnail} alt={result.title} className="w-full h-full object-contain" />
                     {/* Story Overlay UI simulation */}
                     <div className="absolute top-4 left-4 right-4 flex gap-1">
                        <div className="h-1 bg-white/50 backdrop-blur-md rounded-full flex-1"></div>
                        <div className="h-1 bg-white/20 backdrop-blur-md rounded-full flex-1"></div>
                     </div>
                   </motion.div>
                 )}
                 <h3 className="text-lg font-bold line-clamp-1 text-center text-slate-900 dark:text-white mb-1 w-full px-2">
                   {result.title || "Story Download"}
                 </h3>
                 <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    {result.duration || "N/A"}
                 </div>
                 
                 <button 
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 active:scale-95 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-fuchsia-500/25 transition-all text-lg"
                 >
                   <DownloadCloud className="w-6 h-6" />
                   Download Story
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
