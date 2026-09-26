"use client";

import React, { useState } from "react";
import { EngineRunResult, SupportedEngine } from "@/lib/types";
import { EngineBadge } from "@/components/prompts/engine-badge";
import { Favicon } from "@/components/ui/favicon";
import { TextHighlighter } from "./text-highlighter";
import {
  Clock,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Globe,
  Smile,
  Meh,
  Frown,
} from "lucide-react";

interface EngineResponseCardProps {
  result: EngineRunResult;
  brandName: string;
  isFullWidth?: boolean;
}

export function EngineResponseCard({
  result,
  brandName,
  isFullWidth = false,
}: EngineResponseCardProps) {
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);

  const sentimentConfigs = {
    positive: {
      label: "Positive",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: Smile,
    },
    neutral: {
      label: "Neutral",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: Meh,
    },
    negative: {
      label: "Critical",
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      icon: Frown,
    },
  };

  const sentiment = sentimentConfigs[result.sentiment] || sentimentConfigs.neutral;
  const SentimentIcon = sentiment.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden transition-all hover:border-slate-300">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <EngineBadge engine={result.engineName} size="md" showLabel={true} />
          <span className="text-[11px] font-mono text-slate-400">
            {result.latencyMs}ms
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sentiment Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${sentiment.badge}`}
          >
            <SentimentIcon className="w-3 h-3" />
            <span>{sentiment.label}</span>
          </span>
        </div>
      </div>

      {/* Raw Response Text Viewer with Entity Highlights */}
      <div className="p-5 flex-1 overflow-y-auto max-h-[460px]">
        <TextHighlighter
          rawText={result.rawResponseText}
          mentions={result.mentions}
          brandName={brandName}
        />
      </div>

      {/* Footnote / Sources Collapsible Drawer */}
      <div className="border-t border-slate-100 bg-slate-50/40">
        <button
          onClick={() => setIsSourcesOpen(!isSourcesOpen)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Footnotes & Citations ({result.citations?.length || 0})
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isSourcesOpen ? "rotate-180 text-slate-700" : ""
            }`}
          />
        </button>

        {isSourcesOpen && (
          <div className="px-5 pb-4 pt-1 space-y-2 border-t border-slate-100/80 animate-in fade-in slide-in-from-top-1">
            {result.citations && result.citations.length > 0 ? (
              result.citations.map((citation, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="w-4 h-4 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <Favicon
                      domain={citation.domain}
                      size={14}
                      fallbackText={citation.domain}
                    />
                    <span className="font-medium text-slate-800 truncate">
                      {citation.domain}
                    </span>
                    {citation.isBrandOwned && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Owned
                      </span>
                    )}
                  </div>
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors shrink-0"
                    title="Open citation source"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-1">
                No direct URLs or footnotes cited in this response.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
