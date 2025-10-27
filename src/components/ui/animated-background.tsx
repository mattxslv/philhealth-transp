"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedBackgroundProps {
  images?: string[];
  interval?: number;
  overlay?: boolean;
}

export function AnimatedBackground({ 
  images = [
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80", // Medical team
    "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1920&q=80", // Hospital
    "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?w=1920&q=80", // Healthcare
    "https://images.unsplash.com/photo-1551601651-05656d2ecfb4?w=1920&q=80", // Medical care
  ],
  interval = 8000,
  overlay = true 
}: AnimatedBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => (
        <motion.div
          key={image}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${image})` }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: currentIndex === index ? 1 : 0,
            scale: currentIndex === index ? 1 : 1.1,
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      ))}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      )}
    </div>
  );
}
