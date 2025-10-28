"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log("Video autoplay prevented:", err);
      });
    }
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center bg-black pt-24 sm:pt-28 lg:pt-32">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-50"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23059669'/%3E%3Cstop offset='50%25' style='stop-color:%230f766e'/%3E%3Cstop offset='100%25' style='stop-color:%231e40af'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg)'/%3E%3C/svg%3E"
        >
          <source
            src="/images/background.mp4"
            type="video/mp4"
          />
          {/* Fallback sources in case the local video doesn't work */}
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      
      {/* Beautiful gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-teal-800/50 to-blue-900/60 dark:from-emerald-950/70 dark:via-teal-900/60 dark:to-blue-950/70 z-[1]" />
      
      {/* Smooth bottom fade to background color */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-white dark:from-[hsl(0,0%,10%)] via-emerald-50/40 dark:via-[hsl(0,0%,10%)]/40 to-transparent z-[1]" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-[1]">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px'
             }} 
        />
        
        {/* Glowing Orbs */}
        <motion.div
          className="absolute top-32 right-20 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 left-16 w-24 h-24 bg-blue-500/25 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Subtle floating animated shapes */}
      <motion.div
        className="absolute top-20 left-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-2xl mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
              Transparency for
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 bg-clip-text text-transparent">
              All Filipinos
            </span>
          </motion.h1>

          <motion.div
            className="relative inline-block mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-lg opacity-50"></div>
            <p className="relative text-xl sm:text-2xl font-bold text-white px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full border border-emerald-400/30">
              PhilHealth Transparency Portal
            </p>
          </motion.div>

          <motion.p 
            className="mt-6 text-lg sm:text-xl leading-8 text-gray-200 max-w-3xl mx-auto backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Track how your contributions are used. Access real-time data on financial statements, 
            claims processing, member benefits, and more.
            <br />
            <span className="font-bold text-emerald-300 text-xl mt-2 block">
              🔍 Transparency you can trust.
            </span>
          </motion.p>

          <motion.div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/financials"
                className="group relative overflow-hidden w-full sm:w-auto rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:shadow-emerald-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 text-center min-h-[56px] flex items-center justify-center"
              >
                <span className="relative z-10">📊 View Financial Data</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/engagement"
                className="group w-full sm:w-auto flex items-center justify-center gap-3 text-lg font-bold text-white min-h-[56px] bg-white/10 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                <span>💬 Contact Us</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
