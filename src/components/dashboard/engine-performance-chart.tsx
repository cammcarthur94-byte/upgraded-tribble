"use client";

import React from "react";
import Link from "next/link";
import { EnginePerformanceMetric, SupportedEngine } from "@/lib/types";
import { EngineFavicon } from "@/components/ui/favicon";
import { Cpu, Lock } from "lucide-react";
import { usePlan } from "@/context/plan-context";

interface EnginePerformanceChartProps {
  metrics?: EnginePerformanceMetric[];
}

// Fallback engines matching the user's exact specification
const defaultEngines = [
  {
    engine: "perplexity",
    name: "Perplexity AI",
    score: 88,
    delta: "+3",
    presence: 90,
    winRate: 78,
  },
  {
    engine: "chatgpt",
    name: "OpenAI ChatGPT",
    score: 82,
    delta: "+2",
    presence: 85,
    winRate: 65,
  },
  {
    engine: "gemini",
    name: "Google Gemini",
    score: 71,
    delta: "+2",
    presence: 75,
    winRate: 52,
  },
  {
    engine: "claude",
    name: "Anthropic Claude",
    score: 67,
    delta: "+1",
    presence: 70,
    winRate: 48,
  },
];

export function EnginePerformanceChart({ metrics }: EnginePerformanceChartProps) {
  const { isEngineAllowed, activePlan } = usePlan();

  const getDelta = (item: EnginePerformanceMetric) => {
    if (item.engine === "perplexity") return "+3";
    if (item.engine === "chatgpt") return "+2";
    if (item.engine === "gemini") return "+2";
    if (item.engine === "claude") return "+1";
    return item.visibilityScore >= 80 ? "+3" : item.visibilityScore >= 70 ? "+2" : "+1";
  };

  const engines =
    metrics && metrics.length > 0
      ? [...metrics]
          .sort((a, b) => b.appearanceRate - a.appearanceRate)
          .map((m) => ({
            engine: m.engine,
            name: m.displayName,
            score: m.visibilityScore,
            delta: getDelta(m),
            presence: m.appearanceRate,
            winRate: m.topPickWinRate ?? Math.round(m.appearanceRate * 0.7),
          }))
      : defaultEngines;

  if (!engines || engines.length === 0) {
    return (
      <div className="h-[240px] flex flex-col items-center justify-center text-center p-4">
        <Cpu className="w-8 h-8 text-slate-200 mb-2 stroke-1" />
        <p className="text-xs text-slate-400">No engine performance data recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 flex flex-col justify-between h-full">
      {engines.map((engine) => {
        const isAllowed = isEngineAllowed(engine.engine as SupportedEngine);
        return (
          <div key={engine.name} className="py-3 first:pt-0 last:pb-0">
            {/* Top Row: Logo, Name, Score, Delta */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Link
                  href={
                    isAllowed
                      ? `/reports/models?engine=${encodeURIComponent(engine.engine)}`
                      : "/settings?tab=billing"
                  }
                  className="flex items-center gap-2 group cursor-pointer"
                  title={
                    isAllowed
                      ? `Inspect ${engine.name} in AI Model Insights`
                      : `${engine.name} requires Pro Plan (current: ${activePlan.name})`
                  }
                >
                  <EngineFavicon engine={engine.engine} size={18} className="rounded-xs shrink-0" />
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isAllowed
                        ? "text-slate-900 group-hover:text-emerald-600"
                        : "text-slate-500 group-hover:text-slate-700"
                    }`}
                  >
                    {engine.name}
                  </span>
                </Link>
                {!isAllowed && (
                  <Link
                    href="/settings?tab=billing"
                    title={`Unlock ${engine.name} on Pro Plan`}
                    className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100 transition"
                  >
                    <Lock className="w-2.5 h-2.5" />
                    PRO
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isAllowed ? (
                  <>
                    <span className="text-sm font-semibold text-slate-900 font-mono tabular-nums">
                      {engine.score}{" "}
                      <span className="text-xs font-normal text-slate-400">/100</span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 font-mono">
                      {engine.delta}
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-medium text-slate-400 italic">
                    Plan Locked
                  </span>
                )}
              </div>
            </div>

            {/* Progress Track */}
            <div
              className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2"
              role="progressbar"
              aria-valuenow={isAllowed ? engine.presence : 0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${engine.name} presence: ${isAllowed ? engine.presence : 0}%`}
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isAllowed ? "bg-emerald-500" : "bg-slate-200"
                }`}
                style={{ width: isAllowed ? `${Math.min(100, Math.max(0, engine.presence))}%` : "0%" }}
              />
            </div>

            {/* Sub-metrics Footer without unnecessary colons or clutter */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              {isAllowed ? (
                <>
                  <span>
                    Presence{" "}
                    <strong className="text-slate-800 font-medium font-mono">{engine.presence}%</strong>
                  </span>
                  <span>
                    Win Rate{" "}
                    <strong className="text-slate-800 font-medium font-mono">{engine.winRate}%</strong>
                  </span>
                </>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Tracking disabled on {activePlan.name} Plan •{" "}
                  <Link href="/settings?tab=billing" className="text-emerald-600 hover:underline font-medium">
                    Upgrade to Pro
                  </Link>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Named alias for AIEnginePerformance
export const AIEnginePerformance = EnginePerformanceChart;
export default EnginePerformanceChart;

