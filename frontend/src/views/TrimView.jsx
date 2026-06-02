import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, HardDrive, DownloadCloud, Scissors } from "lucide-react";
import UrlCard from "../components/UrlCard";
import { downloadVideo } from "../lib/api";
import { detectPlatformLabel } from "../lib/platform";
import { getFormatOptions, getQualityOptions } from "../lib/conversion";
import { isLikelySupportedUrl, normalizeInput } from "../lib/validation";
import { useDownload } from "../contexts/DownloadContext";

export default function TrimView({ setToast }) {
  const [value, setValue] = useState("");
  const [format, setFormat] = useState("mp4");
  const [quality, setQuality] = useState("auto");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("00:00:15");

  const { startDownload } = useDownload();

  const detectedPlatform = useMemo(() => {
    const normalized = normalizeInput(value);
    return normalized ? detectPlatformLabel(normalized) : null;
  }, [value]);

  const availableQualities = useMemo(() => getQualityOptions(format), [format]);
  const availableFormats = useMemo(() => getFormatOptions(detectedPlatform), [detectedPlatform]);

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
      setToast({ type: "success", message: "Ready to trim." });
    } catch (err) {
      setError(err.message || "Failed to analyze video.");
      setToast({ type: "error", message: "Failed to connect to backend." });
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = () => {
    if (result) {
      startDownload({
        ...result,
        startTime,
        endTime
      });
      setToast({ type: "success", message: "Trimmed download started." });
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
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 text-sm font-medium mb-6 ring-1 ring-orange-500/20"
          >
            <Scissors className="w-4 h-4" />
            <span>Video Trimmer & Clipper</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Cut exactly what <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">you need.</span>
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
                 <div className="w-full sm:w-56 aspect-video rounded-2xl overflow-hidden shadow-lg flex-shrink-0 shimmer-bg bg-slate-200 dark:bg-slate-800" />
                 <div className="flex-1 space-y-4 text-center sm:text-left w-full">
                   <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg shimmer-bg mx-auto sm:mx-0" />
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
              
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.8rem] p-6 sm:p-8 flex flex-col gap-6 items-center border border-slate-200/50 dark:border-white/5">
                 
                 <div className="flex flex-col sm:flex-row gap-8 w-full items-center">
                   {result.thumbnail && (
                     <motion.div 
                       whileHover={{ scale: 1.05 }}
                       className="w-full sm:w-48 aspect-video rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
                     >
                       <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                     </motion.div>
                   )}
                   <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                     <h3 className="text-xl font-bold line-clamp-2 leading-tight text-slate-900 dark:text-white">
                       {result.title || "Unknown Media"}
                     </h3>
                     <div className="flex items-center gap-1.5 justify-center sm:justify-start px-3 py-1.5 w-fit rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300">
                       <Clock className="w-4 h-4" />
                       Total Duration: {result.duration || "N/A"}
                     </div>
                   </div>
                 </div>

                 {/* Trim Controls */}
                 <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center gap-4 justify-between">
                   <div className="flex flex-col flex-1 w-full">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Start Time (HH:MM:SS)</label>
                     <input 
                       type="text" 
                       value={startTime}
                       onChange={(e) => setStartTime(e.target.value)}
                       className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                     />
                   </div>
                   <div className="flex flex-col flex-1 w-full">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">End Time (HH:MM:SS)</label>
                     <input 
                       type="text" 
                       value={endTime}
                       onChange={(e) => setEndTime(e.target.value)}
                       className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                     />
                   </div>
                   
                   <button 
                      onClick={handleDownload}
                      className="w-full sm:w-auto mt-4 sm:mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-95 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/25 transition-all"
                   >
                     <Scissors className="w-4 h-4" />
                     Trim & Download
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
