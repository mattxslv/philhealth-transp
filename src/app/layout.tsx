import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import { SkipToContent } from "@/components/ui/skip-to-content";
import ChatbotWidget from "@/components/chatbot/chatbot-widget";

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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
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
            <ToastProvider>
              <SidebarProvider>
                <Navbar />
                <main id="main-content" className="min-h-screen pt-16">{children}</main>
                <Footer />
                <ChatbotWidget />
              </SidebarProvider>
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

