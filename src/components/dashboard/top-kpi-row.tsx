"use client";

import React from "react";
import { ProgressCircle } from "@tremor/react";
import { ArrowUpRight } from "lucide-react";
import { DashboardAnalyticsData } from "@/lib/types";

export interface TopKpiRowProps {
  data?: DashboardAnalyticsData | null;
  onOpenSentiment?: () => void;
  // Optional explicit overrides
  aeoScore?: number;
  aeoTrend?: string;
  shareOfVoice?: number | string;
  sovTrend?: string;
  sentimentPercentage?: number | string;
  sentimentLabel?: string;
  citationsCount?: number | string;
  citationsTrend?: string;
}

export function TopKpiRow({
  data,
  onOpenSentiment,
  aeoScore: propAeoScore,
  aeoTrend = "+3.2%",
  shareOfVoice: propSov,
  sovTrend: propSovTrend,
  sentimentPercentage: propSentiment,
  sentimentLabel: propSentimentLabel,
  citationsCount: propCitations,
  citationsTrend: propCitationsTrend,
}: TopKpiRowProps) {
  // 1. Dynamic derivation with exact fallback values
  const rawVisibilityScore = data?.breakdown?.visibilityScore;
  const aeoValue =
    propAeoScore !== undefined
      ? propAeoScore
      : rawVisibilityScore !== undefined && rawVisibilityScore > 0
      ? Math.round(rawVisibilityScore)
      : 70;

  const rawSov = data?.breakdown?.shareOfVoice;
  const sovValue =
    propSov !== undefined
      ? typeof propSov === "number"
        ? `${propSov.toFixed(1)}%`
        : propSov
      : rawSov !== undefined && rawSov > 0
      ? `${rawSov.toFixed(1)}%`
      : "42.5%";

  const sovBadgeText =
    propSovTrend ?? (data?.periodDeltaSoV !== undefined ? `+${data.periodDeltaSoV}%` : "+4.2%");

  const rawSentiment = data?.sentimentDist?.positivePercentage;
  const sentimentValue =
    propSentiment !== undefined
      ? typeof propSentiment === "number"
        ? `${propSentiment}%`
        : propSentiment
      : rawSentiment !== undefined && rawSentiment > 0
      ? `${rawSentiment}%`
      : "64%";

  const sentimentBadgeText =
    propSentimentLabel ??
    (rawSentiment !== undefined
      ? rawSentiment >= 60
        ? "Positive"
        : rawSentiment <= 40
        ? "Negative"
        : "Neutral"
      : "Positive");

  const rawCitations =
    data?.totalCitationsCount ?? (data?.topDomains && data.topDomains.length > 0 ? data.topDomains.length : undefined);
  const citationsValue =
    propCitations !== undefined
      ? `${propCitations}`
      : rawCitations !== undefined && rawCitations > 0
      ? `${rawCitations}`
      : "51";

  const citationsBadgeText =
    propCitationsTrend ??
    (data?.ownedCitationsCount !== undefined ? `+${data.ownedCitationsCount} this mo` : "+14 this mo");

  // Uniform cards data configuration without generic icons
  const cards = [
    {
      id: "aeo-score",
      title: "AEO Score",
      value: aeoValue,
      badge: aeoTrend,
      subtext: "Overall Visibility Index",
      showCircle: true,
      onClick: undefined,
    },
    {
      id: "share-of-voice",
      title: "Share of Voice",
      value: sovValue,
      badge: sovBadgeText,
      subtext: "Multi-Engine Category Share",
      showCircle: false,
      onClick: undefined,
    },
    {
      id: "ai-sentiment",
      title: "AI Sentiment",
      value: sentimentValue,
      badge: sentimentBadgeText,
      subtext: "Positive Sentiment Ratio",
      showCircle: false,
      onClick: onOpenSentiment,
    },
    {
      id: "websites-citing-you",
      title: "Websites Citing You",
      value: citationsValue,
      badge: citationsBadgeText,
      subtext: "Unique Referring Domains",
      showCircle: false,
      onClick: undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        return (
          <div
            key={card.id}
            onClick={card.onClick}
            className={`bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col justify-between h-[134px] transition-all shadow-2xs ${
              card.onClick
                ? "cursor-pointer hover:border-slate-300 hover:shadow-xs"
                : "hover:border-slate-300/80 hover:shadow-xs"
            }`}
            title={card.onClick ? "Click to view detailed breakdown" : undefined}
          >
            {/* Row 1: Header (Title + Status Indicator Dot) */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {card.title}
              </span>
              <span className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </span>
            </div>

            {/* Row 2: Metric Value + Badge matching reference image */}
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-semibold text-slate-900 tracking-tight leading-none font-sans">
                {card.value}
              </span>

              {card.id === "ai-sentiment" ? (
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                  {card.badge}
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 font-mono">
                  {card.badge}
                </span>
              )}
            </div>

            {/* Row 3: Subtext */}
            <div className="text-xs text-slate-400 font-normal leading-normal">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TopKpiRow;
