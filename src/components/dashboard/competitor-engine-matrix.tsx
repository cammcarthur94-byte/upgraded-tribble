"use client";

import React from "react";
import Link from "next/link";
import { CompetitorEngineMatrixRow } from "@/lib/types";
import { Favicon, EngineFavicon } from "@/components/ui/favicon";
import { ArrowRight } from "lucide-react";

interface CompetitorEngineMatrixProps {
  data?: CompetitorEngineMatrixRow[];
  brandName?: string;
}

export function CompetitorEngineMatrix({
  data = [],
  brandName = "Gymshark",
}: CompetitorEngineMatrixProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Find the top score for each engine to award leader badges
  const maxChatGPT = Math.max(...data.map((d) => d.chatgptScore));
  const maxPerplexity = Math.max(...data.map((d) => d.perplexityScore));
  const maxGemini = Math.max(...data.map((d) => d.geminiScore));
  const maxClaude = Math.max(...data.map((d) => d.claudeScore));

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-5 sm:p-6 shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-slate-800">
              Competitor Head-to-Head Engine Matrix
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50/70 text-emerald-700 font-mono">
              Live Benchmarks
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal mt-1">
            Comparative AI visibility score & leadership share across ChatGPT, Perplexity, Gemini, and Claude
          </p>
        </div>

        <Link
          href="/reports/models"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>Model Benchmark Report</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4 w-[28%]">Brand Entity</th>
              <th className="py-3 px-4 text-center w-[18%]">Overall SoV</th>
              <th className="py-3 px-3 text-center w-[13.5%]">
                <div className="flex items-center justify-center gap-1.5">
                  <EngineFavicon engine="chatgpt" size={14} />
                  <span>ChatGPT</span>
                </div>
              </th>
              <th className="py-3 px-3 text-center w-[13.5%]">
                <div className="flex items-center justify-center gap-1.5">
                  <EngineFavicon engine="perplexity" size={14} />
                  <span>Perplexity</span>
                </div>
              </th>
              <th className="py-3 px-3 text-center w-[13.5%]">
                <div className="flex items-center justify-center gap-1.5">
                  <EngineFavicon engine="gemini" size={14} />
                  <span>Gemini</span>
                </div>
              </th>
              <th className="py-3 px-3 text-center w-[13.5%]">
                <div className="flex items-center justify-center gap-1.5">
                  <EngineFavicon engine="claude" size={14} />
                  <span>Claude</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {data.map((row) => {
              const isPrimary = row.isCurrentBrand;
              const isLeadChatGPT = row.chatgptScore === maxChatGPT;
              const isLeadPerplexity = row.perplexityScore === maxPerplexity;
              const isLeadGemini = row.geminiScore === maxGemini;
              const isLeadClaude = row.claudeScore === maxClaude;

              return (
                <tr
                  key={row.brandName}
                  className={`transition-colors ${
                    isPrimary
                      ? "bg-emerald-50/40 font-semibold hover:bg-emerald-50/70"
                      : "hover:bg-slate-50/60"
                  }`}
                >
                  {/* Brand Entity Column */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <Favicon
                        domain={row.domain}
                        size={20}
                        fallbackText={row.brandName}
                        className="rounded-xs shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`truncate font-bold ${isPrimary ? "text-slate-900" : "text-slate-800"}`}>
                            {row.brandName}
                          </span>
                          {isPrimary && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal truncate block">
                          {row.domain}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Overall SoV */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`font-mono text-sm font-bold ${isPrimary ? "text-emerald-700" : "text-slate-700"}`}>
                        {row.overallSoV.toFixed(1)}%
                      </span>
                      <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isPrimary ? "bg-emerald-500" : "bg-slate-500"}`}
                          style={{ width: `${Math.min(100, row.overallSoV * 2)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* ChatGPT */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <div
                        className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs inline-flex items-center justify-center ${
                          isLeadChatGPT
                            ? "bg-emerald-100/80 text-emerald-800 border border-emerald-200"
                            : "text-slate-700 bg-slate-50 border border-slate-200/50"
                        }`}
                      >
                        <span>{row.chatgptScore.toFixed(0)}%</span>
                      </div>
                    </div>
                  </td>

                  {/* Perplexity */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <div
                        className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs inline-flex items-center justify-center ${
                          isLeadPerplexity
                            ? "bg-emerald-100/80 text-emerald-800 border border-emerald-200"
                            : "text-slate-700 bg-slate-50 border border-slate-200/50"
                        }`}
                      >
                        <span>{row.perplexityScore.toFixed(0)}%</span>
                      </div>
                    </div>
                  </td>

                  {/* Gemini */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <div
                        className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs inline-flex items-center justify-center ${
                          isLeadGemini
                            ? "bg-emerald-100/80 text-emerald-800 border border-emerald-200"
                            : "text-slate-700 bg-slate-50 border border-slate-200/50"
                        }`}
                      >
                        <span>{row.geminiScore.toFixed(0)}%</span>
                      </div>
                    </div>
                  </td>

                  {/* Claude */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <div
                        className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs inline-flex items-center justify-center ${
                          isLeadClaude
                            ? "bg-emerald-100/80 text-emerald-800 border border-emerald-200"
                            : "text-slate-700 bg-slate-50 border border-slate-200/50"
                        }`}
                      >
                        <span>{row.claudeScore.toFixed(0)}%</span>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
