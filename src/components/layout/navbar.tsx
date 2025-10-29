"use client";

import Link from "next/link";
import Image from "next/image";
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
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <nav 
        className={cn(
          "flex items-center p-4 transition-all duration-300",
          "lg:px-8",
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}
        aria-label="Global"
      >
        {/* Left section - Logo and hamburgers */}
        <div className="flex items-center gap-3 lg:gap-12 lg:flex-1">
          {/* Mobile hamburger for SIDEBAR - only show on mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden rounded-md p-2 hover:bg-primary/10 transition-colors"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Desktop: Text only when sidebar is open, Logo + Text when sidebar is closed */}
          {sidebarOpen ? (
            // Text only when sidebar is open
            <div className="hidden lg:flex flex-col">
              <span className="text-lg font-bold text-foreground">PhilHealth</span>
              <span className="text-sm text-muted-foreground">Transparency Portal</span>
            </div>
          ) : (
            // Logo + Text when sidebar is closed - with extra left margin
            <Link href="/" className="hidden lg:flex items-center gap-3 ml-16">
              <Image
                src="/images/philhealth logo.png"
                alt="PhilHealth Logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">PhilHealth</span>
                <span className="text-sm text-muted-foreground">Transparency Portal</span>
              </div>
            </Link>
          )}
          
          {/* Mobile: Logo + Text always */}
          <Link href="/" className="flex lg:hidden items-center gap-3">
            <Image
              src="/images/philhealth logo.png"
              alt="PhilHealth Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="text-base font-bold text-foreground">PhilHealth</span>
              <span className="text-xs text-muted-foreground">Transparency Portal</span>
            </div>
          </Link>
        </div>

        {/* Right section - Navigation links (Desktop only) */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-6 lg:flex-1 lg:justify-end">
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
          
          {/* Desktop only - Search and Theme toggle */}
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
                <Image
                  src="/images/philhealth logo.png"
                  alt="PhilHealth Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
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
                <div className="py-6">
                  <div className="text-xs text-muted-foreground mb-3">In partnership with</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
