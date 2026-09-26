"use client";

import React, { useState } from "react";
import { EngineRunResult, SupportedEngine } from "@/lib/types";
import { EngineFavicon, Favicon } from "@/components/ui/favicon";
import { Clock, ExternalLink, ThumbsUp, ThumbsDown, Minus, Sparkles } from "lucide-react";

interface PromptRawResponsesViewProps {
  results: EngineRunResult[];
  brandName?: string;
  selectedEngine?: string;
}

const ENGINE_DISPLAY_NAMES: Record<string, string> = {
  chatgpt: "OpenAI ChatGPT",
  gemini: "Google Gemini",
  perplexity: "Perplexity AI",
  claude: "Anthropic Claude",
};

export function PromptRawResponsesView({
  results,
  brandName = "Gymshark",
  selectedEngine = "all",
}: PromptRawResponsesViewProps) {
  const [activeTab, setActiveTab] = useState<string>(selectedEngine);

  const filteredResults = results.filter((r) => {
    if (activeTab === "all") return true;
    return r.engineName.toLowerCase() === activeTab.toLowerCase();
  });

  const highlightEntities = (text: string, mentions: EngineRunResult["mentions"]) => {
    if (!mentions || mentions.length === 0) return text;

    // Create a regex to match all entity names
    const entityNames = Array.from(
      new Set(mentions.map((m) => m.entityName.trim()).filter(Boolean))
    );
    if (entityNames.length === 0) return text;

    // Sort by length desc so longer names match first
    entityNames.sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`(${entityNames.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");

    const parts = text.split(pattern);
    return parts.map((part, i) => {
      const matched = mentions.find(
        (m) => m.entityName.toLowerCase() === part.toLowerCase()
      );
      if (matched) {
        if (!matched.isCompetitor) {
          return (
            <mark
              key={i}
              className="bg-emerald-100 text-emerald-900 font-semibold px-1 py-0.5 rounded border border-emerald-300/60"
              title={`${matched.entityName} (You) - Rank #${matched.positionRank || 1}`}
            >
              {part}
            </mark>
          );
        } else {
          return (
            <mark
              key={i}
              className="bg-amber-100 text-amber-900 font-medium px-1 py-0.5 rounded border border-amber-300/60"
              title={`${matched.entityName} (Competitor) - Rank #${matched.positionRank || "-"}`}
            >
              {part}
            </mark>
          );
        }
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      {/* Engine filter pills */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          All Engines ({results.length})
        </button>
        {["chatgpt", "claude", "gemini", "perplexity"].map((eng) => {
          const hasRuns = results.some((r) => r.engineName === eng);
          if (!hasRuns) return null;
          return (
            <button
              key={eng}
              onClick={() => setActiveTab(eng)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === eng
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <EngineFavicon engine={eng} size={14} />
              <span>{ENGINE_DISPLAY_NAMES[eng] || eng}</span>
            </button>
          );
        })}
      </div>

      {/* Results list */}
      <div className="space-y-6">
        {filteredResults.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            No engine responses found matching this filter.
          </div>
        ) : (
          filteredResults.map((res) => {
            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
              >
                {/* Engine card header */}
                <div className="p-4 px-6 border-b border-slate-100 bg-slate-50/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                      <EngineFavicon engine={res.engineName} size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {ENGINE_DISPLAY_NAMES[res.engineName] || res.engineName}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Synthesized Generative Response
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Latency */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-600 bg-white border border-slate-200">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{res.latencyMs || 750}ms</span>
                    </div>

                    {/* Sentiment */}
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                        res.sentiment === "positive"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : res.sentiment === "negative"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {res.sentiment === "positive" && <ThumbsUp className="w-3 h-3" />}
                      {res.sentiment === "negative" && <ThumbsDown className="w-3 h-3" />}
                      {res.sentiment === "neutral" && <Minus className="w-3 h-3" />}
                      <span className="capitalize">{res.sentiment}</span>
                    </div>
                  </div>
                </div>

                {/* Raw response text */}
                <div className="p-6">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>Raw Response Stream</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/60 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {highlightEntities(res.rawResponseText, res.mentions)}
                  </div>
                </div>

                {/* Mentions & Citations footer grid */}
                <div className="border-t border-slate-100 bg-slate-50/30 p-5 px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mentions detected */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      Extracted Entities ({res.mentions?.length || 0})
                    </h5>
                    <div className="space-y-1.5">
                      {res.mentions?.map((m, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-slate-200/70"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {m.entityName}
                            </span>
                            {!m.isCompetitor ? (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                You
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                Competitor
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                            {m.positionRank && (
                              <span className="font-mono">#{m.positionRank}</span>
                            )}
                            <span className="capitalize text-slate-400">
                              {m.sentiment}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Citations cited */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      Citations &amp; Sources ({res.citations?.length || 0})
                    </h5>
                    <div className="space-y-1.5">
                      {res.citations?.map((c, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-slate-200/70"
                        >
                          <div className="flex items-center gap-2">
                            <Favicon domain={c.domain} size={14} />
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-slate-800 hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
                            >
                              <span>{c.domain}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                            </a>
                          </div>
                          {c.isBrandOwned && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                              Owned
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
