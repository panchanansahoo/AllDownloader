import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 flex justify-center text-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 text-sm font-medium mb-6 ring-1 ring-indigo-500/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>The Ultimate Media Downloader</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white"
        >
          Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Anything.</span><br/>Anywhere.
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium"
        >
          Paste any link from YouTube, Twitter, Instagram or TikTok. Save the highest quality videos and audio directly to your device.
        </motion.p>
      </div>
    </div>
  );
}
