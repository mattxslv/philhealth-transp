"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/sidebar-context";
import { GlobalSearch } from "@/components/ui/global-search";

// Main PhilHealth website navigation links
const navigation = [
  { name: "About Us", href: "https://www.philhealth.gov.ph/about_us/", external: true },
  { name: "Members", href: "https://www.philhealth.gov.ph/members/", external: true },
  { name: "Partners", href: "https://www.philhealth.gov.ph/partners/", external: true },
  { name: "Online Services", href: "https://www.philhealth.gov.ph/services/", external: true },
  { 
    name: "Downloads", 
    dropdown: true,
    items: [
      { name: "Annual Reports", href: "/downloads/annual-reports", external: false },
      { name: "Statistics & Charts", href: "/downloads/statistics", external: false },
      { name: "Other Downloads", href: "https://www.philhealth.gov.ph/downloads/", external: true },
    ]
  },
  { name: "Transparency", href: "/", external: false },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const downloadsRef = useRef<HTMLDivElement>(null);
  const { sidebarCollapsed, setSidebarOpen } = useSidebar();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (downloadsRef.current && !downloadsRef.current.contains(event.target as Node)) {
        setDownloadsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-sm">
      <nav 
        className={cn(
          "flex items-center justify-between p-4 transition-all duration-300",
          "lg:px-8",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-56"
        )}
        aria-label="Global"
      >
        {/* Mobile - hamburger on left, search and theme on right */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 hover:bg-primary/10 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile center spacer */}
        <div className="flex-1 lg:hidden" />

        <div className="flex lg:hidden gap-3">
          <GlobalSearch />
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 hover:bg-primary/10 transition-colors relative"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
        </div>

        {/* Centered navigation - Desktop only */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-6">
          {navigation.map((item) => {
            // Handle dropdown items
            if (item.dropdown && item.items) {
              const isActive = item.items.some(subItem => !subItem.external && pathname === subItem.href);
              
              return (
                <div key={item.name} className="relative" ref={downloadsRef}>
                  <button
                    onClick={() => setDownloadsOpen(!downloadsOpen)}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      downloadsOpen && "rotate-180"
                    )} />
                  </button>
                  
                  {downloadsOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                      {item.items.map((subItem) => (
                        subItem.external ? (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                            onClick={() => setDownloadsOpen(false)}
                          >
                            {subItem.name}
                          </a>
                        ) : (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "block px-4 py-2 text-sm hover:bg-accent transition-colors",
                              pathname === subItem.href ? "text-primary bg-accent" : "text-muted-foreground hover:text-primary"
                            )}
                            onClick={() => setDownloadsOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            
            const isActive = !item.external && pathname === item.href;
            
            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.name}
                </a>
              );
            }
            
            return (
              <Link
                key={item.name}
                href={item.href!}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        
        {/* Right section - search and theme toggle */}
        <div className="hidden lg:flex lg:justify-end lg:gap-3 lg:items-center">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Last updated: December 31, 2023
          </span>
          <GlobalSearch />
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 hover:bg-primary/10 transition-colors relative"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-xl">PH</span>
                </div>
                <span className="text-lg font-semibold">PhilHealth</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-foreground"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => {
                    // Handle dropdown items in mobile
                    if (item.dropdown && item.items) {
                      const isActive = item.items.some(subItem => !subItem.external && pathname === subItem.href);
                      
                      return (
                        <div key={item.name} className="space-y-1">
                          <div className={cn(
                            "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7",
                            isActive ? "text-primary" : "text-foreground"
                          )}>
                            {item.name}
                          </div>
                          <div className="ml-4 space-y-1">
                            {item.items.map((subItem) => (
                              subItem.external ? (
                                <a
                                  key={subItem.name}
                                  href={subItem.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-primary"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {subItem.name}
                                </a>
                              ) : (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className={cn(
                                    "block rounded-lg px-3 py-2 text-sm hover:bg-accent",
                                    pathname === subItem.href ? "text-primary bg-accent" : "text-muted-foreground hover:text-primary"
                                  )}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {subItem.name}
                                </Link>
                              )
                            ))}
                          </div>
                        </div>
                      );
                    }
                    
                    const isActive = !item.external && pathname === item.href;
                    
                    if (item.external) {
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </a>
                      );
                    }
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href!}
                        className={cn(
                          "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-accent",
                          isActive ? "text-primary bg-accent" : "text-foreground"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
                <div className="py-6">
                  <button
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark");
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold hover:bg-accent"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-5 w-5" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
