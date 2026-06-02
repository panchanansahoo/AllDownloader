import React from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Settings as SettingsIcon, Monitor, HardDrive, Trash2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useDownload } from "../contexts/DownloadContext";

export default function SettingsView({ setToast }) {
  const { darkMode, toggleTheme } = useTheme();
  const { clearLibrary } = useDownload();

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your download history?")) {
      clearLibrary();
      if (setToast) setToast({ type: "success", message: "Download history cleared." });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Customize your VidDrop experience.</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Appearance Settings */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] glass p-1 shadow-lg"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-[1.8rem] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Appearance</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Theme Preference</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Toggle between Light and Dark mode.</p>
              </div>
              
              <div className="flex bg-slate-200/50 dark:bg-slate-950 p-1 rounded-xl w-fit">
                <button
                  onClick={() => darkMode && toggleTheme()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${!darkMode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
                <button
                  onClick={() => !darkMode && toggleTheme()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${darkMode ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Moon className="w-4 h-4" /> Dark
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Data & Storage Settings */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[2rem] glass p-1 shadow-lg"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-[1.8rem] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data & Storage</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Download Location</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Due to browser security, files are saved directly to your default system downloads folder.</p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-slate-200/50 dark:bg-slate-950 text-sm font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                  System Default
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30">
                <div className="flex-1">
                  <h3 className="font-semibold text-rose-900 dark:text-rose-100">Clear Library History</h3>
                  <p className="text-sm text-rose-700/70 dark:text-rose-200/50 mt-1">Remove all downloaded items from your Library view.</p>
                </div>
                <button
                  onClick={handleClearHistory}
                  className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" /> Clear History
                </button>
              </div>
            </div>

          </div>
        </motion.section>

      </div>
    </div>
  );
}
