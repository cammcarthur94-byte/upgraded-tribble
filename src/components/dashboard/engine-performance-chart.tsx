"use client";

import React from "react";
import Link from "next/link";
import { EnginePerformanceMetric } from "@/lib/types";
import { EngineFavicon } from "@/components/ui/favicon";
import { Cpu } from "lucide-react";

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
      {engines.map((engine) => (
        <div key={engine.name} className="py-3 first:pt-0 last:pb-0">
          {/* Top Row: Logo, Name, Score, Delta */}
          <div className="flex items-center justify-between mb-1.5">
            <Link
              href={`/reports/models?engine=${encodeURIComponent(engine.engine)}`}
              className="flex items-center gap-2 group cursor-pointer"
              title={`Inspect ${engine.name} in AI Model Insights`}
            >
              <EngineFavicon engine={engine.engine} size={18} className="rounded-xs shrink-0" />
              <span className="text-sm font-medium text-slate-900 group-hover:text-emerald-600 transition-colors">
                {engine.name}
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 font-mono tabular-nums">
                {engine.score}{" "}
                <span className="text-xs font-normal text-slate-400">/100</span>
              </span>
              <span className="text-xs font-semibold text-emerald-600 font-mono">
                {engine.delta}
              </span>
            </div>
          </div>

          {/* Progress Track */}
          <div
            className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2"
            role="progressbar"
            aria-valuenow={engine.presence}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${engine.name} presence: ${engine.presence}%`}
          >
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, engine.presence))}%` }}
            />
          </div>

          {/* Sub-metrics Footer without unnecessary colons or clutter */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>
              Presence{" "}
              <strong className="text-slate-800 font-medium font-mono">{engine.presence}%</strong>
            </span>
            <span>
              Win Rate{" "}
              <strong className="text-slate-800 font-medium font-mono">{engine.winRate}%</strong>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Named alias for AIEnginePerformance
export const AIEnginePerformance = EnginePerformanceChart;
export default EnginePerformanceChart;

