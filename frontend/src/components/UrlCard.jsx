import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, ChevronDown, Download, Loader2 } from "lucide-react";
import useKeyPress from "../hooks/useKeyPress";

export default function UrlCard({
  value,
  onChange,
  format,
  quality,
  formatOptions,
  onFormatChange,
  onQualityChange,
  availableQualities,
  onSubmit,
  loading,
  detectedPlatform,
  error,
  onDemoPick,
}) {
  const hasValue = value.trim().length > 0;
  const inputRef = useRef(null);

  useKeyPress("ctrl+k", (e) => {
    e.preventDefault();
    inputRef.current?.focus();
  });
  
  useKeyPress("meta+k", (e) => {
    e.preventDefault();
    inputRef.current?.focus();
  });
  
  useKeyPress("escape", () => {
    if (document.activeElement === inputRef.current) {
      inputRef.current.blur();
    }
  });

  return (
    <div className="mx-auto max-w-3xl px-4 w-full">
      <motion.div 
        layout
        className="glass-panel p-3 rounded-[2rem] relative z-20"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      >
        <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-inner p-1 pl-4 border border-slate-100 dark:border-white/5">
          <Link2 className="w-6 h-6 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste your link here... (Ctrl+K)"
            className="flex-1 w-full bg-transparent border-0 focus:ring-0 text-lg sm:text-xl py-4 px-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
          <AnimatePresence>
            {!hasValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => navigator.clipboard.readText().then(text => onChange(text)).catch(()=> {})}
                className="mr-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-medium text-sm transition-colors hidden sm:block"
              >
                Paste
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {hasValue && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
              transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            >
              <div className="pt-4 pb-2 px-2 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-4">
                
                <div className="flex w-full sm:w-auto items-center gap-3">
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={format}
                      onChange={(e) => onFormatChange(e.target.value)}
                      className="w-full appearance-none bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 pl-4 pr-10 rounded-xl font-medium text-sm outline-none transition-colors cursor-pointer border border-transparent focus:border-indigo-500/50"
                    >
                      {formatOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>

                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={quality}
                      onChange={(e) => onQualityChange(e.target.value)}
                      className="w-full appearance-none bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 pl-4 pr-10 rounded-xl font-medium text-sm outline-none transition-colors cursor-pointer border border-transparent focus:border-indigo-500/50"
                    >
                      {availableQualities.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <button
                  onClick={onSubmit}
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-3 px-8 rounded-xl font-semibold transition-all disabled:opacity-70 shadow-lg shadow-indigo-500/30"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
              
              {detectedPlatform && !error && (
                <div className="px-3 pt-2 pb-1 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Detected: {detectedPlatform}
                </div>
              )}
              {error && (
                <div className="px-3 pt-2 pb-1 text-sm font-medium text-rose-500 dark:text-rose-400 flex items-center gap-2">
                  <span>{error}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {!hasValue && (
        <div className="mt-8 flex flex-col items-center">
          {/* Demo buttons removed as per request */}
        </div>
      )}
    </div>
  );
}
