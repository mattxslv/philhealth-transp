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
              className="text-sm font-medium text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Transparency for All Filipinos
            </motion.p>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-foreground">
                PhilHealth
              </span>
              <br />
              <span className="text-primary">
                Transparency Portal
              </span>
            </motion.h1>

            {/* Navigation Buttons */}
            <motion.div 
              className="flex gap-3 pt-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <button
                onClick={() => document.getElementById('fund-performance')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span>Fund Performance Overview</span>
              </button>
              <button
                onClick={() => document.getElementById('nationwide-coverage')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span>PhilHealth Nationwide Coverage</span>
              </button>
              <button
                onClick={() => document.getElementById('incoming-outgoing-funds')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span>Incoming and Outgoing Funds</span>
              </button>
            </motion.div>

            <motion.p 
              className="text-lg sm:text-xl leading-8 text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
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
