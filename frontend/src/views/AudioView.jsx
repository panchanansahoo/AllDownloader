import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, HardDrive, DownloadCloud, Music, Sparkles } from "lucide-react";
import UrlCard from "../components/UrlCard";
import { downloadVideo } from "../lib/api";
import { detectPlatformLabel } from "../lib/platform";
import { isLikelySupportedUrl, normalizeInput } from "../lib/validation";
import { useDownload } from "../contexts/DownloadContext";

export default function AudioView({ setToast }) {
  const [value, setValue] = useState("");
  const [format, setFormat] = useState("mp3");
  const [quality, setQuality] = useState("auto");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { startDownload } = useDownload();

  const detectedPlatform = useMemo(() => {
    const normalized = normalizeInput(value);
    return normalized ? detectPlatformLabel(normalized) : null;
  }, [value]);

  const availableQualities = [
    { value: "auto", label: "Best Audio Quality" },
    { value: "320", label: "320 kbps (High)" },
    { value: "128", label: "128 kbps (Standard)" },
  ];
  
  const availableFormats = [
    { value: "mp3", label: "MP3" },
    { value: "m4a", label: "M4A" },
    { value: "wav", label: "WAV (Lossless)" },
    { value: "flac", label: "FLAC (Lossless)" },
  ];

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
      const data = await downloadVideo(normalized, format, quality);
      setResult(data);
      setToast({
        type: data.status === "error" ? "error" : "success",
        message: data.message || "Audio extracted successfully.",
      });
    } catch (err) {
      console.error("API failed:", err);
      setError(err.message || "Failed to extract audio.");
      setToast({ type: "error", message: "Failed to connect to backend." });
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = () => {
    if (result) {
      startDownload(result);
      setToast({ type: "success", message: "Download started." });
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
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400 text-sm font-medium mb-6 ring-1 ring-pink-500/20"
          >
            <Music className="w-4 h-4" />
            <span>High-Res Audio Extractor</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Extract Audio from <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Any Video.</span>
          </motion.h1>
        </div>
      </div>
      
      <UrlCard
        value={value}
        onChange={setValue}
        format={format}
        quality={quality}
        formatOptions={availableFormats}
        onFormatChange={setFormat}
        onQualityChange={setQuality}
        availableQualities={availableQualities}
        onSubmit={handleSubmit}
        loading={loading}
        detectedPlatform={detectedPlatform}
        error={error}
        onDemoPick={(demoUrl) => {
          setValue(demoUrl);
          setError("");
        }}
      />
      
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
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.8rem] p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-center border border-slate-200/50 dark:border-white/5">
                 <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg flex-shrink-0 shimmer-bg bg-slate-200 dark:bg-slate-800 mx-auto sm:mx-0" />
                 <div className="flex-1 space-y-4 text-center sm:text-left w-full">
                   <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg shimmer-bg mx-auto sm:mx-0" />
                   <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-lg shimmer-bg mx-auto sm:mx-0 mt-2" />
                   <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-6">
                     <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg shimmer-bg" />
                     <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg shimmer-bg" />
                   </div>
                   <div className="w-full sm:w-32 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl shimmer-bg mt-6 mx-auto sm:mx-0" />
                 </div>
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
              {result.thumbnail && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20 blur-3xl scale-110"
                  style={{ backgroundImage: `url(${result.thumbnail})` }}
                />
              )}
              
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.8rem] p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-center border border-slate-200/50 dark:border-white/5">
                 {result.thumbnail && (
                   <motion.div 
                     whileHover={{ scale: 1.05, rotate: 5 }}
                     className="w-32 h-32 rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] flex-shrink-0 relative"
                   >
                     <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover animate-[spin_20s_linear_infinite]" />
                     <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                       <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md"></div>
                     </div>
                   </motion.div>
                 )}
                 <div className="flex-1 space-y-4 text-center sm:text-left w-full">
                   <h3 className="text-xl font-bold line-clamp-2 leading-tight text-slate-900 dark:text-white">
                     {result.title || "Unknown Audio"}
                   </h3>
                   
                   <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                     <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300">
                       <Clock className="w-4 h-4" />
                       {result.duration || "N/A"}
                     </div>
                     <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300">
                       <HardDrive className="w-4 h-4" />
                       {result.size || "Unknown"}
                     </div>
                   </div>
                   
                   <button 
                      onClick={handleDownload}
                      className="w-full sm:w-auto mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 active:scale-95 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-pink-500/25 transition-all"
                   >
                     <DownloadCloud className="w-5 h-5" />
                     Download Audio
                   </button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
