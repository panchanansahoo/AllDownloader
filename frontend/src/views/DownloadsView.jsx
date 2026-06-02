import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, HardDrive, AlertCircle, RefreshCw } from "lucide-react";
import { useDownload } from "../contexts/DownloadContext";

export default function DownloadsView() {
  const { downloads, pauseDownload, resumeDownload, cancelDownload, retryDownload } = useDownload();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Active Downloads</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your current transfers.</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{downloads.length}</span>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {downloads.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center rounded-[2.5rem] glass-panel p-16 text-center border-dashed"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <HardDrive className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Queue is empty</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              Any media you download from the Home screen will appear here while it's transferring.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {downloads.map((dl) => {
              const isError = dl.status === "error";
              
              return (
              <motion.div 
                key={dl.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                transition={{ type: "spring", bounce: 0.2 }}
                className={`rounded-[1.5rem] p-1 shadow-lg ${isError ? 'bg-rose-500/20 shadow-rose-500/10' : 'glass'}`}
              >
                <div className={`${isError ? 'bg-rose-50/90 dark:bg-rose-950/40' : 'bg-white/60 dark:bg-slate-900/60'} rounded-[1.4rem] p-5 backdrop-blur-md transition-colors`}>
                  <div className="flex flex-col sm:flex-row gap-5">
                    
                    {/* Thumbnail */}
                    <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 shadow-inner">
                      {dl.thumbnail && <img src={dl.thumbnail} alt="" className="h-full w-full object-cover" />}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="truncate font-bold text-slate-900 dark:text-white text-lg">{dl.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          {dl.format}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                          {dl.size} • {dl.quality}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 sm:pl-4">
                      {isError ? (
                        <button 
                          onClick={() => retryDownload(dl.id)} 
                          className="w-12 h-12 rounded-full bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 transition-colors"
                          title="Retry"
                        >
                          <RefreshCw className="w-5 h-5 fill-current" />
                        </button>
                      ) : dl.status === "downloading" ? (
                        <button 
                          onClick={() => pauseDownload(dl.id)} 
                          className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors"
                          title="Pause"
                        >
                          <Pause className="w-5 h-5 fill-current" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => resumeDownload(dl.id)} 
                          className="w-12 h-12 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors"
                          title="Resume"
                        >
                          <Play className="w-5 h-5 fill-current" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => cancelDownload(dl.id)} 
                        className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar / Error Message */}
                  <div className="mt-5 space-y-2">
                    {isError ? (
                      <div className="flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/30">
                        <AlertCircle className="w-4 h-4" />
                        {dl.errorMessage || "An error occurred during download"}
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                          <span className={dl.status === "paused" ? "text-amber-500" : "text-indigo-600 dark:text-indigo-400"}>
                            {dl.status === "paused" ? "Paused" : "Downloading..."}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">{Math.round(dl.progress)}%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${dl.progress}%` }}
                            transition={{ ease: "easeOut" }}
                            className={`h-full relative overflow-hidden ${
                              dl.status === "paused" ? "bg-amber-500" : "bg-gradient-to-r from-indigo-500 to-violet-500"
                            }`}
                          >
                            {/* Shimmer effect for active downloads */}
                            {dl.status === "downloading" && (
                              <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-[translateX_2s_infinite]" style={{ width: '50px', transform: 'translateX(-100%) skewX(-12deg)' }}></div>
                            )}
                          </motion.div>
                        </div>
                      </>
                    )}
                  </div>
                  
                </div>
              </motion.div>
            )})}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
