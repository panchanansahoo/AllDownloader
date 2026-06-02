import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "../data/faqs";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Questions</span></h2>
        <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to know about VidDrop and its powerful new tools.</p>
      </div>
      <div className="space-y-4">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div 
              key={index} 
              className={`glass-panel border overflow-hidden transition-all duration-300 ${isOpen ? 'rounded-[2rem] border-indigo-200 dark:border-indigo-500/30' : 'rounded-2xl border-slate-200/50 dark:border-white/5'}`}
              layout
            >
              <button
                onClick={() => toggleOpen(index)}
                className="w-full px-6 py-5 flex items-center justify-between focus:outline-none bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors"
              >
                <h3 className={`text-left font-semibold transition-colors ${isOpen ? 'text-indigo-600 dark:text-indigo-400 text-lg' : 'text-slate-900 dark:text-slate-200'}`}>
                  {item.question}
                </h3>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-indigo-500' : 'text-slate-400'}`} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-400 leading-relaxed bg-white/50 dark:bg-slate-900/50">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

