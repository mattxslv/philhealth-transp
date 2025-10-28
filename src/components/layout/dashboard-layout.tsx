"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  DollarSign,
  Activity,
  ShieldCheck,
  MessageSquare,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Building2,
  ShoppingCart,
  Download,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useSidebar } from "@/contexts/sidebar-context";

const navigationGroups = [
  {
    label: "Overview",
    items: [
      { name: "Home", href: "/", icon: Home },
    ]
  },
  {
    label: "Financial Reports",
    items: [
      { name: "Financial Information", href: "/financials", icon: DollarSign },
      { name: "Procurement", href: "/procurement", icon: ShoppingCart },
    ]
  },
  {
    label: "Operational Data",
    items: [
      { name: "Claims", href: "/claims", icon: FileText },
      { name: "Coverage", href: "/coverage", icon: Activity },
      { name: "Facilities", href: "/facilities", icon: Building2 },
    ]
  },
  {
    label: "Governance",
    items: [
      { name: "Governance & Accountability", href: "/governance", icon: ShieldCheck },
      { name: "Public Engagement", href: "/engagement", icon: MessageSquare },
    ]
  },
  {
    label: "Downloads",
    items: [
      { name: "Annual Reports", href: "/downloads/annual-reports", icon: Download },
      { name: "Statistics & Charts", href: "/downloads/statistics", icon: BarChart3 },
    ]
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <>
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
          "fixed top-0 left-0 z-50 h-screen transform bg-gradient-to-b from-card to-card/95 border-r border-border transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-16" : "w-56",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Logo in Sidebar */}
          <div className="px-2 h-16 flex items-center justify-between gap-1 border-b border-border/50">
            {!sidebarCollapsed && (
              <Link href="/" className="flex items-center gap-2 flex-1 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">PH</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold truncate">PhilHealth</span>
                  <span className="text-xs text-muted-foreground truncate">Transparency</span>
                </div>
              </Link>
            )}
            
            {/* Collapse/Expand toggle button - desktop only */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                "hidden lg:flex items-center justify-center h-8 w-8 rounded hover:bg-primary/10 transition-colors flex-shrink-0",
                sidebarCollapsed && "mx-auto"
              )}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="text-lg font-semibold">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-2 hover:bg-accent"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4" role="navigation" aria-label="Dashboard navigation">
            <div className="space-y-6">
              {navigationGroups.map((group, groupIndex) => (
                <div key={group.label}>
                  {!sidebarCollapsed && (
                    <div className="px-3 mb-2">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {group.label}
                      </h3>
                    </div>
                  )}
                  {groupIndex > 0 && sidebarCollapsed && (
                    <div className="my-3 border-t border-border/50" />
                  )}
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                            sidebarCollapsed && "justify-center px-2"
                          )}
                          onClick={() => setSidebarOpen(false)}
                          title={sidebarCollapsed ? item.name : undefined}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                          {!sidebarCollapsed && (
                            <span className="break-words whitespace-normal leading-tight">{item.name}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300 pt-16",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-56"
        )}
      >
        {/* Page content */}
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-2">{children}</div>
      </div>
    </>
  );
}
