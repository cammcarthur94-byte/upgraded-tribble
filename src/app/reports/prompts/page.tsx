"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBrand } from "@/context/brand-context";
import { getPromptAnalysisDataAction } from "@/app/actions/report-actions";
import { PromptAnalysisData } from "@/lib/types";
import {
  Calendar,
  Filter,
  RefreshCw,
  ChevronDown,
  FileQuestion,
  BarChart2,
  Terminal,
  MessageSquare,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { PromptRankingsCard } from "@/components/prompts/prompt-rankings-card";
import { PromptVisibilityHeatmap } from "@/components/prompts/prompt-visibility-heatmap";
import { PromptMentionSourcesCard } from "@/components/prompts/prompt-mention-sources-card";
import { PromptCitationSourcesCard } from "@/components/prompts/prompt-citation-sources-card";
import { PromptRawResponsesView } from "@/components/prompts/prompt-raw-responses-view";
import { PromptResponseHistoryCard } from "@/components/prompts/prompt-response-history-card";

function PromptAnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPromptId = searchParams.get("promptId") || undefined;

  const { currentBrand } = useBrand();

  // State
  const [data, setData] = useState<PromptAnalysisData | null>(null);
  const [selectedPromptId, setSelectedPromptId] = useState<string>(queryPromptId || "");
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<"benchmark" | "raw">("benchmark");
  const [timeframeDays, setTimeframeDays] = useState<number>(30);
  const [selectedEngine, setSelectedEngine] = useState<string>("all");

  const loadData = async (promptId?: string) => {
    setIsLoading(true);
    try {
      const res = await getPromptAnalysisDataAction(currentBrand.id, promptId);
      setData(res);
      if (res.activePrompt) {
        setSelectedPromptId(res.activePrompt.id);
      }
    } catch (err) {
      console.error("Failed to load prompt analysis data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(queryPromptId);
  }, [currentBrand.id, queryPromptId]);

  const handleSelectPrompt = (id: string) => {
    setSelectedPromptId(id);
    router.replace(`/reports/prompts?promptId=${id}`, { scroll: false });
    loadData(id);
  };

  const activePrompt = data?.activePrompt || data?.prompts[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Prompt Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            See how popular AI assistants answer specific customer questions, who they recommend first, and where{" "}
            <span className="font-semibold text-slate-700">{currentBrand.brandName}</span> stands compared to competitors.
          </p>
        </div>

        {/* Quick Link to AI Shopping */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/reports/shopping${selectedPromptId ? `?promptId=${selectedPromptId}` : ""}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 transition-colors shadow-2xs group"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Product Visibility</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Control Header: Prompt Selector, View Switcher & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 lg:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Prompt Selector Subtitle */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
            Showing metrics for:
          </span>
          <div className="relative flex-1 sm:w-80">
            <select
              value={selectedPromptId}
              onChange={(e) => handleSelectPrompt(e.target.value)}
              className="w-full text-xs font-semibold text-slate-900 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 shadow-2xs cursor-pointer truncate transition-colors"
            >
              {data?.prompts && data.prompts.length > 0 ? (
                data.prompts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.queryText}
                  </option>
                ))
              ) : (
                <option value="">No prompts configured</option>
              )}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* View Switcher: Benchmark vs Raw Responses */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 self-start sm:self-auto">
          <button
            onClick={() => setActiveView("benchmark")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === "benchmark"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Competitor Benchmark</span>
          </button>
          <button
            onClick={() => setActiveView("raw")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === "raw"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Raw AI Responses</span>
          </button>
        </div>

        {/* Right Action Controls: Timeframe, Model Filter, Reload */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Dropdown */}
          <div className="relative">
            <select
              value={timeframeDays}
              onChange={(e) => setTimeframeDays(Number(e.target.value))}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg pl-8 pr-7 py-2 appearance-none hover:bg-slate-50 shadow-2xs cursor-pointer focus:outline-hidden"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Model Filter */}
          <div className="relative">
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg pl-8 pr-7 py-2 appearance-none hover:bg-slate-50 shadow-2xs cursor-pointer focus:outline-hidden"
            >
              <option value="all">All Models</option>
              <option value="chatgpt">ChatGPT</option>
              <option value="gemini">Gemini</option>
              <option value="perplexity">Perplexity</option>
              <option value="claude">Claude</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Reload Button */}
          <button
            onClick={() => loadData(selectedPromptId)}
            disabled={isLoading}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Reload Analysis"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-indigo-600" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Main Content Render */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center text-slate-400 shadow-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-indigo-600" />
          <p className="text-sm font-medium text-slate-700">Loading analysis data...</p>
          <p className="text-xs text-slate-400 mt-1">Aggregating multi-engine prompt outputs & entity scores</p>
        </div>
      ) : !data || !data.activePrompt ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 shadow-xs">
          <FileQuestion className="w-10 h-10 mx-auto mb-3 text-slate-300 stroke-1" />
          <h3 className="text-base font-semibold text-slate-800">
            No analysis results found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Please select another prompt or schedule an audit execution in the Prompt Management tool.
          </p>
          <div className="mt-5">
            <Link
              href="/tools/prompts"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Go to Prompt Management
            </Link>
          </div>
        </div>
      ) : activeView === "benchmark" ? (
        <div className="space-y-6">
          {/* 2x2 Competitor Benchmark Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Top-Left: Rankings */}
            <PromptRankingsCard
              rankings={data.rankings}
              timeframeDays={timeframeDays}
            />

            {/* Top-Right: Visibility Heatmap */}
            <PromptVisibilityHeatmap
              heatmap={data.heatmap}
              engines={data.engines}
              timeframeDays={timeframeDays}
              userVisibility={
                data.rankings.find((r) => !r.isCompetitor)?.visibility || "100%"
              }
            />

            {/* Bottom-Left: Mention Sources */}
            <PromptMentionSourcesCard
              mentionSources={data.mentionSources}
              timeframeDays={timeframeDays}
            />

            {/* Bottom-Right: Citation Sources */}
            <PromptCitationSourcesCard
              citationSources={data.citationSources}
              timeframeDays={timeframeDays}
            />
          </div>

          {/* Response History by Engine */}
          <PromptResponseHistoryCard
            responseHistory={data.responseHistory || []}
            brandName={currentBrand.brandName}
          />
        </div>
      ) : (
        /* Raw AI Responses View */
        <PromptRawResponsesView
          results={data.inspection?.results || []}
          brandName={currentBrand.brandName}
          selectedEngine={selectedEngine}
        />
      )}
    </div>
  );
}

export default function PromptAnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
          <p className="text-xs">Loading page...</p>
        </div>
      }
    >
      <PromptAnalysisContent />
    </Suspense>
  );
}
