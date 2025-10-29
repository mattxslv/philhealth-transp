"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useSidebar } from "@/contexts/sidebar-context";
import { useState } from "react";

const navigationGroups = [
  {
    label: "Financial Reports",
    items: [
      { name: "Financial Information", href: "/financials" },
      { name: "Procurement", href: "/procurement" },
    ]
  },
  {
    label: "Operational Data",
    items: [
      { name: "Claims", href: "/claims" },
      { name: "Coverage", href: "/coverage" },
      { name: "Facilities", href: "/facilities" },
    ]
  },
  {
    label: "Governance",
    items: [
      { name: "Governance & Accountability", href: "/governance" },
      { name: "Public Engagement", href: "/engagement" },
    ]
  },
  {
    label: "Documents",
    items: [
      { name: "Annual Reports", href: "/downloads/annual-reports" },
      { name: "Statistics & Charts", href: "/downloads/statistics" },
    ]
  },
];

// Navigation group component to isolate state
function NavigationGroup({ 
  group, 
  pathname, 
  handleLinkClick,
  isExpanded,
  toggleExpanded
}: { 
  group: typeof navigationGroups[0], 
  pathname: string, 
  handleLinkClick: (e: React.MouseEvent) => void,
  isExpanded: boolean,
  toggleExpanded: () => void
}) {
  return (
    <div className="space-y-1">
      {/* Group header - clickable */}
      <button
        onClick={toggleExpanded}
        className="group/button flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-muted-foreground"
        type="button"
      >
        <span>{group.label}</span>
        <span className="opacity-0 group-hover/button:opacity-100 transition-opacity duration-200">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </button>

      {/* Group items - show when expanded */}
      {isExpanded && (
        <div 
          className="ml-3 space-y-1 border-l-2 border-border pl-3"
          onClick={(e) => e.stopPropagation()}
        >
          {group.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-all duration-200",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                )}
                onClick={handleLinkClick}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, sidebarOpen, setSidebarOpen, expandedGroups, setExpandedGroups } = useSidebar();

  const toggleGroup = (label: string) => {
    setExpandedGroups(
      expandedGroups.includes(label)
        ? expandedGroups.filter(g => g !== label)
        : [...expandedGroups, label]
    );
  };

  // Close sidebar only on mobile when clicking a link
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger button - only shows on desktop when sidebar is closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:flex fixed top-4 left-4 z-[60] items-center justify-center h-10 w-10 rounded-lg hover:bg-primary/20 transition-all duration-300 mr-4"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 transform bg-background border-r border-border transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Top section with Logo and Hamburger */}
          <div className="px-3 py-3 flex items-center justify-between">
            {/* PhilHealth Logo - Only logo, no text */}
            <Link href="/" className="flex items-center" onClick={handleLinkClick}>
              <Image
                src="/images/philhealth logo.png"
                alt="PhilHealth Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </Link>
            
            {/* Hamburger button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-2 hover:bg-primary/20 transition-colors"
              aria-label="Close sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-3 pb-2" role="navigation" aria-label="Dashboard navigation">
            {/* Home link */}
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 mb-2 text-sm font-medium transition-all duration-200",
                pathname === "/"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
              onClick={handleLinkClick}
            >
              Home
            </Link>

            <div className="space-y-2">
              {navigationGroups.map((group) => (
                <NavigationGroup
                  key={group.label}
                  group={group}
                  pathname={pathname}
                  handleLinkClick={handleLinkClick}
                  isExpanded={expandedGroups.includes(group.label)}
                  toggleExpanded={() => toggleGroup(group.label)}
                />
              ))}
            </div>
          </nav>

          {/* Spacer to push partnership section down */}
          <div className="flex-1"></div>

          {/* Partnership Section */}
          <div className="px-4 py-6 border-t border-border/50">
            <div className="text-sm text-muted-foreground mb-4 font-medium text-center">In partnership with</div>
            <div className="flex items-center justify-center gap-6">
              <Image
                src="/images/DICT-Logo-icon_only.png"
                alt="DICT Logo"
                width={60}
                height={60}
                className="object-contain"
              />
              <Image
                src="/images/bagong-pilipinas-logo.png"
                alt="Bagong Pilipinas Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300 pt-[20px]",
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}
      >
        {/* Page content */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pb-4 sm:pb-6 lg:pb-8">{children}</div>
      </div>
    </>
  );
}
