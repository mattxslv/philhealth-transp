"use client";

import { useState } from "react";
import { Heart, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const stories = [
  {
    name: "Maria Santos",
    location: "Quezon City",
    procedure: "Cesarean Delivery",
    savings: "28,000 pesos",
    quote: "I thought I couldn't afford treatment at a private hospital. Thanks to PhilHealth, I gave birth safely and we didn't worry about the bill. Such a huge help!",
    emoji: ""
  },
  {
    name: "Juan Dela Cruz",
    location: "Cebu City",
    procedure: "Heart Surgery",
    savings: "180,000 pesos",
    quote: "The operation was scary, but the bill was even scarier. But because of PhilHealth, most of it was covered. I'm alive because of you. Thank you so much!",
    emoji: ""
  },
  {
    name: "Rosa Reyes",
    location: "Davao City",
    procedure: "Cataract Surgery",
    savings: "16,000 pesos",
    quote: "I was 65 years old when I had my eye surgery. I thought it was too late, but thanks to PhilHealth, I can see again. I saw my grandchildren graduate!",
    emoji: ""
  },
  {
    name: "Pedro Villanueva",
    location: "Iloilo City",
    procedure: "Kidney Dialysis",
    savings: "10,400 pesos/month",
    quote: "I undergo dialysis three times a week. Without PhilHealth, I couldn't afford it. Because of their coverage, my life continues. Thank you for the transparency and fast claims!",
    emoji: ""
  },
  {
    name: "Nena Cruz",
    location: "Baguio City",
    procedure: "Pneumonia Treatment",
    savings: "18,000 pesos",
    quote: "I got pneumonia during the pandemic. I was scared, but the hospital said it was covered by PhilHealth. We didn't have to borrow money. Praise God and thank you PhilHealth!",
    emoji: ""
  }
];

export function SuccessStories() {
  const [currentStory, setCurrentStory] = useState(0);

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const story = stories[currentStory];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            <span className="text-sm font-semibold text-primary">Real Filipino Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Stories of Hope
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            True stories from real Filipinos who benefited from PhilHealth coverage
          </p>
        </div>

        {/* Story Card */}
        <div className="relative max-w-4xl mx-auto">
          <div className="rounded-2xl border-2 border-primary/20 bg-card p-8 sm:p-10 lg:p-12 shadow-2xl">
            {/* Decorative Quote */}
            <Quote className="absolute top-6 left-6 h-12 w-12 text-primary/10" />
            
            <div className="relative space-y-6">
              {/* Story Text */}
              <div className="text-center">
                <p className="text-xl font-semibold text-foreground mb-2">{story.name}</p>
                <p className="text-sm text-muted-foreground">{story.location}</p>
              </div>

              {/* Quote */}
              <blockquote className="text-lg sm:text-xl lg:text-2xl text-center text-foreground leading-relaxed italic">
                &ldquo;{story.quote}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="text-center space-y-2 pt-6 border-t border-border/50">
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                  <div className="px-4 py-2 bg-primary/10 rounded-full">
                    <p className="text-sm font-semibold text-primary">
                      {story.procedure}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                      Saved: {story.savings}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevStory}
              className="rounded-full border-2 border-primary bg-background p-3 hover:bg-primary hover:text-white transition-all shadow-md"
              aria-label="Previous story"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStory(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === currentStory
                      ? 'w-8 bg-primary'
                      : 'w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to story ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextStory}
              className="rounded-full border-2 border-primary bg-background p-3 hover:bg-primary hover:text-white transition-all shadow-md"
              aria-label="Next story"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Story Counter */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Story {currentStory + 1} of {stories.length}
          </p>
        </div>
      </div>
    </section>
  );
}
