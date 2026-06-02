import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, HardDrive, DownloadCloud } from "lucide-react";
import Hero from "../components/Hero";
import UrlCard from "../components/UrlCard";
import Faq from "../components/Faq";
import { downloadVideo } from "../lib/api";
import { detectPlatformLabel } from "../lib/platform";
import { getFormatOptions, getQualityOptions } from "../lib/conversion";
import { isLikelySupportedUrl, normalizeInput } from "../lib/validation";
import { useDownload } from "../contexts/DownloadContext";

export default function HomeView({ setToast }) {
  const [value, setValue] = useState("");
  const [format, setFormat] = useState("mp4");
  const [quality, setQuality] = useState("auto");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      setToast({
        type: data.status === "error" ? "error" : "success",
        message: data.message || "Media analyzed successfully.",
      });
    } catch (err) {
      console.error("API failed:", err);
      setError(err.message || "Failed to analyze video. Is the backend running?");
      setToast({ type: "error", message: "Failed to connect to backend." });
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = () => {
    if (result) {
      startDownload(result);
      setToast({ type: "success", message: "Download started." });
      setResult(null); // reset after start
      setValue("");
    }
  };

  return (
    <div className="pb-16 relative">
      <Hero />
      
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
            transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
            className="mx-auto max-w-3xl px-4 py-8 relative z-10"
          >
            <div className="relative overflow-hidden rounded-[2rem] glass p-1 shadow-2xl">
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.8rem] p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-center border border-slate-200/50 dark:border-white/5">
                 <div className="w-full sm:w-56 aspect-video rounded-2xl overflow-hidden shadow-lg flex-shrink-0 shimmer-bg bg-slate-200 dark:bg-slate-800" />
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
            transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
            className="mx-auto max-w-3xl px-4 py-8 relative z-10"
          >
            <div className="relative overflow-hidden rounded-[2rem] glass p-1 shadow-2xl">
              {/* Blurred Background from thumbnail */}
              {result.thumbnail && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20 blur-3xl scale-110"
                  style={{ backgroundImage: `url(${result.thumbnail})` }}
                />
              )}
              
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.8rem] p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-center border border-slate-200/50 dark:border-white/5">
                 {result.thumbnail && (
                   <motion.div 
                     whileHover={{ scale: 1.05 }}
                     className="w-full sm:w-56 aspect-video rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
                   >
                     <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                   </motion.div>
                 )}
                 <div className="flex-1 space-y-4 text-center sm:text-left w-full">
                   <h3 className="text-xl font-bold line-clamp-2 leading-tight text-slate-900 dark:text-white">
                     {result.title || "Unknown Media"}
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
                      className="w-full sm:w-auto mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all"
                   >
                     <DownloadCloud className="w-5 h-5" />
                     Download File
                   </button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-[2rem] border border-indigo-200/50 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20 p-8 text-center backdrop-blur-sm">
          <p className="text-indigo-900 dark:text-indigo-200 font-medium">
            VidDrop Manager: Download any video or audio link directly to your device securely and seamlessly.
          </p>
        </div>
      </section>

      <Faq />
    </div>
  );
}
