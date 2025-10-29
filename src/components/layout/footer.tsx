"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";

export function Footer() {
  const { sidebarOpen } = useSidebar();
  
  return (
    <footer className="bg-muted/50 dark:bg-muted/20 text-foreground">
      <div className={cn(
        "px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-10 lg:py-12 transition-all duration-300",
        sidebarOpen ? "lg:ml-56" : "lg:ml-16"
      )}>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* PhilHealth Logo */}
          <div className="flex items-center justify-start lg:col-span-1">
            <Image
              src="/images/philhealth logo.png"
              alt="PhilHealth Logo"
              width={120}
              height={120}
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 object-contain"
            />
          </div>

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

        {/* Bottom Bar with Logos removed as requested */}

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
