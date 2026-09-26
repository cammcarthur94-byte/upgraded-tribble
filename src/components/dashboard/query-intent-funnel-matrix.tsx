"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QueryIntentFunnelStage } from "@/lib/types";
import {
  Compass,
  GitCompare,
  ShoppingBag,
  Trophy,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface QueryIntentFunnelMatrixProps {
  stages?: QueryIntentFunnelStage[];
  brandName?: string;
}

export function QueryIntentFunnelMatrix({
  stages = [],
  brandName = "Gymshark",
}: QueryIntentFunnelMatrixProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>("consideration");

  const stageIcons: Record<string, React.ReactNode> = {
    discovery: <Compass className="w-4 h-4 text-sky-600" />,
    consideration: <GitCompare className="w-4 h-4 text-purple-600" />,
    commercial: <ShoppingBag className="w-4 h-4 text-emerald-600" />,
  };

  const stageTheme: Record<
    string,
    { bg: string; border: string; badge: string; text: string; bar: string }
  > = {
    discovery: {
      bg: "bg-sky-50/50 hover:bg-sky-50/80",
      border: "border-sky-200/80",
      badge: "bg-sky-100/90 text-sky-800 border-sky-200",
      text: "text-sky-700",
      bar: "bg-gradient-to-r from-sky-500 to-blue-500",
    },
    consideration: {
      bg: "bg-purple-50/50 hover:bg-purple-50/80",
      border: "border-purple-200/80",
      badge: "bg-purple-100/90 text-purple-800 border-purple-200",
      text: "text-purple-700",
      bar: "bg-gradient-to-r from-purple-500 to-indigo-500",
    },
    commercial: {
      bg: "bg-emerald-50/50 hover:bg-emerald-50/80",
      border: "border-emerald-200/80",
      badge: "bg-emerald-100/90 text-emerald-800 border-emerald-200",
      text: "text-emerald-700",
      bar: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
  };

  if (!stages || stages.length === 0) {
    return null;
  }

  const toggleExpand = (stageId: string) => {
    setExpandedStage((prev) => (prev === stageId ? null : stageId));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Query Intent & Buyer Journey Funnel
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 font-mono">
              3 Stages
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audited prompt visibility and generative win rates across awareness, consideration, and conversion phases
          </p>
        </div>

        <Link
          href="/reports/prompts"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>Deep Prompt Breakdown</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 3 Full Funnel Stage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stages.map((stage) => {
          const theme = stageTheme[stage.stageId] || stageTheme.discovery;
          const isExpanded = expandedStage === stage.stageId;
          const isBrandWinning = stage.visibilityScore >= (stage.topCompetitor?.visibilityScore || 0);

          return (
            <div
              key={stage.stageId}
              className={`rounded-2xl border ${theme.border} bg-white shadow-2xs transition-all flex flex-col justify-between overflow-hidden`}
            >
              {/* Stage Card Header */}
              <div className={`p-4 border-b ${theme.border} ${theme.bg}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-white shadow-2xs border border-slate-200/60">
                      {stageIcons[stage.stageId]}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        {stage.stageName}
                      </h3>
                      <span className="text-[10px] font-medium text-slate-500">
                        {stage.promptCount} prompts ({stage.promptPercentage}% share)
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${theme.badge}`}
                  >
                    Stage {stage.stageId === "discovery" ? "1" : stage.stageId === "consideration" ? "2" : "3"}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {stage.description}
                </p>
              </div>

              {/* Stage Metrics Grid */}
              <div className="p-4 space-y-3.5 flex-1">
                {/* Visibility Score Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-600 font-medium">
                      {brandName} Visibility:
                    </span>
                    <span className="font-bold text-slate-900 font-mono text-sm">
                      {stage.visibilityScore}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                      style={{ width: `${stage.visibilityScore}%` }}
                    />
                  </div>
                </div>

                {/* Win Rate & Leading Rival */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      <span>Win Rate (#1)</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 font-mono">
                      {stage.winRate}%
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 space-y-0.5">
                    <div className="text-[10px] font-medium text-slate-500 truncate">
                      Top Rival: <strong className="text-slate-700">{stage.topCompetitor?.name}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600">{stage.topCompetitor?.visibilityScore}%</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          isBrandWinning
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {isBrandWinning ? "Leading" : "Trailing"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expandable Sample Queries Drawer */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => toggleExpand(stage.stageId)}
                    className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer"
                  >
                    <span>Sample Buyer Queries ({stage.sampleQueries.length})</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-1.5 animate-fadeIn">
                      {stage.sampleQueries.map((query, qIdx) => (
                        <Link
                          key={qIdx}
                          href={`/reports/prompts?search=${encodeURIComponent(query)}`}
                          className="block text-[10px] text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/50 p-2 rounded-lg border border-slate-200/70 transition-colors group truncate"
                          title={`Inspect prompt: "${query}"`}
                        >
                          <span className="text-slate-400 mr-1.5 font-mono">#{qIdx + 1}</span>
                          <span className="italic">&ldquo;{query}&rdquo;</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
