"use client";

import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 text-9xl font-bold text-primary">404</div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Page Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. The page may have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

