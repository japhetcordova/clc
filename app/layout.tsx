import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

import { Toaster } from "sonner";
import { TRPCProvider } from "@/lib/trpc/client";

const siteConfig = {
  name: "Christian Life Center Tagum City",
  description: "Official registration and attendance system for Christian Life Center Tagum City. A place to belong, grow, and serve.",
  url: "https://clctagum.com", // 
  ogImage: "/logo.webp", // Use logo for the rest
  keywords: [
    "Christian Life Center",
    "Christian Life Center Tagum City",
    "CLC Tagum",
    "christian life centr",
    "Church in Tagum",
    "Tagum City Church",
    "Christian Life Center Registration",
    "CLC Tagum Attendance",
    "Christian Life Center Tagum City Events",
    "CLC",
    "clc"
  ]
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "Christian Life Center Tagum" }],
  creator: "Christian Life Center Tagum",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  facebook: {
    appId: "637492048572910", // Placeholder ID to satisfy debugger (user should update if they have one)
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@clctagum",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  "name": "Christian Life Center Tagum City",
  "url": "https://clctagum.com",
  "logo": "https://clctagum.com/logo.webp",
  "image": "https://clctagum.com/church_architecture_exterior_1767400425687.webp",
  "description": "Official registration and attendance system for Christian Life Center Tagum City.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Cor. Sobrecary and Pioneer Streets",
    "addressLocality": "Tagum City",
    "addressRegion": "Davao del Norte",
    "postalCode": "8100",
    "addressCountry": "PH"
  },
  "telephone": "+63-916-461-3649",
  "openingHours": [
    "Su 08:00-12:00",
    "Su 14:00-16:00",
    "We 17:00-19:00",
    "Fr 18:00-20:00"
  ],
  "sameAs": [
    "https://www.facebook.com/clctagum",
    "https://www.instagram.com/clctagum",
    "https://www.youtube.com/@clctagum",
    "https://www.tiktok.com/@clctagum"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="flex-1">
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
