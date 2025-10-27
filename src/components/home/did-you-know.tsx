"use client";

import { useState, useEffect } from "react";
import { Lightbulb, TrendingUp, Users, Building2 } from "lucide-react";

const facts = [
  {
    icon: Users,
    fact: "PhilHealth covers 52.4M Filipinos",
    context: "That's like filling the entire Metro Manila 4 times over!",
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: TrendingUp,
    fact: "127.5 billion pesos in benefits paid this year",
    context: "Enough to build 127,500 classrooms or 2,550 hospitals!",
    color: "text-green-600 dark:text-green-400"
  },
  {
    icon: Building2,
    fact: "2.3M families helped every month",
    context: "Imagine filling up 46 Araneta Coliseums with grateful families!",
    color: "text-purple-600 dark:text-purple-400"
  },
  {
    icon: Lightbulb,
    fact: "Claims approved in just 12 days on average",
    context: "Much faster than traditional government permit processing!",
    color: "text-orange-600 dark:text-orange-400"
  },
  {
    icon: Users,
    fact: "94.3% approval rate for valid claims",
    context: "Almost everyone who files properly gets approved. That's transparency!",
    color: "text-primary dark:text-primary"
  }
];

export function DidYouKnow() {
  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length);
    }, 5000); // Change fact every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const fact = facts[currentFact];
  const Icon = fact.icon;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-primary/5 via-blue-50/50 to-purple-50/50 dark:from-primary/10 dark:via-blue-950/20 dark:to-purple-950/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-lg">
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-full bg-primary/10 p-3">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Did You Know?
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className={`flex-shrink-0 rounded-full bg-gradient-to-br from-primary/10 to-transparent p-4`}>
                <Icon className={`h-12 w-12 sm:h-16 sm:w-16 ${fact.color}`} />
              </div>

              <div className="flex-1 space-y-3">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                  {fact.fact}
                </p>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {fact.context}
                </p>
              </div>
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {facts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFact(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentFact 
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Show fact ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
