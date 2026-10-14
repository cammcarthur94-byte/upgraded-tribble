"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle, ShieldCheck, Globe } from "lucide-react";
import { EngineFavicon } from "@/components/ui/favicon";

export function FinalCta() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* High-Contrast Bottom Callout Card */}
        <div className="relative bg-[#F8FAFC] border-2 border-slate-900 rounded-3xl p-8 sm:p-14 shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-3xl space-y-6">
            {/* Live Operational Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All 4 AI Engine Collectors Operational (Perplexity, ChatGPT, Gemini, Claude)</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-sans leading-tight">
              Ready to See Your Brand Through the Eyes of AI?
            </h2>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Join leading DTC brands and enterprise SEO teams winning the generative era.
              Track multi-engine Share of Voice, audit third-party citations, and turn generative
              omissions into verified commercial revenue lift.
            </p>

            {/* Dual Call-to-Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Live Gymshark Sandbox</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/settings"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold shadow-2xs hover:shadow-xs transition-all"
              >
                <span>Start 7-Day Free Trial</span>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                No credit card required for sandbox
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Live production telemetry
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Enterprise SOC2 & GDPR ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
