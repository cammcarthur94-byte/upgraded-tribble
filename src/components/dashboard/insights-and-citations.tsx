"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Favicon } from "@/components/ui/favicon";

interface SentimentItem {
  label: string;
  desc: string;
  percentage: number;
  mentions: number;
  active?: boolean;
  color: string;
}

interface CitationItem {
  rank: number;
  name: string;
  category: string;
  count: number;
  share: string;
  tagStyle: string;
}

interface InsightsAndCitationsProps {
  sentiments?: SentimentItem[];
  citations?: CitationItem[];
  brandName?: string;
  className?: string;
  onSelectSentiment?: (sentiment: "positive" | "neutral" | "negative") => void;
  onOpenDrawer?: (sentiment: "all" | "positive" | "neutral" | "negative") => void;
}

const DEFAULT_SENTIMENTS: SentimentItem[] = [
  { label: "Positive", desc: "Favorable brand recommendations", percentage: 64, mentions: 14, active: true, color: "bg-emerald-500" },
  { label: "Neutral", desc: "Objective & comparative mentions", percentage: 27, mentions: 6, active: false, color: "bg-slate-400" },
  { label: "Critical", desc: "Critiques, sizing & competitor trade-offs", percentage: 9, mentions: 2, active: false, color: "bg-rose-500" },
];

const DEFAULT_CITATIONS: CitationItem[] = [
  { rank: 1, name: "reddit.com", category: "Community / UGC", count: 18, share: "35%", tagStyle: "bg-purple-50 text-purple-600" },
  { rank: 2, name: "gymshark.com", category: "Owned", count: 14, share: "28%", tagStyle: "bg-sky-50 text-sky-600" },
  { rank: 3, name: "womenshealthmag.com", category: "Editorial Press", count: 8, share: "16%", tagStyle: "bg-emerald-50 text-emerald-600" },
  { rank: 4, name: "runnersworld.com", category: "Editorial Press", count: 6, share: "12%", tagStyle: "bg-emerald-50 text-emerald-600" },
  { rank: 5, name: "trustpilot.com", category: "Reviews", count: 5, share: "9%", tagStyle: "bg-amber-50 text-amber-600" },
];

export default function InsightsAndCitations({
  sentiments = DEFAULT_SENTIMENTS,
  citations = DEFAULT_CITATIONS,
  brandName = "Gymshark",
  className = "",
  onSelectSentiment,
  onOpenDrawer,
}: InsightsAndCitationsProps) {
  const [activeTab, setActiveTab] = useState<string>("Positive");

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto ${className}`}>
      {/* 1. SENTIMENT DISTRIBUTION */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Sentiment Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                AI tone analysis across recommendation responses
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenDrawer?.("all")}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              Inspect All &rarr;
            </button>
          </div>

          <div className="space-y-4">
            {sentiments.map((s, idx) => {
              const isActive = s.label === activeTab || (s.active && !activeTab);
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveTab(s.label);
                    const lower = s.label.toLowerCase();
                    if (lower.includes("pos")) onSelectSentiment?.("positive");
                    else if (lower.includes("neu")) onSelectSentiment?.("neutral");
                    else onSelectSentiment?.("negative");
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-50/80 border-slate-200"
                      : "border-transparent hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                      {s.label}
                    </span>
                    <span className="font-bold text-slate-900">{s.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.percentage}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. TOP AI CITATION SOURCES */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Top AI Citation Sources</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Websites AI models rely on most when citing {brandName}
              </p>
            </div>
            <Link
              href="/reports/citations"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View Explorer &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {citations.map((c) => (
              <div key={c.rank} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400 w-4">#{c.rank}</span>
                  <Favicon domain={c.name} className="w-4 h-4 rounded-sm" />
                  <span className="font-medium text-slate-800">{c.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.tagStyle}`}>
                    {c.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400 text-[11px]">{c.count} cites</span>
                  <span className="font-semibold text-slate-700">{c.share}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { InsightsAndCitations };
