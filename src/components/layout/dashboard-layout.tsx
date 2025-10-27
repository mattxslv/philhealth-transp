"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  DollarSign,
  Activity,
  Users,
  Building2,
  FileCheck,
  ShieldCheck,
  MessageSquare,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useSidebar } from "@/contexts/sidebar-context";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Financials", href: "/financials", icon: DollarSign },
  { name: "Claims", href: "/claims", icon: Activity },
  { name: "Coverage", href: "/coverage", icon: Users },
  { name: "Facilities", href: "/facilities", icon: Building2 },
  { name: "Procurement", href: "/procurement", icon: FileCheck },
  { name: "Governance", href: "/governance", icon: ShieldCheck },
  { name: "Engagement", href: "/engagement", icon: MessageSquare },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <div className="flex min-h-screen">
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
          "fixed top-0 left-0 z-50 h-screen transform border-r border-border bg-card transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-16" : "w-56",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Logo in Sidebar */}
          <div className="px-2 py-3 h-16 flex items-center justify-between gap-1">
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
          <nav className="flex-1 space-y-1 px-2 py-4" role="navigation" aria-label="Dashboard navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                    sidebarCollapsed && "justify-center"
                  )}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-56"
        )}
      >
        {/* Mobile menu button */}
        <div className="sticky top-16 z-30 flex items-center gap-4 bg-background px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 hover:bg-accent"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Page content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
