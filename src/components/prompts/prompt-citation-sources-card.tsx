"use client";

import React from "react";
import { Info, ExternalLink } from "lucide-react";
import { PromptCitationSourceItem, PromptCitationType } from "@/lib/types";
import { Favicon } from "@/components/ui/favicon";

interface PromptCitationSourcesCardProps {
  citationSources: PromptCitationSourceItem[];
  timeframeDays?: number;
}

const CITATION_TYPE_BADGES: Record<PromptCitationType, string> = {
  Owned: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  Editorial: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  Forum: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  Social: "bg-pink-500/10 text-pink-700 border-pink-500/20",
  Competitor: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  Other: "bg-slate-100 text-slate-700 border-slate-200",
};

export function PromptCitationSourcesCard({
  citationSources,
  timeframeDays = 30,
}: PromptCitationSourcesCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">Citation Sources</h3>
          <div className="group relative flex items-center">
            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block z-20 w-56 p-2 text-[11px] leading-tight text-white bg-slate-900 rounded-md shadow-lg pointer-events-none">
              Top web domains and reference sources cited by AI engines answering this prompt.
            </div>
          </div>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Domains cited for this prompt
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse border-y border-slate-200">
          <thead>
            <tr className="border-b border-slate-200 divide-x divide-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/75">
              <th className="py-3 px-4 w-10 text-center">#</th>
              <th className="py-3 px-4">Domain</th>
              <th className="py-3 px-4 text-center">% of runs</th>
              <th className="py-3 px-4 text-center">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-700">
            {citationSources.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  No citation sources recorded for this prompt.
                </td>
              </tr>
            ) : (
              citationSources.map((source) => (
                <tr
                  key={`${source.rank}-${source.domain}`}
                  className="hover:bg-slate-50/70 divide-x divide-slate-200 transition-colors"
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 text-center text-slate-400 font-bold">
                    {source.rank}
                  </td>

                  {/* Domain */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <Favicon
                        domain={source.domain}
                        size={18}
                        className="rounded-xs border border-slate-200/60 shadow-2xs"
                      />
                      <a
                        href={`https://${source.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors inline-flex items-center gap-1 group"
                      >
                        <span>{source.domain}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </a>
                    </div>
                  </td>

                  {/* % of runs */}
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                    {source.percentage}
                  </td>

                  {/* Type Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                        CITATION_TYPE_BADGES[source.type] ||
                        CITATION_TYPE_BADGES.Other
                      }`}
                    >
                      {source.type}
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
        <span>Last {timeframeDays} days · All models</span>
        <span className="font-semibold text-slate-700">
          {citationSources.length} sources
        </span>
      </div>
    </div>
  );
}
