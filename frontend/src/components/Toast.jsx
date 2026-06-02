import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Toast({ toast }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none w-full max-w-sm px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, scale: 0.9, filter: "blur(4px)" }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
            className={`flex items-center gap-3 p-3 pr-5 rounded-full shadow-2xl glass border pointer-events-auto mx-auto w-fit ${
              toast.type === "error" 
                ? "bg-rose-50/80 dark:bg-rose-950/80 border-rose-200 dark:border-rose-900 shadow-rose-500/10" 
                : "bg-emerald-50/80 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-900 shadow-emerald-500/10"
            }`}
          >
            {toast.type === "error" ? (
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            )}
            <p className={`text-sm font-medium ${toast.type === "error" ? "text-rose-900 dark:text-rose-200" : "text-emerald-900 dark:text-emerald-200"}`}>
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
