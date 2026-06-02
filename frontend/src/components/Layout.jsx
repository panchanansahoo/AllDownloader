import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, DownloadCloud, Folder, Settings, Video, Music, Activity, Image as ImageIcon, Scissors, Layers, Smartphone, MoreHorizontal } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function Layout({ children, currentTab, setCurrentTab }) {
  const { darkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "audio", label: "Audio", icon: Music },
    { id: "story", label: "Story", icon: Smartphone },
    { id: "trim", label: "Trim", icon: Scissors },
    { id: "bulk", label: "Bulk", icon: Layers },
    { id: "thumbnail", label: "Cover", icon: ImageIcon },
    { id: "downloads", label: "Active", icon: DownloadCloud },
    { id: "library", label: "Library", icon: Folder },
    { id: "stats", label: "Stats", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Mobile nav grouping
  const primaryMobileTabs = ["home", "downloads", "library", "settings"];
  const extraMobileTabs = tabs.filter(t => !primaryMobileTabs.includes(t.id));

  const handleMobileTabClick = (id) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark' : ''} bg-slate-50 dark:bg-[#0B0F19]`}>
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 relative overflow-hidden">
             {/* Micro-interaction: subtle shine */}
             <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
             <Video className="text-white w-5 h-5 relative z-10" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            VidDrop
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 relative ${
                  isActive 
                    ? "text-indigo-600 dark:text-indigo-400 font-medium" 
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicatorDesktop"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? "opacity-100" : "opacity-70"}`} />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative z-10">
        {/* Animated Blob Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          {/* Subtle Noise Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
        </div>

        {children}
      </main>

      {/* Mobile Floating Bottom Nav & Extra Tools Menu */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex flex-col gap-3">
        
        {/* Extra Tools Popup */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="glass rounded-[2rem] p-4 shadow-2xl flex flex-wrap gap-2 justify-center border border-slate-200/50 dark:border-white/10"
            >
              {extraMobileTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleMobileTabClick(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300" 
                        : "bg-white/50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary Bottom Bar */}
        <div className="glass rounded-[2rem] p-2 flex justify-between items-center shadow-2xl gap-1 border border-slate-200/50 dark:border-white/10">
          
          {/* Render Primary Tabs */}
          {tabs.filter(t => primaryMobileTabs.includes(t.id)).map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleMobileTabClick(tab.id)}
                className={`relative flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-colors ${
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicatorMobile"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10 mb-1" />
                <span className="text-[10px] font-medium relative z-10">{tab.label}</span>
              </button>
            );
          })}
          
          {/* Render "More" Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`relative flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-colors ${
              mobileMenuOpen || extraMobileTabs.some(t => t.id === currentTab) ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {(mobileMenuOpen || extraMobileTabs.some(t => t.id === currentTab)) && !primaryMobileTabs.includes(currentTab) && (
              <motion.div
                layoutId="activeTabIndicatorMobile"
                className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <MoreHorizontal className="w-5 h-5 relative z-10 mb-1" />
            <span className="text-[10px] font-medium relative z-10">More Tools</span>
          </button>
          
        </div>
      </div>
    </div>
  );
}
