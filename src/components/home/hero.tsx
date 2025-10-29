"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden flex items-center bg-transparent pt-20 pb-12 min-h-fit">

      <div className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
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
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground"
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

            <motion.p 
              className="text-lg sm:text-xl leading-8 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Track how your contributions are used. Access real-time data on financial statements, 
              claims processing, member benefits, and more.
            </motion.p>

            <motion.div 
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                href="/financials"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span>📊 Incoming and Outgoing Funds</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image Placeholder */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl bg-muted border-2 border-dashed border-border overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-6xl">🏥</div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Image Placeholder
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Add your hero image here
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
