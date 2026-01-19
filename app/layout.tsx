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

export const metadata: Metadata = {
  title: "Christian Life Center | Registration & Attendance",
  description: "Official registration and attendance system for Christian Life Center Tagum City.",
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
