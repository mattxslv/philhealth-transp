"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";

export function Footer() {
  const { sidebarCollapsed } = useSidebar();
  
  return (
    <footer className={cn(
      "bg-muted/50 dark:bg-muted/20 text-foreground transition-all duration-300",
      sidebarCollapsed ? "lg:ml-16" : "lg:ml-56"
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">About PhilHealth</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Philippine Health Insurance Corporation (PhilHealth) is committed to transparency and accountability in delivering quality healthcare services to all Filipinos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/financials" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block py-1">
                  Financial Reports
                </Link>
              </li>
              <li>
                <Link href="/claims" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block py-1">
                  Claims Data
                </Link>
              </li>
              <li>
                <Link href="/governance" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block py-1">
                  Governance
                </Link>
              </li>
              <li>
                <Link href="/engagement" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block py-1">
                  Public Engagement
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block py-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block py-1">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block py-1">
                  Data Protection
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block py-1">
                  Freedom of Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 sm:gap-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 text-primary" />
                <a href="tel:+6284417442" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  (02) 8441-7442
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 text-primary" />
                <a href="mailto:transparency@philhealth.gov.ph" className="text-sm text-muted-foreground hover:text-primary transition-colors break-all">
                  transparency@philhealth.gov.ph
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  Citystate Centre, 709 Shaw Boulevard, Pasig City, Philippines 1600
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Logos */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Left: Bagong Pilipinas Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                <Image
                  src="/images/bagong-pilipinas-logo.png"
                  alt="Bagong Pilipinas"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right: DICT Logo with "DEVELOPED BY:" */}
            <div className="flex flex-col items-center sm:items-end gap-2">
              <p className="text-xs font-semibold text-foreground">DEVELOPED BY:</p>
              <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                <Image
                  src="/images/DICT-Logo-icon_only.png"
                  alt="DICT"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Philippine Health Insurance Corporation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
