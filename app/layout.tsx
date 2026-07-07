import type { Metadata, Viewport } from "next";
import { Sora, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://plugfolio.com"),
  title: "Plugfolio — Your content is about to become shoppable",
  description:
    "Plugfolio turns your reels, videos, and posts into a shoppable storefront — one link in your bio that turns content into product clicks, affiliate revenue, and brand deals. Get early access.",
  applicationName: "Plugfolio",
  keywords: [
    "link in bio",
    "shoppable content",
    "creator storefront",
    "affiliate revenue",
    "brand deals",
    "creator economy",
    "shoppable reels",
  ],
  category: "technology",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://plugfolio.com/" },
  openGraph: {
    type: "website",
    siteName: "Plugfolio",
    title: "Plugfolio — Your content is about to become shoppable",
    description:
      "One link in your bio that turns your content into product clicks, affiliate revenue, and brand deals. Get early access before launch.",
    url: "https://plugfolio.com/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plugfolio — content becomes shoppable",
    description:
      "One link in your bio that turns content into product clicks, affiliate revenue, and brand deals.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0C0A16",
};

// AEO/SEO structured data — helps search engines and answer engines
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://plugfolio.com/#organization",
      name: "Plugfolio",
      url: "https://plugfolio.com/",
      logo: "https://plugfolio.com/icon.png",
      description:
        "Plugfolio turns your reels, videos, and posts into a shoppable storefront — one link in your bio that turns content into product clicks, affiliate revenue, and brand deals.",
    },
    {
      "@type": "WebSite",
      "@id": "https://plugfolio.com/#website",
      name: "Plugfolio",
      url: "https://plugfolio.com/",
      publisher: { "@id": "https://plugfolio.com/#organization" },
    },
    {
      "@type": "WebPage",
      "@id": "https://plugfolio.com/#webpage",
      url: "https://plugfolio.com/",
      name: "Plugfolio — Your content is about to become shoppable",
      isPartOf: { "@id": "https://plugfolio.com/#website" },
      description:
        "One link in your bio that turns your content into product clicks, affiliate revenue, and brand deals. Get early access before launch.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${inter.variable} ${spaceMono.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
