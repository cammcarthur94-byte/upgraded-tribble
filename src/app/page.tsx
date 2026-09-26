"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useBrand } from "@/context/brand-context";
import { useGlobalFilters } from "@/context/filter-context";
import { getBrandDashboardDataAction } from "@/app/actions/analytics-actions";
import { DashboardAnalyticsData } from "@/lib/types";
import { SovTrajectoryChart } from "@/components/dashboard/sov-trajectory-chart";
import { TopCitedDomains } from "@/components/dashboard/top-cited-domains";
import { DomainAuthorityDonutChart } from "@/components/dashboard/domain-authority-donut-chart";
import { EnginePerformanceChart } from "@/components/dashboard/engine-performance-chart";
import { SentimentDistributionChart } from "@/components/dashboard/sentiment-distribution-chart";
import { PromptVolatilityHeatmap } from "@/components/dashboard/prompt-volatility-heatmap";
import { SentimentDetailsSheet } from "@/components/dashboard/sentiment-details-sheet";
import { TopKpiRow } from "@/components/dashboard/top-kpi-row";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { EngineFavicon } from "@/components/ui/favicon";
import { ArrowRight, AlertTriangle, X } from "lucide-react";

export default function BrandInsightsOverviewPage() {
  const { currentBrand } = useBrand();
  const { dateRange, dateRangeDays, setDateRange } = useGlobalFilters();
  const [data, setData] = useState<DashboardAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  // Sentiment Drawer state
  const [isSentimentDrawerOpen, setIsSentimentDrawerOpen] = useState(false);
  const [activeSentimentFilter, setActiveSentimentFilter] = useState<
    "positive" | "neutral" | "negative" | "all"
  >("all");

  const timeframeDays = dateRangeDays;

  const loadData = () => {
    setIsLoading(true);
    getBrandDashboardDataAction(currentBrand.id, timeframeDays).then((res) => {
      setData(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [currentBrand.id, dateRange, dateRangeDays]);

  const handleOpenSentimentDrawer = (
    sentiment: "positive" | "neutral" | "negative" | "all" = "all"
  ) => {
    setActiveSentimentFilter(sentiment);
    setIsSentimentDrawerOpen(true);
  };

  const breakdown = data?.breakdown;
  const currentSoV =
    breakdown?.shareOfVoice !== undefined ? breakdown.shareOfVoice : 0;
  const bestEngine =
    breakdown?.bestPerformingEngine ||
    data?.engineMetrics?.[0]?.engine ||
    "";
  const bestEngineMetric =
    data?.engineMetrics?.find((m) => m.engine === bestEngine) ||
    data?.engineMetrics?.[0];
  const bestEngineRate =
    bestEngineMetric?.appearanceRate ??
    bestEngineMetric?.topPickWinRate ??
    0;
  const positivePct = data?.sentimentDist?.positivePercentage ?? 0;
  const sentimentLabel =
    positivePct >= 60 ? "Positive" : positivePct > 0 && positivePct <= 40 ? "Negative" : "Neutral";

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Subtitle - Clean, Minimalist Layout matching reference */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Brand Insights Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive competitive benchmarking and generative perception for{" "}
            <span className="font-medium text-slate-800">{currentBrand.brandName}</span>
          </p>
        </div>

        {/* Top-Right Controls */}
        <div className="shrink-0">
          <DateRangePicker onRefresh={loadData} isRefreshing={isLoading} />
        </div>
      </div>

      {/* Dismissible Minimalist Health Alert / Anomaly Banner */}
      {!isAlertDismissed && (
        <div className="bg-amber-50/70 border border-amber-200/70 text-amber-900 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs shadow-2xs transition-all">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-6 h-6 rounded-lg bg-amber-100/90 flex items-center justify-center shrink-0 text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <div className="truncate">
              <span className="font-semibold text-amber-950">Algorithm Volatility Detected:</span>{" "}
              <span>Perplexity & ChatGPT model inclusion for <strong className="font-semibold">{currentBrand.brandName}</strong> fluctuated +4.8% this week.</span>
              <Link
                href="/reports/models"
                className="ml-2 font-semibold underline underline-offset-2 hover:text-amber-950 inline-flex items-center gap-0.5"
              >
                Inspect footprint <ArrowRight className="w-3 h-3 inline" />
              </Link>
            </div>
          </div>
          <button
            onClick={() => setIsAlertDismissed(true)}
            title="Dismiss notification"
            aria-label="Dismiss alert"
            className="p-1 rounded-md text-amber-600 hover:text-amber-900 hover:bg-amber-100/60 transition-colors shrink-0 ml-3"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Step 2: 4 KPI Cards: AEO Score, Share of Voice, AI Sentiment, Websites Citing You */}
      <TopKpiRow
        data={data}
        onOpenSentiment={() => handleOpenSentimentDrawer("positive")}
      />

      {/* 2-Column Data Visualization Grid matching reference images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Share of Voice */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-2xs flex flex-col justify-between min-h-[350px]">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-slate-900">
                Share of Voice
              </h2>
              {/* Segmented control toggle matching reference image 1 */}
              <div className="inline-flex items-center p-0.5 bg-slate-100/80 rounded-lg text-[11px] font-medium text-slate-600">
                <button
                  type="button"
                  onClick={() => setDateRange("7d")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    dateRange === "7d"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "hover:text-slate-900 text-slate-500"
                  }`}
                >
                  7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setDateRange("30d")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    dateRange === "30d" || (!dateRange && dateRange !== "7d" && dateRange !== "90d")
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "hover:text-slate-900 text-slate-500"
                  }`}
                >
                  30 Days
                </button>
                <button
                  type="button"
                  onClick={() => setDateRange("90d")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    dateRange === "90d"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "hover:text-slate-900 text-slate-500"
                  }`}
                >
                  90 Days
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Multi-engine brand vs competitor visibility over time
            </p>
          </div>
          <div className="flex-1">
            <SovTrajectoryChart
              data={data?.trajectory || []}
              currentSoV={currentSoV}
              brandName={currentBrand.brandName}
            />
          </div>
        </div>

        {/* Panel 2: AI Engine Performance */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-2xs flex flex-col justify-between min-h-[350px]">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-slate-900">
                AI Engine Performance
              </h2>
              <Link
                href="/reports/models"
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                View Benchmarks &rarr;
              </Link>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Visibility and win rate across AI search engines
            </p>
          </div>
          <div className="flex-1">
            <EnginePerformanceChart metrics={data?.engineMetrics || []} />
          </div>
        </div>

        {/* Panel 3: Domain Authority Distribution Donut Chart */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-2xs flex flex-col justify-between min-h-[350px]">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-slate-900">
                Domain Authority Distribution
              </h2>
              <Link
                href="/reports/citations"
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                View Explorer &rarr;
              </Link>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Key authority sources across UGC, editorial, owned, and reviews
            </p>
          </div>
          <div className="flex-1">
            <DomainAuthorityDonutChart
              breakdown={data?.domainTypeBreakdown}
            />
          </div>
        </div>

        {/* Panel 4: Top AI Citation Sources */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-2xs flex flex-col justify-between min-h-[350px]">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-slate-900">
                Top AI Citation Sources
              </h2>
              <Link
                href="/reports/citations"
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                View Explorer &rarr;
              </Link>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              The websites AI engines rely on most when answering about your brand
            </p>
          </div>
          <div className="flex-1">
            <TopCitedDomains
              domains={data?.topDomains || []}
              breakdown={data?.domainTypeBreakdown}
              brandName={currentBrand.brandName}
            />
          </div>
        </div>

        {/* Panel 5: Sentiment Distribution */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-2xs flex flex-col justify-between min-h-[350px]">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-slate-900">
                Sentiment Distribution
              </h2>
              <button
                type="button"
                onClick={() => handleOpenSentimentDrawer("all")}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Inspect All Snippets &rarr;
              </button>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              AI tone analysis across recommendation responses
            </p>
          </div>
          <div className="flex-1">
            <SentimentDistributionChart
              data={
                data?.sentimentDist || {
                  positiveCount: 0,
                  neutralCount: 0,
                  negativeCount: 0,
                  positivePercentage: 0,
                  neutralPercentage: 0,
                  negativePercentage: 0,
                }
              }
              snippets={data?.sentimentSnippets || []}
              onSelectSentiment={(sentiment) => {
                setActiveSentimentFilter(sentiment);
              }}
              onOpenDrawer={(sentiment) => handleOpenSentimentDrawer(sentiment)}
            />
          </div>
        </div>

        {/* Panel 6: Prompt Volatility & Rank Fluctuation Heatmap */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-2xs flex flex-col justify-between min-h-[350px]">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">
                  Prompt Volatility & Rank Fluctuation
                </h2>
                <span className="text-[10px] font-normal bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  7-Day Heatmap
                </span>
              </div>
              <Link
                href="/tools/prompts"
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Audit Prompts &rarr;
              </Link>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Day-to-day ranking shifts to instantly spot AI algorithm shake-ups
            </p>
          </div>
          <div className="flex-1">
            <PromptVolatilityHeatmap brandName={currentBrand.brandName} />
          </div>
        </div>
      </div>

      {/* Sentiment Drill-Down Slide-Out Sheet */}
      <SentimentDetailsSheet
        isOpen={isSentimentDrawerOpen}
        onClose={() => setIsSentimentDrawerOpen(false)}
        initialSentiment={activeSentimentFilter}
        snippets={data?.sentimentSnippets || []}
        brandName={currentBrand.brandName}
      />
    </div>
  );
}


