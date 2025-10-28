"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/sidebar-context";
import { GlobalSearch } from "@/components/ui/global-search";

// Main PhilHealth website navigation links
const navigation = [
  { name: "About Us", href: "https://www.philhealth.gov.ph/about_us/", external: true },
  { name: "Members", href: "https://www.philhealth.gov.ph/members/", external: true },
  { name: "Partners", href: "https://www.philhealth.gov.ph/partners/", external: true },
  { name: "Online Services", href: "https://www.philhealth.gov.ph/services/", external: true },
  { name: "Downloads", href: "https://www.philhealth.gov.ph/downloads/", external: true },
  { name: "Transparency", href: "/", external: false },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { sidebarCollapsed, setSidebarOpen } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
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
                href={item.href}
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
                        href={item.href}
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
