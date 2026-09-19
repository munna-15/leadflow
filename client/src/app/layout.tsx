import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LeadFlow",
    template: "%s | LeadFlow",
  },

  description:
    "AI-powered lead management and follow-up system for modern businesses.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body
        className="min-h-screen bg-[#F7F8FA] text-[#111827] antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
