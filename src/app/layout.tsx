import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BrandProvider } from "@/context/brand-context";
import { FilterProvider } from "@/context/filter-context";
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recomnd - AI Visibility Tracking (GEO/AEO)",
  description: "Comprehensive competitive benchmarking and generative perception for brands across AI models.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Google+Sans+Text:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-slate-900 bg-[#f8fafc]">
        <BrandProvider>
          <FilterProvider>
            <AppShell>{children}</AppShell>
          </FilterProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
