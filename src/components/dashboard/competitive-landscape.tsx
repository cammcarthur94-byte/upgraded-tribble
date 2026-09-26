"use client";

import React from "react";
import Link from "next/link";
import { CompetitorBenchmarkItem } from "@/lib/types";
import { Favicon } from "@/components/ui/favicon";
import {
  Sparkles,
  ArrowRight,
  Smile,
  Meh,
  Frown,
  Building2,
} from "lucide-react";

interface CompetitiveLandscapeProps {
  competitors: CompetitorBenchmarkItem[];
  brandName: string;
}

export function CompetitiveLandscape({
  competitors = [],
  brandName,
}: CompetitiveLandscapeProps) {
  const discoveredCount = competitors.filter((c) => c.isAiDiscovered).length;

  const sentimentConfigs = {
    positive: {
      label: "Positive",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: Smile,
    },
    neutral: {
      label: "Neutral",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: Meh,
    },
    negative: {
      label: "Critical",
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      icon: Frown,
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Competitive Landscape & Rivals
            </h2>
            {discoveredCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
                <span>{discoveredCount} AI Discovered</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Competitor presence, AI recommendation frequency, and sentiment benchmarked against {brandName}
          </p>
        </div>

        <Link
          href="/admin/brand-profile"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group self-start sm:self-auto shrink-0"
        >
          <span>Manage in Brand Profile</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Competitor Items List */}
      <div className="divide-y divide-slate-100">
        {competitors.length === 0 ? (
          <div className="py-8 text-center">
            <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              No competitors tracked yet. As AI models reference other brands, they will automatically appear here.
            </p>
          </div>
        ) : (
          competitors.slice(0, 6).map((comp) => {
            const sentiment = sentimentConfigs[comp.sentiment] || sentimentConfigs.neutral;
            const SentimentIcon = sentiment.icon;

            return (
              <div
                key={comp.id || comp.name}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2.5 transition-colors -mx-2.5"
              >
                {/* Left: Competitor Name, Favicon & Source Badge */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <Favicon domain={comp.domain} size={18} fallbackText={comp.name} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {comp.name}
                      </span>

                      {comp.isAiDiscovered ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                          <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                          AI Discovered
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                          Tracked
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate mt-0.5">
                      <span>{comp.domain}</span>
                    </div>
                  </div>
                </div>

                {/* Right: SoV Bar, Mentions Count & Sentiment */}
                <div className="flex items-center gap-4 shrink-0 sm:justify-end">
                  {/* Share of Voice Meter */}
                  <div className="w-28 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">SoV</span>
                      <span className="font-bold text-slate-700">{comp.shareOfVoice}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          comp.isAiDiscovered ? "bg-purple-500" : "bg-slate-500"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, comp.shareOfVoice))}%` }}
                      />
                    </div>
                  </div>

                  {/* Mention count */}
                  <div className="text-right min-w-[55px]">
                    <div className="text-xs font-bold text-slate-900">
                      {comp.mentionCount}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Mentions
                    </div>
                  </div>

                  {/* Sentiment Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${sentiment.badge}`}
                  >
                    <SentimentIcon className="w-3 h-3" />
                    <span>{sentiment.label}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {competitors.length > 6 && (
        <div className="pt-3 border-t border-slate-100 text-center">
          <Link
            href="/admin/brand-profile"
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1"
          >
            <span>View all {competitors.length} competitors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
