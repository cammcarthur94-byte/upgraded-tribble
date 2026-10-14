"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  Bot,
  Activity,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import { EngineFavicon } from "@/components/ui/favicon";

export function BentoGrid() {
  const [activeDiff, setActiveDiff] = useState<"return" | "pricing">("return");

  const crawlers = [
    {
      name: "GPTBot",
      engine: "chatgpt",
      status: "200 OK",
      latency: "142ms",
      lastCrawl: "4m ago",
      llmsTxtStatus: "Indexed",
    },
    {
      name: "OAI-SearchBot",
      engine: "chatgpt",
      status: "200 OK",
      latency: "98ms",
      lastCrawl: "1m ago",
      llmsTxtStatus: "Real-time",
    },
    {
      name: "PerplexityBot",
      engine: "perplexity",
      status: "200 OK",
      latency: "84ms",
      lastCrawl: "32s ago",
      llmsTxtStatus: "Active",
    },
    {
      name: "ClaudeBot",
      engine: "claude",
      status: "200 OK",
      latency: "165ms",
      lastCrawl: "12m ago",
      llmsTxtStatus: "Indexed",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
          <span className="text-[11px] font-semibold tracking-wider text-slate-500 bg-white border border-slate-200/90 px-3 py-1 rounded-full uppercase shadow-2xs">
            Infrastructure & Control
          </span>
          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            Engineered for Enterprise Precision
          </h3>
          <p className="text-sm text-slate-600">
            Beyond visibility metrics: Protect brand safety, verify AI bot crawling,
            and tie generative share directly to top-line Shopify revenue.
          </p>
        </div>

        {/* 3-Card Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bento Card 1: Hallucination & Brand Safety Guardrails */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Real-time Safety
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                Hallucination & Policy Guardrails
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Automatically detects when an LLM hallucinates outdated return windows,
                discount codes, or pricing against your verified Brand Profile.
              </p>

              {/* Interactive Diff Box */}
              <div className="space-y-2.5">
                {/* Outdated Hallucination Alert */}
                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Detected LLM Hallucination (ChatGPT-4o)</span>
                  </div>
                  <p className="text-slate-700 line-through decoration-rose-500 decoration-2 font-mono text-[11px]">
                    &quot;Gymshark only offers 14-day store credit returns on sale leggings.&quot;
                  </p>
                </div>

                {/* Ground Truth Validation */}
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Brand Profile Ground Truth (Verified)</span>
                  </div>
                  <p className="text-emerald-950 font-medium font-mono text-[11px]">
                    &quot;Official Policy: Free 30-day global returns with prepaid label on all items.&quot;
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between text-[11px] text-slate-500">
              <span>Auto-generates llms.txt correction patch</span>
              <span className="font-semibold text-emerald-600">Protected</span>
            </div>
          </div>

          {/* Bento Card 2: AI Crawler & llms.txt Telemetry */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  Edge Crawl Mesh
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                AI Crawler & llms.txt Telemetry
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Monitor bot hit rates, robots.txt status, and latency for major LLM
                indexing crawlers querying your edge servers.
              </p>

              {/* Crawler Telemetry Grid */}
              <div className="space-y-2">
                {crawlers.map((c) => (
                  <div
                    key={c.name}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <EngineFavicon engine={c.engine} size={16} />
                      <div>
                        <span className="font-bold text-slate-900">{c.name}</span>
                        <span className="text-[10px] text-slate-400 block">
                          Last seen {c.lastCrawl}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-500">{c.latency}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" />
                <span>/llms.txt Active</span>
              </span>
              <span className="font-semibold text-emerald-600">100% Up</span>
            </div>
          </div>

          {/* Bento Card 3: GA4 & Shopify Revenue Attribution */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Revenue Lift
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                GA4 & Shopify Attribution
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Connect AI Share of Voice spikes directly to referral sessions,
                checkout conversions, and incremental sales.
              </p>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">
                    AI-Referred Sessions
                  </span>
                  <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                    4,820
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold font-mono">
                    +22% this mo
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                  <span className="text-[10px] text-emerald-800 font-medium block">
                    Assisted Revenue
                  </span>
                  <div className="text-xl font-bold text-emerald-950 font-mono mt-0.5">
                    $64,200
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold font-mono">
                    Verified ROI
                  </span>
                </div>
              </div>

              {/* Mini Area Chart Visualization (SVG) */}
              <div className="h-16 w-full relative">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 300 60"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area */}
                  <path
                    d="M0,50 Q40,48 80,35 T160,25 T220,15 T300,5 L300,60 L0,60 Z"
                    fill="url(#revenueGrad)"
                  />
                  {/* Line */}
                  <path
                    d="M0,50 Q40,48 80,35 T160,25 T220,15 T300,5"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Data Points */}
                  <circle cx="80" cy="35" r="3.5" fill="#10b981" />
                  <circle cx="160" cy="25" r="3.5" fill="#10b981" />
                  <circle cx="220" cy="15" r="3.5" fill="#10b981" />
                  <circle cx="300" cy="5" r="4.5" fill="#047857" />
                </svg>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between text-[11px] text-slate-500">
              <span>Direct UTM & Referrer Tracking</span>
              <span className="font-semibold text-emerald-600">Shopify Connected</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
