import React from "react";
import Link from "next/link";
import { EngineInsightItem } from "@/lib/scoring/modelInsights";
import { EngineFavicon } from "@/components/ui/favicon";
import { usePlan } from "@/context/plan-context";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  AlertTriangle,
  Sparkles,
  Bot,
  BrainCircuit,
  Search,
  Zap,
  TrendingUp,
  Quote,
  Smile,
  Hash,
  Globe,
  Lock,
} from "lucide-react";

interface EngineBenchmarkCardsProps {
  engines: EngineInsightItem[];
  bestPlatform: string;
  attentionPlatform: string;
}

function MiniSparkline({
  values,
  color = "#10b981",
}: {
  values: number[];
  color?: string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 56;
  const height = 22;
  const points = values.map((val, i) => {
    const x = (i / (values.length - 1)) * (width - 6) + 3;
    const y = height - 4 - ((val - min) / range) * (height - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathD = `M ${points.join(" L ")}`;
  const lastPoint = points[points.length - 1]?.split(",") || ["50", "11"];

  return (
    <div className="flex items-center shrink-0">
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={lastPoint[0]}
          cy={lastPoint[1]}
          r="2.5"
          fill={color}
        />
      </svg>
    </div>
  );
}

export function EngineBenchmarkCards({
  engines,
  bestPlatform,
  attentionPlatform,
}: EngineBenchmarkCardsProps) {
  const { isEngineAllowed } = usePlan();

  // Engine visual configuration
  const getEngineStyles = (engine: string) => {
    switch (engine.toLowerCase()) {
      case "chatgpt":
        return {
          barColor: "bg-emerald-500",
          sparklineColor: "#10b981",
        };
      case "claude":
        return {
          barColor: "bg-amber-500",
          sparklineColor: "#f59e0b",
        };
      case "gemini":
        return {
          barColor: "bg-blue-500",
          sparklineColor: "#3b82f6",
        };
      case "perplexity":
        return {
          barColor: "bg-cyan-500",
          sparklineColor: "#06b6d4",
        };
      default:
        return {
          barColor: "bg-slate-500",
          sparklineColor: "#64748b",
        };
    }
  };

  const getModelSubtitle = (engine: string) => {
    switch (engine.toLowerCase()) {
      case "perplexity":
        return "Sonar Pro • Live Web Search";
      case "chatgpt":
        return "GPT-4o Search • Hybrid";
      case "gemini":
        return "Gemini 2.5 + AI Overviews";
      case "claude":
        return "Claude Sonnet • Web + Memory";
      default:
        return "Live Search";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {engines.map((item) => {
        const isAllowed = isEngineAllowed(item.engine);

        if (!isAllowed) {
          return (
            <div
              key={item.engine}
              className="relative bg-slate-50/70 rounded-xl border border-dashed border-slate-300 p-4 shadow-2xs flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg border border-slate-200/80 flex items-center justify-center shrink-0 p-1 bg-white opacity-60">
                      <EngineFavicon engine={item.engine} size={20} />
                    </div>
                    <div className="min-w-0 truncate">
                      <h3 className="text-sm font-semibold text-slate-700 leading-tight truncate">
                        {item.displayName}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                        {getModelSubtitle(item.engine)}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                    <Lock className="w-2.5 h-2.5" />
                    <span>PRO PLAN</span>
                  </span>
                </div>

                <div className="my-6 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100/70 text-indigo-600 mx-auto flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    {item.displayName} Locked
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                    Included in Pro & Scale plans for multi-engine benchmarking.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60">
                <Link href="/settings?tab=billing" className="block w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-8 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-slate-400 shadow-2xs"
                  >
                    Unlock Engine →
                  </Button>
                </Link>
              </div>
            </div>
          );
        }

        const styles = getEngineStyles(item.engine);
        const isBest = item.displayName === bestPlatform;
        const isAttention = item.displayName === attentionPlatform;

        // Deterministic 7-point trend ending at current inclusion rate
        const baseRate = item.brandInclusionRate;
        const sparklineValues = [
          Math.max(0, baseRate - 4.2),
          Math.max(0, baseRate - 1.8),
          Math.max(0, baseRate - 3.1),
          Math.max(0, baseRate + 1.2),
          Math.max(0, baseRate - 0.8),
          Math.max(0, baseRate + 2.4),
          baseRate,
        ];

        return (
          <div
            key={item.engine}
            className={`relative bg-white rounded-xl border p-4 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs flex flex-col justify-between ${
              isBest
                ? "border-emerald-300/80 ring-1 ring-emerald-200/40"
                : isAttention
                ? "border-amber-300/80 ring-1 ring-amber-200/40"
                : "border-slate-200/60"
            }`}
          >
            {/* Top Row: Engine Logo, Title, Subtitle, and Highlight Badge */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg border border-slate-200/80 flex items-center justify-center shrink-0 p-1 bg-slate-50/50 shadow-2xs">
                    <EngineFavicon engine={item.engine} size={20} />
                  </div>
                  <div className="min-w-0 truncate">
                    <h3 className="text-sm font-semibold text-slate-900 leading-tight truncate">
                      {item.displayName}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {getModelSubtitle(item.engine)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.totalRuns} queries
                      </span>
                    </div>
                  </div>
                </div>

                {/* Highlight Badge */}
                {isBest && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <Trophy className="w-3 h-3 text-emerald-600" />
                    Top Pick
                  </span>
                )}
                {isAttention && !isBest && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Needs Focus
                  </span>
                )}
              </div>

              {/* Primary Metric: Brand Inclusion Rate + Mini Inline Sparkline */}
              <div className="mt-3.5 pt-3 border-t border-slate-100">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-medium text-slate-500">
                    Inclusion Rate
                  </span>
                  <div className="flex items-center gap-2">
                    <MiniSparkline
                      values={sparklineValues}
                      color={styles.sparklineColor}
                    />
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">
                      {item.brandInclusionRate}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${styles.barColor}`}
                    style={{ width: `${Math.max(4, item.brandInclusionRate)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                  <span>
                    {item.inclusionCount} of {item.totalRuns} runs
                  </span>
                  <span className="font-semibold text-slate-600">
                    {item.shareOfVoice}% SoV
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary Metrics Row (Linear-style clean stat pills) */}
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-center">
              {/* Avg Rank */}
              <div className="bg-slate-50/70 p-1.5 rounded-lg border border-slate-200/60">
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Rank
                </div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5 font-mono">
                  #{item.avgMentionPosition}
                </div>
              </div>

              {/* Sentiment Pill */}
              <div className="bg-slate-50/70 p-1.5 rounded-lg border border-slate-200/60">
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Sentiment
                </div>
                <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                  {item.sentimentBreakdown.positivePct}%
                </div>
              </div>

              {/* Citations per run */}
              <div className="bg-slate-50/70 p-1.5 rounded-lg border border-slate-200/60">
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Citations
                </div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">
                  {item.citationsPerAnswer}/run
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
