"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useBrand } from "@/context/brand-context";
import { usePlan } from "@/context/plan-context";
import { useGlobalFilters } from "@/context/filter-context";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { getModelInsightsAction } from "@/app/actions/model-insights-actions";
import { EngineInsightsReport } from "@/lib/scoring/modelInsights";
import { EngineBenchmarkCards } from "@/components/models/engine-benchmark-cards";
import { ModelComparisonChart } from "@/components/models/model-comparison-chart";
import { SentimentBreakdownChart } from "@/components/models/sentiment-breakdown-chart";
import { EngineComparisonTable } from "@/components/models/engine-comparison-table";
import {
  Share2,
  Calendar,
  RefreshCw,
  Loader2,
  Sparkles,
  Info,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIModelInsightsPage() {
  const { currentBrand } = useBrand();
  const { activePlanId } = usePlan();
  const { dateRangeDays } = useGlobalFilters();
  const timeframeDays = dateRangeDays;
  const [report, setReport] = useState<EngineInsightsReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getModelInsightsAction(currentBrand.id, timeframeDays)
      .then((data) => {
        if (isMounted) {
          setReport(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load model insights:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentBrand.id, timeframeDays]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await getModelInsightsAction(currentBrand.id, timeframeDays);
      setReport(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Timeframe Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            AI Model Insights
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Benchmark performance across conversational AI engines and identify platform-specific visibility gaps for{" "}
            <span className="font-semibold text-slate-700">{currentBrand?.brandName}</span>.
          </p>
        </div>

        {/* Action Bar: Timeframe Buttons & Refresh */}
        <div className="flex items-center gap-2.5 shrink-0">
          <DateRangePicker />

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-indigo-600" : "text-slate-500"}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {isLoading && !report ? (
        /* Loading Skeleton */
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-slate-100 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-slate-100 rounded-2xl" />
            <div className="h-80 bg-slate-100 rounded-2xl" />
          </div>
          <div className="h-64 bg-slate-100 rounded-2xl" />
        </div>
      ) : report ? (
        <>
          {/* Starter Plan Notice Banner */}
          {activePlanId === "starter" && (
            <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-white p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Starter Plan: 2 of 4 AI Engines Active (ChatGPT & Perplexity)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Google Gemini and Anthropic Claude are locked on Starter. Upgrade to Pro to unlock 100% 4-engine coverage and competitor comparisons.
                  </p>
                </div>
              </div>
              <Link href="/settings?tab=billing" className="shrink-0">
                <Button size="sm" className="h-7 text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs">
                  Upgrade to Pro →
                </Button>
              </Link>
            </div>
          )}

          {/* Step 2: Top Benchmark Cards (Engine Grid) */}
          <EngineBenchmarkCards
            engines={report.engines}
            bestPlatform={report.bestPlatform}
            attentionPlatform={report.attentionPlatform}
          />

          {/* Step 3: Comparative Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModelComparisonChart radarData={report.radarData} />
            <SentimentBreakdownChart engines={report.engines} />
          </div>

          {/* Step 4: Head-to-Head Engine Comparison Table */}
          <EngineComparisonTable
            engines={report.engines}
            brandName={report.brandName}
          />
        </>
      ) : (
        /* Fallback Empty State */
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
          <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            No audit insights available for this timeframe
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch audit prompts to ChatGPT, Claude, Gemini, and Perplexity to generate model comparison metrics.
          </p>
        </div>
      )}
    </div>
  );
}
