"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Search,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  Globe2,
} from "lucide-react";
import { EngineFavicon } from "@/components/ui/favicon";

export function HeroScanner() {
  const router = useRouter();
  const [domain, setDomain] = useState("gymshark.com");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  const scanSteps = [
    {
      label: "Querying Perplexity Sonar API & Real-time Index...",
      engine: "perplexity",
    },
    {
      label: "Parsing ChatGPT Search Carousel Tiles & Grounding Links...",
      engine: "chatgpt",
    },
    {
      label: "Auditing Reddit Citations, Vogue Editorial & Knowledge Graph...",
      engine: "gemini",
    },
    {
      label: "Synthesizing GEO Visibility Score & Competitor Gaps...",
      engine: "claude",
    },
  ];

  const handleRunScan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isScanning) return;

    setIsScanning(true);
    setScanProgress(0);
    setScanStep(0);

    const stepDuration = 550;

    const timer1 = setTimeout(() => {
      setScanStep(1);
      setScanProgress(35);
    }, stepDuration);

    const timer2 = setTimeout(() => {
      setScanStep(2);
      setScanProgress(68);
    }, stepDuration * 2);

    const timer3 = setTimeout(() => {
      setScanStep(3);
      setScanProgress(92);
    }, stepDuration * 3);

    const timer4 = setTimeout(() => {
      setScanProgress(100);
      setTimeout(() => {
        setIsScanning(false);
        // Scroll to dashboard showcase smoothly
        const el = document.getElementById("hero-dashboard-showcase");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 400);
    }, stepDuration * 4);
  };

  return (
    <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-emerald-100/40 via-teal-50/20 to-sky-100/30 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
        {/* Top Volatility Alert Pill Matching In-App Anomaly Banner */}
        <div className="inline-block">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2.5 bg-amber-50/90 border border-amber-200/90 hover:border-amber-300 text-amber-900 rounded-full px-4 py-1.5 text-xs font-medium shadow-2xs hover:shadow-xs transition-all hover:scale-[1.01]"
          >
            <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
              <AlertTriangle className="w-3 h-3" />
            </span>
            <span className="truncate max-w-[260px] sm:max-w-xl text-left">
              <strong className="font-semibold text-amber-950">
                Live AI Index Telemetry:
              </strong>{" "}
              Perplexity & ChatGPT shopping carousel citations shifted +4.8% this week.
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 font-semibold text-amber-950 group-hover:underline shrink-0">
              Inspect live sandbox <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 font-sans leading-[1.08]">
          Measure & Win How AI Engines{" "}
          <span className="relative inline-block text-slate-900">
            Recommend
            <span className="absolute -bottom-1.5 left-0 right-0 h-2 bg-emerald-300/50 -rotate-1 rounded-full -z-10" />
          </span>{" "}
          Your Brand.
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
          Full-funnel Generative Engine Optimization (GEO), Answer Engine Optimization (AEO),
          and AI Shopping intelligence. Track Share of Voice across{" "}
          <span className="font-semibold text-slate-800">ChatGPT</span>,{" "}
          <span className="font-semibold text-slate-800">Perplexity</span>,{" "}
          <span className="font-semibold text-slate-800">Gemini</span>, and{" "}
          <span className="font-semibold text-slate-800">Claude</span>—and turn third-party citation
          gaps into verified revenue lift.
        </p>

        {/* Interactive "Instant Brand Audit" Bar + Sandbox Trigger */}
        <div className="max-w-2xl mx-auto pt-2">
          <form
            onSubmit={handleRunScan}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.06)] p-2 sm:p-2.5 transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 flex items-center min-w-0 px-2 sm:px-3">
                <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Enter domain, e.g. gymshark.com or vuori.com..."
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  disabled={isScanning}
                />
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded shrink-0">
                  ⌘K
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="submit"
                  disabled={isScanning}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all disabled:opacity-75 cursor-pointer"
                >
                  {isScanning ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Scanning Engines...</span>
                    </>
                  ) : (
                    <>
                      <span>Run Live AEO Scan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-all shrink-0"
                >
                  <Globe2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Explore</span> Sandbox
                </Link>
              </div>
            </div>

            {/* 2-Second Animated Multi-Engine Telemetry Scan Sequence */}
            {isScanning && (
              <div className="mt-3 pt-3 border-t border-slate-100 px-2 text-left animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                  <div className="flex items-center gap-2">
                    <EngineFavicon
                      engine={scanSteps[scanStep].engine}
                      size={16}
                    />
                    <span className="font-medium text-slate-800">
                      {scanSteps[scanStep].label}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-emerald-600">
                    {scanProgress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}
          </form>

          {/* Micro trust row below search */}
          <div className="flex items-center justify-center gap-6 mt-3.5 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Real Gymshark Production Dataset
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Perplexity Sonar & ChatGPT Search
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Instant Sandbox, Zero Waitlist
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
