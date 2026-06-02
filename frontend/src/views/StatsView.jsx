import React from "react";
import { motion } from "framer-motion";
import { Activity, Download, HardDrive, Zap, BarChart } from "lucide-react";
import { useDownload } from "../contexts/DownloadContext";

export default function StatsView() {
  const { library } = useDownload();
  
  // Calculate basic stats
  const totalDownloads = library.length;
  // Dummy sizes if we can't parse easily, otherwise sum them
  const totalSizeMB = library.reduce((acc, item) => {
    // Basic parse e.g. "45.2 MB" -> 45.2
    const match = item.size?.match(/([\d.]+)\s*(MB|GB)/i);
    if (match) {
      let val = parseFloat(match[1]);
      if (match[2].toUpperCase() === 'GB') val *= 1024;
      return acc + val;
    }
    return acc;
  }, 0);

  const formattedSize = totalSizeMB > 1024 
    ? (totalSizeMB / 1024).toFixed(2) + " GB"
    : totalSizeMB.toFixed(1) + " MB";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your VidDrop usage statistics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] glass p-1 shadow-lg"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-[1.8rem] p-6 h-full border border-slate-200/50 dark:border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Total Files Downloaded</h3>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">{totalDownloads}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[2rem] glass p-1 shadow-lg"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-[1.8rem] p-6 h-full border border-slate-200/50 dark:border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
              <HardDrive className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Total Data Saved</h3>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">{formattedSize}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[2rem] glass p-1 shadow-lg"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-[1.8rem] p-6 h-full border border-slate-200/50 dark:border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Status</h3>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">Premium</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-[2rem] glass p-1 shadow-lg"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-[1.8rem] p-8 border border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-3 mb-6">
             <BarChart className="w-6 h-6 text-slate-400" />
             <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
          </div>
          {library.length > 0 ? (
            <div className="space-y-4">
              {library.slice(0, 5).map((item, idx) => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                    {item.thumbnail && <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white truncate">{item.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.format.toUpperCase()} • {item.size}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              No recent activity found.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
