import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Spotlight from "@/components/ui/Spotlight";
import AIChatAssistant from "@/components/ui/AIChatAssistant";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Celestine Oche",
  description: "Educator turned AI Builder and Tech Entrepreneur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans bg-navy text-slate-400 antialiased selection:bg-teal-300/30 selection:text-teal-300`}
      >
        <Spotlight />
        {children}
        <AIChatAssistant />
      </body>
    </html>
  );
}
