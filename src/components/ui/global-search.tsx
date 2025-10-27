"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, FileText, DollarSign, Users, Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SearchResult {
  title: string;
  description: string;
  url: string;
  category: string;
  icon: typeof FileText;
}

const searchableContent: SearchResult[] = [
  // Financial
  { title: "Financial Information", description: "Annual financial statements and reports", url: "/financials", category: "Financial", icon: DollarSign },
  { title: "Annual Reports", description: "View annual financial reports", url: "/financials#reports", category: "Financial", icon: FileText },
  { title: "Budget Allocation", description: "Government budget allocation details", url: "/financials#budget", category: "Financial", icon: DollarSign },
  
  // Claims
  { title: "Claims Data", description: "Claims processing statistics and analytics", url: "/claims", category: "Operational", icon: FileText },
  { title: "Claim Status", description: "Check claim status and processing times", url: "/claims#status", category: "Operational", icon: FileText },
  
  // Coverage
  { title: "Member Coverage", description: "Coverage statistics and member data", url: "/coverage", category: "Operational", icon: Users },
  { title: "Coverage by Region", description: "Regional coverage breakdown", url: "/coverage#regional", category: "Operational", icon: Users },
  
  // Facilities
  { title: "Accredited Facilities", description: "List of accredited healthcare facilities", url: "/facilities", category: "Operational", icon: Building2 },
  { title: "Hospitals", description: "Accredited hospitals directory", url: "/facilities#hospitals", category: "Operational", icon: Building2 },
  
  // Procurement
  { title: "Procurement Contracts", description: "Government procurement contracts and bids", url: "/procurement", category: "Financial", icon: DollarSign },
  { title: "Contract Awards", description: "Awarded contracts and contractors", url: "/procurement#awards", category: "Financial", icon: DollarSign },
  
  // Governance
  { title: "Governance & Accountability", description: "Board meetings, reports, and policies", url: "/governance", category: "Governance", icon: ShieldCheck },
  { title: "Board Meetings", description: "Minutes and summaries of board meetings", url: "/governance#meetings", category: "Governance", icon: ShieldCheck },
  { title: "Executive Compensation", description: "Salaries and benefits of executives", url: "/governance#compensation", category: "Governance", icon: DollarSign },
  
  // Engagement
  { title: "Public Engagement", description: "Complaints, feedback, and policy updates", url: "/engagement", category: "Engagement", icon: Users },
  { title: "File a Complaint", description: "Submit feedback or complaints", url: "/engagement#complaints", category: "Engagement", icon: FileText },
  { title: "Policy Updates", description: "Latest policy changes and updates", url: "/engagement#policies", category: "Engagement", icon: FileText },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = searchableContent.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered.slice(0, 8));
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          <div className="fixed left-1/2 top-20 w-full max-w-2xl -translate-x-1/2 px-4 z-[10000]">
            <div ref={searchRef} className="rounded-lg border border-border bg-card shadow-2xl">
              {/* Search Input */}
              <div className="flex items-center border-b border-border px-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for financial data, claims, coverage, facilities..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1 hover:bg-accent transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Search Results */}
              {query.trim() !== "" && (
                <div className="max-h-96 overflow-y-auto p-2">
                  {results.length > 0 ? (
                    <div className="space-y-1">
                      {results.map((result, index) => {
                        const Icon = result.icon;
                        return (
                          <Link
                            key={index}
                            href={result.url}
                            onClick={handleResultClick}
                            className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors"
                          >
                            <div className="mt-1 rounded-lg bg-primary/10 p-2">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground">{result.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {result.description}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {result.category}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      No results found for "{query}"
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              {query.trim() === "" && (
                <div className="p-4">
                  <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
                    Quick Links
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/financials"
                      onClick={handleResultClick}
                      className="flex items-center gap-2 rounded-md p-2 hover:bg-accent transition-colors"
                    >
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-sm">Financial Data</span>
                    </Link>
                    <Link
                      href="/claims"
                      onClick={handleResultClick}
                      className="flex items-center gap-2 rounded-md p-2 hover:bg-accent transition-colors"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm">Claims</span>
                    </Link>
                    <Link
                      href="/facilities"
                      onClick={handleResultClick}
                      className="flex items-center gap-2 rounded-md p-2 hover:bg-accent transition-colors"
                    >
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">Facilities</span>
                    </Link>
                    <Link
                      href="/governance"
                      onClick={handleResultClick}
                      className="flex items-center gap-2 rounded-md p-2 hover:bg-accent transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span className="text-sm">Governance</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
