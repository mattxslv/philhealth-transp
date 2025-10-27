import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import { SkipToContent } from "@/components/ui/skip-to-content";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://philhealth-transp.vercel.app'),
  title: {
    default: "PhilHealth Transparency Portal",
    template: "%s | PhilHealth Transparency Portal",
  },
  description: "Official transparency and accountability portal for PhilHealth - Providing public access to financial records, claims data, and governance information.",
  keywords: ["PhilHealth", "transparency", "healthcare", "government", "Philippines", "financial reports", "claims data", "governance", "public engagement"],
  authors: [{ name: "PhilHealth" }],
  creator: "PhilHealth",
  publisher: "PhilHealth",
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://philhealth-transp.vercel.app",
    title: "PhilHealth Transparency Portal",
    description: "Official transparency and accountability portal for PhilHealth - Providing public access to financial records, claims data, and governance information.",
    siteName: "PhilHealth Transparency Portal",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhilHealth Transparency Portal",
    description: "Official transparency and accountability portal for PhilHealth - Providing public access to financial records, claims data, and governance information.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`}>
        <SkipToContent />
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <Navbar />
              <main id="main-content" className="min-h-screen">{children}</main>
              <Footer />
            </SidebarProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
