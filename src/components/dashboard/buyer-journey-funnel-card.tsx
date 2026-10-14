"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QueryIntentFunnelStage } from "@/lib/types";
import {
  Compass,
  GitCompare,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Trophy,
} from "lucide-react";

interface BuyerJourneyFunnelCardProps {
  stages?: QueryIntentFunnelStage[];
  brandName?: string;
  className?: string;
}

export function BuyerJourneyFunnelCard({
  stages = [],
  brandName = "Gymshark",
  className = "",
}: BuyerJourneyFunnelCardProps) {
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null);

  // Fallback defaults if stages are empty
  const defaultStages: QueryIntentFunnelStage[] = [
    {
      stageId: "discovery",
      stageName: "Discovery & Informational",
      description: "Broad category searches, fabric guides, and fitness advice.",
      promptCount: 7,
      promptPercentage: 39,
      visibilityScore: 68.5,
      winRate: 33.0,
      topCompetitor: { name: "Nike", visibilityScore: 74.0 },
      sampleQueries: [
        "best gym wear for heavy lifting",
        "breathable fabrics for high-intensity training",
        "how to choose squat-proof gym leggings",
      ],
    },
    {
      stageId: "consideration",
      stageName: "Consideration & Comparison",
      description: "Direct brand-vs-brand comparisons and durability evaluations.",
      promptCount: 6,
      promptPercentage: 33,
      visibilityScore: 79.0,
      winRate: 58.5,
      topCompetitor: { name: "Alo Yoga", visibilityScore: 61.0 },
      sampleQueries: [
        `${brandName.toLowerCase()} vs nike leggings durability`,
        `affordable alternatives to alo yoga workout sets`,
        `${brandName.toLowerCase()} sizing inconsistencies and return policy`,
      ],
    },
    {
      stageId: "commercial",
      stageName: "Commercial & Transactional",
      description: "High-intent queries, seasonal discount lookups, and checkout recommendations.",
      promptCount: 5,
      promptPercentage: 28,
      visibilityScore: 84.5,
      winRate: 72.0,
      topCompetitor: { name: "Nike", visibilityScore: 54.0 },
      sampleQueries: [
        `where to buy authentic ${brandName.toLowerCase()} seamless sets`,
        `${brandName.toLowerCase()} apex power collection restock discount`,
        `${brandName.toLowerCase()} sizing guide for women seamless`,
      ],
    },
  ];

  const stageList = stages && stages.length > 0 ? stages : defaultStages;

  // Trajectory metadata for each stage
  const stageMeta: Record<
    string,
    {
      shortName: string;
      icon: React.ComponentType<{ className?: string }>;
      deltaPercent: string;
      sparklinePoints: string;
      color: string;
      bgTheme: string;
      borderTheme: string;
      badgeTheme: string;
      gradientTheme: string;
    }
  > = {
    discovery: {
      shortName: "Discovery",
      icon: Compass,
      deltaPercent: "+3.2%",
      sparklinePoints: "M 2,16 Q 18,14 36,12 T 70,7 T 98,4",
      color: "#0284c7", // sky-600
      bgTheme: "bg-sky-50/40 hover:bg-sky-50/70",
      borderTheme: "border-sky-200/70",
      badgeTheme: "bg-sky-100/90 text-sky-800 border-sky-200",
      gradientTheme: "from-sky-500 to-indigo-500",
    },
    consideration: {
      shortName: "Consideration",
      icon: GitCompare,
      deltaPercent: "+5.8%",
      sparklinePoints: "M 2,17 Q 18,15 36,10 T 70,6 T 98,2",
      color: "#6366f1", // indigo-500
      bgTheme: "bg-indigo-50/40 hover:bg-indigo-50/70",
      borderTheme: "border-indigo-200/70",
      badgeTheme: "bg-indigo-100/90 text-indigo-800 border-indigo-200",
      gradientTheme: "from-indigo-500 to-teal-500",
    },
    commercial: {
      shortName: "Commercial",
      icon: ShoppingBag,
      deltaPercent: "+9.4%",
      sparklinePoints: "M 2,19 Q 18,14 36,8 T 70,4 T 98,1",
      color: "#10b981", // emerald-500
      bgTheme: "bg-emerald-50/40 hover:bg-emerald-50/70",
      borderTheme: "border-emerald-200/70",
      badgeTheme: "bg-emerald-100/90 text-emerald-800 border-emerald-200",
      gradientTheme: "from-teal-500 to-emerald-500",
    },
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between min-h-[350px] ${className}`}
    >
      {/* Header with Deep Funnel Audit action button */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 truncate">
              Buyer Journey Visibility Funnel
            </h2>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 font-mono">
              3 Stages
            </span>
          </div>

          <Link
            href="/reports/prompts"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group shrink-0"
            title="Inspect deep prompt fan-out audits across all funnel stages"
          >
            <span>Deep Funnel Audit</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <p className="text-xs text-slate-500">
          Audited prompt visibility progression across awareness, comparison, and conversion
        </p>
      </div>

      {/* Horizontal Flowing Funnel Pipeline Track */}
      <div className="space-y-1.5 my-1">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
          <span className="text-slate-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Funnel Share Progression</span>
          </span>
          <span className="text-[10px] text-slate-400 italic">
            Hover stage to preview sub-queries
          </span>
        </div>

        {/* 3-segment connected progression bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex p-0.5 gap-1 border border-slate-200/70">
          {stageList.map((stg) => {
            const meta = stageMeta[stg.stageId] || stageMeta.discovery;
            const isHovered = hoveredStageId === stg.stageId;
            return (
              <div
                key={`bar-${stg.stageId}`}
                onMouseEnter={() => setHoveredStageId(stg.stageId)}
                onMouseLeave={() => setHoveredStageId(null)}
                className={`h-full rounded-full transition-all duration-300 cursor-pointer flex-1 bg-gradient-to-r ${meta.gradientTheme} ${
                  isHovered
                    ? "brightness-110 shadow-xs ring-2 ring-indigo-400/50"
                    : hoveredStageId !== null
                    ? "opacity-60"
                    : "opacity-95"
                }`}
                title={`${stg.stageName}: ${stg.visibilityScore}% Brand SOV`}
              />
            );
          })}
        </div>
      </div>

      {/* 3 Stage Metric Columns (Left to Right) */}
      <div className="grid grid-cols-3 gap-2.5 my-auto pt-1 relative">
        {stageList.map((stg, idx) => {
          const meta = stageMeta[stg.stageId] || stageMeta.discovery;
          const Icon = meta.icon;
          const isHovered = hoveredStageId === stg.stageId;

          return (
            <div
              key={stg.stageId}
              onMouseEnter={() => setHoveredStageId(stg.stageId)}
              onMouseLeave={() => setHoveredStageId(null)}
              className={`relative p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isHovered
                  ? "bg-slate-50/95 border-indigo-300 shadow-sm ring-1 ring-indigo-200 scale-[1.02]"
                  : `${meta.bgTheme} ${meta.borderTheme}`
              }`}
            >
              {/* Stage Header */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="p-1 rounded-md bg-white border border-slate-200/80 shadow-2xs shrink-0"
                      style={{ color: meta.color }}
                    >
                      <Icon className="w-3 h-3" />
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 truncate">
                      {meta.shortName}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 font-semibold shrink-0">
                    S{idx + 1}
                  </span>
                </div>

                {/* Primary Metric: Brand SOV */}
                <div className="mt-1.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
                      {stg.visibilityScore}%
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 block leading-tight">
                    Brand SOV
                  </span>
                </div>
              </div>

              {/* Trajectory Delta & Mini Sparkline */}
              <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                {/* Micro trajectory sparkline graph */}
                <svg
                  className="w-12 h-5 overflow-visible shrink-0"
                  viewBox="0 0 100 22"
                  fill="none"
                >
                  <path
                    d={meta.sparklinePoints}
                    stroke={meta.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Trajectory percentage indicator */}
                <span className="text-[10px] font-bold text-emerald-600 inline-flex items-center gap-0.5 font-mono">
                  <TrendingUp className="w-2.5 h-2.5 shrink-0" />
                  <span>{meta.deltaPercent}</span>
                </span>
              </div>

              {/* Sub-Queries Hover Tooltip Overlay */}
              {isHovered && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] z-40 w-72 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-xl shadow-xl shadow-slate-900/10 border border-slate-200/90 pointer-events-none transition-all animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{stg.stageName}</span>
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Win Rate: {stg.winRate}%
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Top Fan-Out Sub-Queries:
                  </p>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {stg.sampleQueries.slice(0, 3).map((query, qIdx) => (
                      <div
                        key={qIdx}
                        className="flex items-start gap-1.5 leading-snug bg-slate-50/80 p-2 rounded-lg border border-slate-100"
                      >
                        <span className="text-[10px] text-indigo-600 font-mono font-semibold shrink-0 mt-0.5">
                          #{qIdx + 1}
                        </span>
                        <span className="italic truncate">&ldquo;{query}&rdquo;</span>
                      </div>
                    ))}
                  </div>

                  {stg.topCompetitor && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Top Rival: <strong className="text-slate-800 font-semibold">{stg.topCompetitor.name}</strong></span>
                      <span className="font-mono font-semibold text-slate-800">
                        {stg.topCompetitor.visibilityScore}% SOV
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Funnel Conversion Summary */}
      <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 truncate">
          <Trophy className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-slate-700 font-medium truncate">
            Conversion Peak: <strong className="text-slate-900">84.5%</strong> Commercial SOV
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono shrink-0">
          +9.4% MoM
        </span>
      </div>
    </div>
  );
}
