import React from "react";
import { DashboardAnalyticsData } from "@/lib/types";
import { GLOBAL_METRICS_30D } from "@/data/mockDataStore";

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
  citationsTitle?: string;
}

export function TopKpiRow({
  data,
  onOpenSentiment,
  aeoScore: propAeoScore,
  aeoTrend = GLOBAL_METRICS_30D.aeoTrend,
  shareOfVoice: propSov,
  sovTrend: propSovTrend,
  sentimentPercentage: propSentiment,
  sentimentLabel: propSentimentLabel,
  citationsCount: propCitations,
  citationsTrend: propCitationsTrend,
  citationsTitle = "Websites Citing You",
}: TopKpiRowProps) {
  // 1. Dynamic derivation with single source of truth fallback values
  const rawVisibilityScore = data?.breakdown?.visibilityScore;
  const aeoValue =
    propAeoScore !== undefined
      ? propAeoScore
      : rawVisibilityScore !== undefined && rawVisibilityScore > 0
      ? Math.round(rawVisibilityScore)
      : GLOBAL_METRICS_30D.aeoScore;

  const rawSov = data?.breakdown?.shareOfVoice;
  const sovValue =
    propSov !== undefined
      ? typeof propSov === "number"
        ? `${propSov.toFixed(1)}%`
        : propSov
      : rawSov !== undefined && rawSov > 0
      ? `${rawSov.toFixed(1)}%`
      : `${GLOBAL_METRICS_30D.shareOfVoice}%`;

  const sovBadgeText =
    propSovTrend ?? (data?.periodDeltaSoV !== undefined ? `+${data.periodDeltaSoV}%` : GLOBAL_METRICS_30D.sovTrend);

  const rawSentiment = data?.sentimentDist?.positivePercentage;
  const sentimentValue =
    propSentiment !== undefined
      ? typeof propSentiment === "number"
        ? `${propSentiment}%`
        : propSentiment
      : rawSentiment !== undefined && rawSentiment > 0
      ? `${rawSentiment}%`
      : `${GLOBAL_METRICS_30D.sentimentBreakdown.positivePct}%`;

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
      : `${GLOBAL_METRICS_30D.referringDomains}`;

  const citationsBadgeText =
    propCitationsTrend ??
    (data?.ownedCitationsCount !== undefined ? `+${data.ownedCitationsCount} this mo` : GLOBAL_METRICS_30D.referringDomainsTrend);

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
      title: citationsTitle,
      value: citationsValue,
      badge: citationsBadgeText,
      subtext: "Unique Referring Domains",
      showCircle: false,
      onClick: undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card) => {
        return (
          <div
            key={card.id}
            onClick={card.onClick}
            className={`bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between min-h-[134px] min-w-0 transition-all shadow-2xs ${
              card.onClick
                ? "cursor-pointer hover:border-slate-300 hover:shadow-xs"
                : "hover:border-slate-300/80 hover:shadow-xs"
            }`}
            title={card.onClick ? "Click to view detailed breakdown" : undefined}
          >
            {/* Row 1: Header (Title + Status Indicator or Circular Progress) */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 truncate">
                {card.title}
              </span>
              {card.showCircle ? (
                <div
                  className="relative w-5 h-5 flex items-center justify-center shrink-0"
                  title={`${card.value}/100 AEO Score`}
                >
                  <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray={`${Number(card.value) || 70}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              ) : (
                <span className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
              )}
            </div>

            {/* Row 2: Metric Value + Badge */}
            <div className="flex items-baseline gap-2.5 flex-wrap min-w-0 my-1">
              <span className="text-3xl font-semibold text-slate-900 tracking-tight leading-none font-sans">
                {card.value}
              </span>

              {card.id === "ai-sentiment" ? (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md shrink-0">
                  {card.badge}
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 font-mono shrink-0">
                  {card.badge}
                </span>
              )}
            </div>

            {/* Row 3: Subtext */}
            <div className="text-xs text-slate-400 font-normal leading-normal truncate">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TopKpiRow;
