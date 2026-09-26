"use client";

import React from "react";
import { Info } from "lucide-react";
import { PromptHeatmapRow, SupportedEngine } from "@/lib/types";
import { BrandFavicon, EngineFavicon } from "@/components/ui/favicon";

interface PromptVisibilityHeatmapProps {
  heatmap: PromptHeatmapRow[];
  engines?: SupportedEngine[];
  timeframeDays?: number;
  userVisibility?: string;
}

const ENGINE_LABELS: Record<string, string> = {
  gemini: "Gemini",
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  claude: "Claude",
};

function getHeatmapCellClass(pct: number) {
  if (pct >= 80) {
    return "bg-emerald-500/15 text-emerald-700 font-bold border border-emerald-500/25";
  }
  if (pct >= 50) {
    return "bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/15";
  }
  if (pct >= 25) {
    return "bg-amber-500/15 text-amber-700 font-medium border border-amber-500/20";
  }
  return "bg-rose-500/10 text-rose-600/80 font-normal border border-rose-500/15";
}

export function PromptVisibilityHeatmap({
  heatmap,
  engines = ["gemini", "chatgpt", "perplexity", "claude"],
  timeframeDays = 30,
  userVisibility = "100%",
}: PromptVisibilityHeatmapProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">Visibility</h3>
          <div className="group relative flex items-center">
            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block z-20 w-56 p-2 text-[11px] leading-tight text-white bg-slate-900 rounded-md shadow-lg pointer-events-none">
              Frequency of brand recommendations across specific generative engines for this prompt.
            </div>
          </div>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Competitor visibility for this prompt
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse border-y border-slate-200">
          <thead>
            <tr className="border-b border-slate-200 divide-x divide-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/75">
              <th className="py-3 px-4 w-44">Brand</th>
              {engines.map((eng) => (
                <th key={eng} className="py-3 px-3 text-center">
                  <div className="inline-flex items-center gap-1.5 justify-center">
                    <EngineFavicon engine={eng} size={15} />
                    <span className="capitalize">{ENGINE_LABELS[eng] || eng}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-700">
            {heatmap.length === 0 ? (
              <tr>
                <td
                  colSpan={engines.length + 1}
                  className="py-8 text-center text-slate-400"
                >
                  No visibility heatmap data available.
                </td>
              </tr>
            ) : (
              heatmap.map((row) => (
                <tr
                  key={row.name}
                  className="hover:bg-slate-50/70 divide-x divide-slate-200 transition-colors"
                >
                  {/* Brand */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <BrandFavicon
                        brandName={row.name}
                        domain={row.domain}
                        size={22}
                        className="rounded-md border border-slate-200/60 shadow-2xs"
                      />
                      <span className="font-semibold text-slate-900 truncate max-w-[120px]">
                        {row.name}
                      </span>
                      {!row.isCompetitor && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          You
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Engine Cells */}
                  {engines.map((eng) => {
                    const cell = row.scores[eng] || { pctString: "0%", pct: 0 };
                    return (
                      <td key={eng} className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center min-w-[54px] py-1 px-2 rounded-md text-xs transition-all ${getHeatmapCellClass(
                            cell.pct
                          )}`}
                        >
                          {cell.pctString}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Legend */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center px-5">
        <div className="flex items-center gap-3">
          <span>Showing data for {timeframeDays} days</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60 text-[11px]">
            You: {userVisibility}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Low</span>
          <div className="flex items-center gap-0.5">
            <span className="w-3.5 h-3.5 rounded-xs bg-rose-500/20 border border-rose-500/30" />
            <span className="w-3.5 h-3.5 rounded-xs bg-amber-500/25 border border-amber-500/30" />
            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500/20 border border-emerald-500/30" />
            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500/50 border border-emerald-500/60" />
          </div>
          <span className="text-slate-400">High</span>
        </div>
      </div>
    </div>
  );
}
