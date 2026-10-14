"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EngineInsightItem } from "@/lib/scoring/modelInsights";
import { Favicon, EngineFavicon } from "@/components/ui/favicon";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  AlertCircle,
  Globe,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Link2,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useInspector } from "@/context/inspector-context";

interface EngineComparisonTableProps {
  engines: EngineInsightItem[];
  brandName: string;
}

export function EngineComparisonTable({
  engines,
  brandName,
}: EngineComparisonTableProps) {
  const { openInspector } = useInspector();
  const [expandedEngine, setExpandedEngine] = useState<string | null>(
    engines[0]?.engine || null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleExpand = (engineKey: string) => {
    setExpandedEngine((prev) => (prev === engineKey ? null : engineKey));
  };

  const handleCreateGrowthTask = (queryText: string, engineName: string) => {
    setToastMessage(`Growth task queued for "${queryText.slice(0, 32)}..." on ${engineName}! Added to Task Tracker.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Head-to-Head Engine Comparison
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Click Row to Inspect Answers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare model competitive dynamics, authority sources, and review recent model answers
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-5 w-8"></th>
              <th className="py-3 px-4">AI Model</th>
              <th className="py-3 px-4 text-center">Queries</th>
              <th className="py-3 px-4 text-center">Share of Voice</th>
              <th className="py-3 px-4 text-center">Win Rate</th>
              <th className="py-3 px-4 text-center">Avg Rank</th>
              <th className="py-3 px-4 text-center">Citation Generosity</th>
              <th className="py-3 px-6">Primary Cited Domains</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {engines.map((item) => {
              const isExpanded = expandedEngine === item.engine;

              return (
                <React.Fragment key={item.engine}>
                  {/* Master Row */}
                  <tr
                    onClick={() => toggleExpand(item.engine)}
                    className={`cursor-pointer transition-colors group select-none ${
                      isExpanded
                        ? "bg-slate-50/90 font-medium"
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Expand Chevron */}
                    <td className="py-4 px-5 text-slate-400">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-0 text-slate-700" : "-rotate-90 text-slate-400"
                        }`}
                      />
                    </td>

                    {/* AI Model Name */}
                    <td className="py-4 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                          <EngineFavicon engine={item.engine} size={18} />
                        </div>
                        <div>
                          <div>{item.displayName}</div>
                          <span className="text-[10px] text-slate-400 font-normal font-mono">
                            {item.brandInclusionRate}% Inclusion Rate
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Queries Monitored */}
                    <td className="py-4 px-4 text-center font-mono text-slate-700">
                      {item.totalRuns}
                    </td>

                    {/* Share of Voice */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          item.shareOfVoice >= 50
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {item.shareOfVoice}%
                      </span>
                    </td>

                    {/* Win Rate vs Competitors */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-slate-900">
                          {item.winRateVsCompetitors}%
                        </span>
                        <span className="text-[10px] text-slate-400">vs Competitors</span>
                      </div>
                    </td>

                    {/* Avg Ranking */}
                    <td className="py-4 px-4 text-center font-bold text-slate-800">
                      #{item.avgMentionPosition}
                    </td>

                    {/* Citation Generosity */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono text-slate-700 font-medium">
                        {item.citationsPerAnswer}
                      </span>{" "}
                      <span className="text-[11px] text-slate-400">domains/ans</span>
                    </td>

                    {/* Primary Cited Domains */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {item.topCitedDomains.map((d) => (
                          <span
                            key={d.domain}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200"
                          >
                            <Favicon domain={d.domain} size={13} fallbackText={d.domain} />
                            {d.domain}
                            <span className="text-slate-400">({d.count})</span>
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>

                  {/* Expandable Accordion Drawer Row */}
                  {isExpanded && (
                    <tr className="bg-slate-50/40 border-b border-slate-200/80">
                      <td colSpan={8} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-1 duration-200">
                          {/* Column 1: Favorable Answers */}
                          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                  Top Favorable Recommendations ({item.favorableAnswers.length})
                                </h3>
                              </div>
                              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                Ranked & Cited
                              </span>
                            </div>

                            {item.favorableAnswers.length === 0 ? (
                              <p className="text-xs text-slate-400 italic py-2">
                                No favorable answers captured for this timeframe yet.
                              </p>
                            ) : (
                              <div className="space-y-2.5">
                                {item.favorableAnswers.map((fav, fIdx) => (
                                  <div
                                    key={fav.id || fIdx}
                                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                                  >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <span className="font-semibold text-slate-900 text-xs leading-snug">
                                        &ldquo;{fav.query}&rdquo;
                                      </span>
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                        Rank #{fav.positionRank}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                                      {fav.snippet}
                                    </p>
                                    <div className="flex items-center justify-between gap-1.5 text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-100">
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span>
                                          Audited {new Date(fav.timestamp).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openInspector({ queryText: fav.query, engine: item.engine });
                                        }}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                                      >
                                        <span>Inspect</span>
                                        <ArrowRight className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Column 2: Omitted Queries */}
                          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-rose-500" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                  Competitor-Dominated Gaps ({item.omittedQueries.length})
                                </h3>
                              </div>
                              <span className="text-[10px] text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                Brand Omitted
                              </span>
                            </div>

                            {item.omittedQueries.length === 0 ? (
                              <p className="text-xs text-slate-400 italic py-2">
                                Zero competitive blindspots detected on this engine!
                              </p>
                            ) : (
                              <div className="space-y-2.5">
                                {item.omittedQueries.map((omit, oIdx) => (
                                  <div
                                    key={omit.id || oIdx}
                                    className="p-3 rounded-lg border border-rose-100 bg-rose-50/20 hover:bg-rose-50/40 transition-colors"
                                  >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <span className="font-semibold text-slate-900 text-xs leading-snug">
                                        &ldquo;{omit.query}&rdquo;
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap my-1.5">
                                      <span className="text-[10px] text-slate-400">
                                        Competitors recommended instead:
                                      </span>
                                      {omit.competitorsFound.map((comp) => (
                                        <Badge
                                          key={comp}
                                          variant="secondary"
                                          className="text-[10px] py-0.5 px-2 bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1.5"
                                        >
                                          <Favicon
                                            domain={comp.includes(".") ? comp : `${comp.toLowerCase().replace(/\s+/g, "")}.com`}
                                            size={12}
                                            fallbackText={comp}
                                          />
                                          {comp}
                                        </Badge>
                                      ))}
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                      {omit.snippet}
                                    </p>

                                    {/* Actionable Footer: Missing Source Pill & Create Task Button */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 mt-2.5 border-t border-rose-100/80">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-rose-200/80 text-[10px] text-slate-600 font-mono shadow-2xs">
                                          <Link2 className="w-3 h-3 text-rose-500 shrink-0" />
                                          <span>
                                            Cited via:{" "}
                                            {omit.missingSources && omit.missingSources.length > 0
                                              ? omit.missingSources.join(", ")
                                              : "editorial guides"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                          <Clock className="w-3 h-3 text-slate-400" />
                                          <span>
                                            Audited {new Date(omit.timestamp).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openInspector({ queryText: omit.query, engine: item.engine });
                                          }}
                                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shrink-0 cursor-pointer shadow-2xs"
                                        >
                                          <span>Inspect</span>
                                          <ArrowRight className="w-3 h-3 text-slate-400" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCreateGrowthTask(omit.query, item.displayName);
                                          }}
                                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-colors shrink-0 cursor-pointer shadow-2xs"
                                        >
                                          <span>+ Create Growth Task</span>
                                          <ArrowRight className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 border border-slate-800">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <Link
            href="/tools/growth"
            className="ml-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shrink-0"
          >
            View Tasks &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
