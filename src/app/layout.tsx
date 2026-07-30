import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { AttributionCapture } from "@/components/attribution/attribution-capture";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { AnalyticsProvider } from "@/lib/analytics/provider";
import { SITE } from "@/content/site";

/**
 * Type. design.md §9.
 *
 * Display: Bricolage Grotesque. Contemporary and genuinely unconventional, with
 * variable weight, width and optical-size axes. The WIDTH axis is the point —
 * expanded display type is what makes the hero read as signage rather than as a
 * headline, and no other free face offers it.
 *
 * Body: Geist. Highly readable small, neutral enough to carry long copy without
 * fighting the display face.
 *
 * Utility: Geist Mono. The open-source voice — labels, counts, and anywhere the
 * machinery is deliberately visible.
 *
 * All three self-hosted by next/font at build time, so no request ever leaves
 * for a font CDN. That matters beyond performance: a third-party font request is
 * a third-party log entry, which would contradict what /data says.
 */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  // The full width range, so the hero can go expanded and the wordmark with it.
  axes: ["opsz", "wdth"],
});

const body = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name}: ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}: ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  // Both are declared so the browser chrome matches the ground in either theme.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf8f1" },
    { media: "(prefers-color-scheme: dark)", color: "#17120f" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Must run before first paint. Anything React-based flashes the wrong
            theme on every load for people who chose dark. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />

      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-pill focus:bg-apricot focus:px-5 focus:py-3 focus:text-[#1a1310]"
        >
          Skip to content
        </a>
        <AnalyticsProvider>
          {/* Reads ?ref and utm_* into sessionStorage on first load, so a
              referral survives the scroll to the form without a cookie. */}
          <AttributionCapture />
          <RevealObserver />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
