"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden flex items-center bg-transparent pt-20 pb-12 min-h-fit">

      <div className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Content */}
          <motion.div 
            className="space-y-6 w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p 
              className="text-sm font-medium text-white/80 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Transparency for All Filipinos
            </motion.p>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-white">
                PhilHealth
              </span>
              <br />
              <span className="text-white/90">
                Transparency Portal
              </span>
            </motion.h1>



            <motion.p 
              className="text-lg sm:text-xl leading-8 text-white/90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Track how your contributions are used. Access real-time data on financial statements, 
              claims processing, member benefits, and more.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
