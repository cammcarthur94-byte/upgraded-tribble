"use client";

import React, { useState, useEffect } from "react";
import { SentimentDistributionData, SentimentSnippetItem } from "@/lib/types";
import { EngineFavicon } from "@/components/ui/favicon";

interface SentimentDistributionChartProps {
  data: SentimentDistributionData;
  snippets?: SentimentSnippetItem[];
  onSelectSentiment?: (sentiment: "positive" | "neutral" | "negative") => void;
  onOpenDrawer?: (sentiment: "positive" | "neutral" | "negative") => void;
  className?: string;
}

interface SentimentExample {
  title: string;
  engine: string;
  engineName: string;
  timestamp: string;
  quote: string;
  count: number;
  badgeLabel: string;
  accentBg: string;
  accentText: string;
}

const DEFAULT_SENTIMENT_EXAMPLES: Record<
  "positive" | "neutral" | "negative",
  SentimentExample
> = {
  positive: {
    title: "Positive Recommendation Example",
    engine: "perplexity",
    engineName: "Perplexity AI",
    timestamp: "Audited today, 2h ago",
    quote:
      "Gymshark is widely cited as the gold standard for high-compression seamless leggings, offering squat-proof durability and body-contouring ribbing that outlasts traditional alternatives.",
    count: 6092,
    badgeLabel: "Positive",
    accentBg: "bg-emerald-500",
    accentText: "text-emerald-600",
  },
  neutral: {
    title: "Neutral Comparison Example",
    engine: "chatgpt",
    engineName: "OpenAI ChatGPT",
    timestamp: "Audited today, 3h ago",
    quote:
      "Gymshark offers accessible pricing and contemporary athletic designs comparable to Nike and Under Armour, though waistband elasticity and fabric breathability vary across specific collections.",
    count: 2570,
    badgeLabel: "Neutral",
    accentBg: "bg-slate-400",
    accentText: "text-slate-600",
  },
  negative: {
    title: "Critical Review Example",
    engine: "gemini",
    engineName: "Google Gemini",
    timestamp: "Audited yesterday",
    quote:
      "Several buyer analyses note inconsistent sizing across international batches, with compression leggings frequently running smaller than standard North American athletic sizing.",
    count: 856,
    badgeLabel: "Critical",
    accentBg: "bg-rose-500",
    accentText: "text-rose-600",
  },
};

export function SentimentDistributionChart({
  data,
  snippets = [],
  onSelectSentiment,
  onOpenDrawer,
  className = "",
}: SentimentDistributionChartProps) {
  const [mounted, setMounted] = useState(false);
  const [activeSentiment, setActiveSentiment] = useState<"positive" | "neutral" | "negative">("positive");
  const [hoveredSentiment, setHoveredSentiment] = useState<"positive" | "neutral" | "negative" | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const posPct = data?.positivePercentage || 64;
  const neuPct = data?.neutralPercentage || 27;
  const critPct = data?.negativePercentage || 9;

  const categories: Array<{
    key: "positive" | "neutral" | "negative";
    name: string;
    count: number;
    percentage: number;
    color: string;
    hexColor: string;
    hoverHexColor: string;
    description: string;
  }> = [
    {
      key: "positive",
      name: "Positive",
      count: data?.positiveCount ?? 6092,
      percentage: posPct,
      color: "bg-emerald-500",
      hexColor: "#10b981",
      hoverHexColor: "#059669",
      description: "Favorable brand recommendations",
    },
    {
      key: "neutral",
      name: "Neutral",
      count: data?.neutralCount ?? 2570,
      percentage: neuPct,
      color: "bg-slate-300",
      hexColor: "#cbd5e1",
      hoverHexColor: "#94a3b8",
      description: "Objective & comparative mentions",
    },
    {
      key: "negative",
      name: "Critical",
      count: data?.negativeCount ?? 856,
      percentage: critPct,
      color: "bg-rose-400",
      hexColor: "#fca5a5",
      hoverHexColor: "#f87171",
      description: "Critiques, sizing & competitor trade-offs",
    },
  ];

  const handleSelectCategory = (catKey: "positive" | "neutral" | "negative") => {
    setActiveSentiment(catKey);
    onSelectSentiment?.(catKey);
  };

  const activeCategory = categories.find((c) => c.key === activeSentiment) || categories[0];
  const displayedCategory =
    categories.find((c) => c.key === (hoveredSentiment || activeSentiment)) || categories[0];
  const activeSnippets = snippets.filter((s) => s.sentiment === activeSentiment);
  const fallbackExample = DEFAULT_SENTIMENT_EXAMPLES[activeSentiment];

  const activeQuote = activeSnippets[0]?.snippet || fallbackExample.quote;
  const currentExample: SentimentExample = {
    ...fallbackExample,
    engine: (activeSnippets[0]?.engineName?.toLowerCase() as any) || fallbackExample.engine,
    engineName: activeSnippets[0]?.engineName || fallbackExample.engineName,
    count: activeCategory.count,
    quote: activeQuote,
  };

  return (
    <div className={`w-full h-full flex flex-col justify-between space-y-4 ${className}`}>
      {/* Upper Section: Sleek Ring Gauge (Left) & Sentiment Rows (Right) */}
      <div className="flex flex-col sm:flex-row items-center gap-6 flex-1 py-1">
        {/* Left: Sleek SVG Ring Gauge matching user's exact design reference */}
        <div className="relative w-[140px] h-[140px] shrink-0 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 140 140"
            aria-label="Sentiment distribution ring gauge"
          >
            {/* 1. Base Slate Track (covers full circle / neutral region) */}
            <circle
              cx="70"
              cy="70"
              r="50"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
              className="transition-colors duration-300"
            />

            {/* 2. Active Neutral Highlight Arc (when Neutral is hovered or active) */}
            {(hoveredSentiment === "neutral" || (activeSentiment === "neutral" && !hoveredSentiment)) && (
              <circle
                cx="70"
                cy="70"
                r="50"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="13"
                strokeDasharray={`${314.16 * 0.27} 314.16`}
                strokeDashoffset={`-${314.16 * (280.8 / 360)}`}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
              />
            )}

            {/* 3. Coral / Pink Arc (Critical: ~9% at top right: 18° to 50.4°) */}
            <circle
              cx="70"
              cy="70"
              r="50"
              fill="none"
              stroke={
                hoveredSentiment === "negative" || activeSentiment === "negative"
                  ? "#f43f5e"
                  : "#fda4af"
              }
              strokeWidth={hoveredSentiment === "negative" ? "14" : "12"}
              strokeDasharray={`${314.16 * 0.09} 314.16`}
              strokeDashoffset={`-${314.16 * (18 / 360)}`}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredSentiment("negative")}
              onMouseLeave={() => setHoveredSentiment(null)}
              onClick={() => handleSelectCategory("negative")}
            />

            {/* 4. Emerald Green Arc (Positive: ~64% from 50.4° to 280.8° with rounded caps) */}
            <circle
              cx="70"
              cy="70"
              r="50"
              fill="none"
              stroke={
                hoveredSentiment === "positive" || (activeSentiment === "positive" && !hoveredSentiment)
                  ? "#10b981"
                  : "#34d399"
              }
              strokeWidth={
                hoveredSentiment === "positive" || (activeSentiment === "positive" && !hoveredSentiment)
                  ? "13"
                  : "12"
              }
              strokeDasharray={`${314.16 * 0.64} 314.16`}
              strokeDashoffset={`-${314.16 * (50.4 / 360)}`}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer drop-shadow-[0_1px_2px_rgba(16,185,129,0.25)]"
              onMouseEnter={() => setHoveredSentiment("positive")}
              onMouseLeave={() => setHoveredSentiment(null)}
              onClick={() => handleSelectCategory("positive")}
            />
          </svg>

          {/* Centered KPI Typography matching user's exact design reference */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <span className="text-3xl font-bold text-slate-900 tracking-tight leading-none font-sans">
              {displayedCategory.percentage}%
            </span>
            <span className="text-xs text-slate-400 font-normal lowercase mt-1 tracking-normal">
              {displayedCategory.name.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Right: Spacious Sentiment Breakdown Rows with Zero Text Clipping */}
        <div className="flex-1 w-full flex flex-col justify-center space-y-2">
          {categories.map((item) => {
            const isSelected = activeSentiment === item.key;
            const isHovered = hoveredSentiment === item.key;
            const isHighlighted = isHovered || (isSelected && !hoveredSentiment);

            return (
              <div
                key={item.name}
                onMouseEnter={() => {
                  setHoveredSentiment(item.key);
                }}
                onMouseLeave={() => {
                  setHoveredSentiment(null);
                }}
                onClick={() => handleSelectCategory(item.key)}
                className={`p-2.5 px-3 rounded-2xl border transition-all duration-150 cursor-pointer ${
                  isHighlighted
                    ? "bg-slate-50 border-slate-200/90 shadow-2xs"
                    : "border-transparent hover:bg-slate-50/50"
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSelectCategory(item.key);
                  }
                }}
              >
                {/* Line 1: Indicator + Category Name on Left, Percentage on Right */}
                <div className="flex items-center justify-between mb-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                    <span
                      className={`font-semibold ${
                        isHighlighted ? "text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono text-xs">
                    {item.percentage}%
                  </span>
                </div>

                {/* Line 2: Description on Left, Mentions on Right (Zero text clipping) */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pl-4">
                  <span className="text-slate-500 font-normal pr-2">
                    {item.description}
                  </span>
                  <span className="shrink-0 font-mono text-slate-400">
                    {item.count.toLocaleString()} mentions
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lower Section: Interactive Recommendation Example with Engine Attribution & Timestamp */}
      <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`w-1 h-3.5 ${currentExample.accentBg} rounded-full shrink-0`} />
            <span className="font-semibold text-slate-800">
              {currentExample.title}
            </span>

            {/* Engine Attribution Badge */}
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs text-[11px] text-slate-600">
              <EngineFavicon engine={currentExample.engine} size={14} className="rounded-xs shrink-0" />
              <span className="font-medium text-slate-800">{currentExample.engineName}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-400 text-[10px]">{currentExample.timestamp}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenDrawer?.(activeSentiment)}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            Inspect All ({currentExample.count.toLocaleString()}) &rarr;
          </button>
        </div>

        <p className="text-xs text-slate-700 italic font-normal leading-relaxed">
          &ldquo;{activeQuote}&rdquo;
        </p>

        <div className={`text-[11px] font-medium ${currentExample.accentText}`}>
          Active: {currentExample.badgeLabel}
        </div>
      </div>
    </div>
  );
}

export default SentimentDistributionChart;
