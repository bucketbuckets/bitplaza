import type { Metadata, Viewport } from "next";
import { Marcellus, Public_Sans } from "next/font/google";

import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { AnalyticsProvider } from "@/lib/analytics/provider";
import { SITE } from "@/content/site";

/**
 * Display: an inscriptional roman — the letterform tradition of carved civic
 * lettering. Warm and formal at once, and one weight only, a constraint that
 * keeps it an event rather than a default.
 *
 * Body: the US federal government's public-service typeface. Chosen for what it
 * is as much as for how it looks; this is a page about public space.
 *
 * Both are self-hosted by next/font at build time, so no request ever leaves
 * for a font CDN. That matters here beyond performance — a third-party font
 * request is a third-party log entry, which would contradict what /data says.
 */
const display = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: "swap",
});

const body = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
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
    { media: "(prefers-color-scheme: light)", color: "#e9ecf2" },
    { media: "(prefers-color-scheme: dark)", color: "#101826" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full`}
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
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-pill focus:bg-primary focus:px-5 focus:py-3 focus:text-on-primary"
        >
          Skip to content
        </a>
        <AnalyticsProvider>
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
