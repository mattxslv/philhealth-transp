"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
}

export function FAQSection({ faqs, title = "Frequently Asked Questions" }: FAQSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
              aria-expanded={expandedIndex === index}
            >
              <span className="font-medium pr-4">{faq.question}</span>
              {expandedIndex === index ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            
            {expandedIndex === index && (
              <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Pre-defined FAQ data for different sections
export const financialFAQs: FAQItem[] = [
  {
    question: "How to read PhilHealth's financial statements?",
    answer: "PhilHealth's financial statements follow government accounting standards. Total Assets represent what PhilHealth owns, Total Revenue shows income from contributions and investments, and Total Expenses include benefit payouts and operating costs. Net Income is the difference between revenue and expenses.",
    category: "financials"
  },
  {
    question: "What is included in Total Assets?",
    answer: "Total Assets include Current Assets (cash, investments, receivables) and Non-Current Assets (long-term investments, property, equipment, and intangible assets). These represent the total value of resources owned by PhilHealth.",
    category: "financials"
  },
  {
    question: "Why do expenses sometimes exceed revenue?",
    answer: "When benefit payouts exceed premium collections in a given period, it results in a deficit. PhilHealth uses reserves and investments to ensure continuous healthcare coverage for members.",
    category: "financials"
  },
  {
    question: "What are Premium Contributions?",
    answer: "Premium Contributions are payments made by members (Direct Contributors) or by the government on behalf of certain sectors (Indirect Contributors). These are the primary source of PhilHealth's revenue.",
    category: "financials"
  },
  {
    question: "Can I download this financial data?",
    answer: "Yes! Use the Export button at the top of the page to download data in CSV, JSON, or PDF format. You can also print the page for offline reference.",
    category: "financials"
  }
];

export const claimsFAQs: FAQItem[] = [
  {
    question: "What is the average claim processing time?",
    answer: "Claim processing times vary by type and completeness of documentation. On average, complete claims are processed within 60 days of submission. Complex cases may take longer.",
    category: "claims"
  },
  {
    question: "What are the most common claim types?",
    answer: "The most common claims include hospital confinements, outpatient consultations, and prescribed medications. Each claim type has specific benefit packages and requirements.",
    category: "claims"
  },
  {
    question: "Why are some claims denied?",
    answer: "Claims may be denied due to incomplete documentation, non-covered services, lapsed membership, or services not included in the benefit package. Members can appeal denied claims.",
    category: "claims"
  }
];

export const coverageFAQs: FAQItem[] = [
  {
    question: "Who is eligible for PhilHealth coverage?",
    answer: "All Filipino citizens are eligible for PhilHealth coverage. Membership categories include employed (private/government), informal sector, indigents, senior citizens, and sponsored members.",
    category: "coverage"
  },
  {
    question: "What is the difference between Direct and Indirect Contributors?",
    answer: "Direct Contributors pay their own premiums (employed and self-earning members). Indirect Contributors have their premiums paid by the government (indigents, senior citizens, sponsored programs).",
    category: "coverage"
  },
  {
    question: "How many Filipinos are covered by PhilHealth?",
    answer: "As of the latest data, PhilHealth covers over 108 million Filipinos across all membership categories, representing near-universal healthcare coverage.",
    category: "coverage"
  }
];
