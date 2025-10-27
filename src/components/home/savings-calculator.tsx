"use client";

import { useState } from "react";
import { Calculator, PiggyBank, ArrowRight } from "lucide-react";

export function SavingsCalculator() {
  const [hospitalType, setHospitalType] = useState<"government" | "private">("government");
  const [procedure, setProcedure] = useState("normal-delivery");
  const [savings, setSavings] = useState<number | null>(null);

  const procedures = {
    "normal-delivery": {
      name: "Normal Delivery",
      government: { total: 25000, philhealth: 15000 },
      private: { total: 60000, philhealth: 15000 }
    },
    "cesarean": {
      name: "Cesarean Section",
      government: { total: 45000, philhealth: 28000 },
      private: { total: 120000, philhealth: 28000 }
    },
    "cataract": {
      name: "Cataract Surgery",
      government: { total: 35000, philhealth: 16000 },
      private: { total: 80000, philhealth: 16000 }
    },
    "dialysis": {
      name: "Hemodialysis (per session)",
      government: { total: 2800, philhealth: 2600 },
      private: { total: 4500, philhealth: 2600 }
    },
    "pneumonia": {
      name: "Pneumonia Treatment",
      government: { total: 30000, philhealth: 18000 },
      private: { total: 75000, philhealth: 18000 }
    }
  };

  const calculateSavings = () => {
    const selected = procedures[procedure as keyof typeof procedures];
    const coverage = selected[hospitalType].philhealth;
    setSavings(coverage);
  };

  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Calculator className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Interactive Tool</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              How Much Can You Save?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              See how much PhilHealth can save you on common medical procedures
            </p>
          </div>

          {/* Calculator Card */}
          <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 sm:p-8 shadow-xl">
            <div className="space-y-6">
              {/* Procedure Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  What medical procedure?
                </label>
                <select
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {Object.entries(procedures).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hospital Type */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Which hospital type?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setHospitalType("government")}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      hospitalType === "government"
                        ? "border-primary bg-primary text-white shadow-md"
                        : "border-border bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    Government Hospital
                  </button>
                  <button
                    onClick={() => setHospitalType("private")}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      hospitalType === "private"
                        ? "border-primary bg-primary text-white shadow-md"
                        : "border-border bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    Private Hospital
                  </button>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateSavings}
                className="w-full rounded-lg bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                Calculate Savings <ArrowRight className="h-5 w-5" />
              </button>

              {/* Results */}
              {savings !== null && (
                <div className="mt-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 p-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                      <PiggyBank className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      Your Savings:
                    </h3>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-4xl sm:text-5xl font-bold text-green-600 dark:text-green-400">
                      ₱{savings.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PhilHealth coverage for{" "}
                      {procedures[procedure as keyof typeof procedures].name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-4 italic">
                      *Actual coverage may vary based on your membership type and hospital accreditation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Not a member yet? <a href="https://memberinquiry.philhealth.gov.ph/member/" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">Register now!</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
