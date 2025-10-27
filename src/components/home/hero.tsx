"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 pt-16 sm:pt-20 lg:pt-24 min-h-[600px] flex items-center">
      {/* Animated Background */}
      <AnimatedBackground 
        images={[
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80", // Medical team
          "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1920&q=80", // Hospital corridor
          "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1920&q=80", // Healthcare facility
          "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1920&q=80", // Medical professionals
        ]}
        interval={6000}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transparency for All Filipinos
          </motion.h1>
          <motion.p 
            className="mt-2 text-xl sm:text-2xl font-semibold text-primary-foreground drop-shadow-md bg-primary/90 inline-block px-6 py-2 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            PhilHealth Transparency Portal
          </motion.p>
          <motion.p 
            className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-white px-2 drop-shadow-lg backdrop-blur-sm bg-black/20 py-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Curious where your contributions go? Want to know how we use the funds? 
            You're in the right place! View comprehensive data—from financial reports to claims processing. 
            <span className="font-semibold text-primary-foreground"> Nothing hidden, everything open!</span>
          </motion.p>
          <motion.div 
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link
              href="/financials"
              className="w-full sm:w-auto rounded-md bg-primary px-6 py-3 sm:py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary text-center min-h-[44px] flex items-center justify-center transform hover:scale-105"
            >
              View Financial Data
            </Link>
            <Link
              href="/engagement"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold leading-6 text-white hover:text-primary-foreground transition-colors min-h-[44px] bg-white/10 backdrop-blur-sm px-6 py-3 rounded-md hover:bg-white/20"
            >
              Contact Us <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
