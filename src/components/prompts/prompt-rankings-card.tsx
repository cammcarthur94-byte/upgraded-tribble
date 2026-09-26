"use client";

import React from "react";
import { Info, Smile } from "lucide-react";
import { PromptRankingItem } from "@/lib/types";
import { BrandFavicon } from "@/components/ui/favicon";

interface PromptRankingsCardProps {
  rankings: PromptRankingItem[];
  timeframeDays?: number;
}

export function PromptRankingsCard({
  rankings,
  timeframeDays = 30,
}: PromptRankingsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">Rankings</h3>
          <div className="group relative flex items-center">
            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block z-20 w-56 p-2 text-[11px] leading-tight text-white bg-slate-900 rounded-md shadow-lg pointer-events-none">
              Top brands ranked across AI engines for this prompt query based on visibility, share of voice, and sentiment.
            </div>
          </div>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Top brands across LLMs for this prompt
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse border-y border-slate-200">
          <thead>
            <tr className="border-b border-slate-200 divide-x divide-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/75">
              <th className="py-3 px-4 w-10 text-center">#</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4 text-center">Visibility</th>
              <th className="py-3 px-4 text-center">SOV</th>
              <th className="py-3 px-4 text-center">Sentiment</th>
              <th className="py-3 px-4 text-center">Avg Position</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-700">
            {rankings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No brand rankings available for this prompt.
                </td>
              </tr>
            ) : (
              rankings.map((brand) => (
                <tr
                  key={`${brand.rank}-${brand.name}`}
                  className="hover:bg-slate-50/70 divide-x divide-slate-200 transition-colors"
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 text-center text-slate-400 font-bold">
                    {brand.rank}
                  </td>

                  {/* Brand */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <BrandFavicon
                        brandName={brand.name}
                        domain={brand.domain}
                        size={22}
                        className="rounded-md border border-slate-200/60 shadow-2xs"
                      />
                      <span className="font-semibold text-slate-900">
                        {brand.name}
                      </span>
                      {!brand.isCompetitor && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          You
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Visibility */}
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                    {brand.visibility}
                  </td>

                  {/* SOV */}
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                    {brand.sov}
                  </td>

                  {/* Sentiment */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5 justify-center">
                      <Smile
                        className={`w-4 h-4 ${
                          brand.sentimentScore >= 75
                            ? "text-emerald-500"
                            : brand.sentimentScore >= 60
                            ? "text-amber-500"
                            : "text-rose-500"
                        }`}
                      />
                      <span className="font-bold text-slate-900">
                        {brand.sentimentScore}
                      </span>
                    </div>
                  </td>

                  {/* Avg Position */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono font-medium">
                      {brand.avgPosition}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center px-5">
        <span>Showing data for {timeframeDays} days</span>
        <span className="font-semibold text-slate-700">
          {rankings.length} brands
        </span>
      </div>
    </div>
  );
}
