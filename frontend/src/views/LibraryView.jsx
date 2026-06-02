import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, PlayCircle, Clock, Trash2, Library } from "lucide-react";
import { useDownload } from "../contexts/DownloadContext";

export default function LibraryView() {
  const { library, removeFromLibrary } = useDownload();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Media Library</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your downloaded collection.</p>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {library.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center rounded-[2.5rem] glass-panel p-16 text-center border-dashed"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <Library className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Your library is empty</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              Downloaded files will automatically appear here once they finish.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            <AnimatePresence>
              {library.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    show: { opacity: 1, y: 0, scale: 1 }
                  }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                  whileHover={{ y: -8 }}
                  className="group relative rounded-[2rem] glass p-1 shadow-lg cursor-pointer"
                >
                  <div className="relative bg-white dark:bg-slate-900 rounded-[1.8rem] overflow-hidden">
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      {item.thumbnail ? (
                        <img 
                          src={item.thumbnail} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-60" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-10 h-10 text-slate-400" />
                        </div>
                      )}
                      
                      {/* Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <PlayCircle className="w-12 h-12 text-white drop-shadow-xl" />
                      </div>
                      
                      {/* Format Badge */}
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                        {item.format}
                      </div>
                    </div>
                    
                    {/* Info Container */}
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.duration || "N/A"}
                        </div>
                        <div>{item.size}</div>
                      </div>
                    </div>

                    {/* Delete Button (appears on hover) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromLibrary(item.id);
                      }}
                      className="absolute top-3 left-3 w-8 h-8 rounded-full bg-rose-500/90 text-white flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-rose-600 shadow-lg"
                      title="Remove from Library"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
