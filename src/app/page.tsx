"use client";

import React from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { HeroScanner } from "@/components/landing/hero-scanner";
import { DashboardWindowReplica } from "@/components/landing/dashboard-window-replica";
import { ProductTourTabs } from "@/components/landing/product-tour-tabs";
import { BentoGrid } from "@/components/landing/bento-grid";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { FinalCta } from "@/components/landing/final-cta";
import { EngineFavicon } from "@/components/ui/favicon";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Sticky SaaS-Styled Top Navbar */}
      <LandingNavbar />

      <main className="flex-1">
        {/* 2. Hero Section & Interactive Live Prompt Scanner */}
        <HeroScanner />

        {/* 3. Hero Centerpiece: Animated High-DPI Replica of Brand Insights Overview */}
        <section id="overview" className="pb-16 sm:pb-20 pt-4">
          <DashboardWindowReplica />
        </section>

        {/* Multi-Engine Telemetry Benchmarking Row */}
        <section className="border-y border-slate-200/80 bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-[11px] font-semibold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full uppercase">
                Enterprise Multi-Engine Telemetry
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-2.5">
                Continuously Benchmarked Across Every Major Answer Engine
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Engine 1: Perplexity */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 transition-all shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <EngineFavicon engine="perplexity" size={24} />
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    88/100
                  </span>
                </div>
                <div className="font-semibold text-sm text-slate-900">
                  Perplexity AI
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Real-time web grounding, inline citations & Sonar index rank
                </div>
              </div>

              {/* Engine 2: ChatGPT */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 transition-all shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <EngineFavicon engine="chatgpt" size={24} />
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    82/100
                  </span>
                </div>
                <div className="font-semibold text-sm text-slate-900">
                  OpenAI ChatGPT
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Search carousel tiles, commercial products & domain grounding
                </div>
              </div>

              {/* Engine 3: Gemini */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 transition-all shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <EngineFavicon engine="gemini" size={24} />
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    71/100
                  </span>
                </div>
                <div className="font-semibold text-sm text-slate-900">
                  Google Gemini
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Google Search grounding, Knowledge Graph & product catalog
                </div>
              </div>

              {/* Engine 4: Claude */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 transition-all shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <EngineFavicon engine="claude" size={24} />
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    67/100
                  </span>
                </div>
                <div className="font-semibold text-sm text-slate-900">
                  Anthropic Claude
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Constitutional synthesis, editorial authority & review sentiment
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Phase 2 Interactive 4-Screen Product Tour Switcher */}
        <ProductTourTabs />

        {/* 5. Phase 2 3-Card Animated Bento Grid */}
        <BentoGrid />

        {/* 6. Phase 3 Synchronized 4-Tier Pricing Grid & ROI Calculator */}
        <PricingSection />

        {/* 7. Phase 3 Executive GEO/AEO FAQ Accordion */}
        <FaqAccordion />

        {/* 8. Phase 3 High-Contrast Final CTA Card */}
        <FinalCta />
      </main>

      {/* Enterprise SaaS-Matched Marketing Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-2xs">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm">Recomnd v1.0</span>
                <p className="text-[11px] text-slate-400">
                  The Enterprise Operating System for Generative Engine Optimization
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 font-medium">
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
                Gymshark Sandbox
              </Link>
              <Link href="/reports/citations" className="text-slate-600 hover:text-slate-900 transition-colors">
                Citations
              </Link>
              <Link href="/reports/shopping" className="text-slate-600 hover:text-slate-900 transition-colors">
                AI Shopping
              </Link>
              <Link href="/reports/models" className="text-slate-600 hover:text-slate-900 transition-colors">
                Models
              </Link>
              <Link href="/tools/growth" className="text-slate-600 hover:text-slate-900 transition-colors">
                Playbooks
              </Link>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
                Pricing
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} Recomnd Technologies, Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>SOC2 Type II Certified</span>
              <span>&bull;</span>
              <span>GDPR Compliant</span>
              <span>&bull;</span>
              <a href="#overview" className="hover:text-slate-700 transition-colors">
                Back to top &uarr;
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
