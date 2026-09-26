"use client";

import React, { useState } from "react";
import { MessageSquare, CheckCircle2, XCircle } from "lucide-react";
import { PromptResponseHistoryItem, SupportedEngine } from "@/lib/types";
import { EngineFavicon } from "@/components/ui/favicon";

interface PromptResponseHistoryCardProps {
  responseHistory: PromptResponseHistoryItem[];
  brandName?: string;
}

export function PromptResponseHistoryCard({
  responseHistory,
  brandName = "Gymshark",
}: PromptResponseHistoryCardProps) {
  const [selectedEngine, setSelectedEngine] = useState<string>("all");

  const filteredHistory = responseHistory.filter((item) => {
    if (selectedEngine === "all") return true;
    return item.engineName.toLowerCase() === selectedEngine.toLowerCase();
  });

  // Helper to highlight brand and competitor names with bold font
  const renderResponseSnippet = (item: PromptResponseHistoryItem) => {
    const text = item.responseText;
    if (!item.mentions || item.mentions.length === 0) {
      return <span>{text}</span>;
    }

    const uniqueNames = Array.from(
      new Set(item.mentions.map((m) => m.name.trim()).filter(Boolean))
    ).sort((a, b) => b.length - a.length);

    if (uniqueNames.length === 0) {
      return <span>{text}</span>;
    }

    const pattern = new RegExp(
      `(${uniqueNames.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "gi"
    );

    const parts = text.split(pattern);

    return (
      <span>
        {parts.map((part, i) => {
          const matched = item.mentions.find(
            (m) => m.name.toLowerCase() === part.toLowerCase()
          );
          if (matched) {
            return (
              <strong
                key={i}
                className="font-semibold text-slate-900"
              >
                {part}
              </strong>
            );
          }
          return <React.Fragment key={i}>{part}</React.Fragment>;
        })}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-700" />
          <h3 className="text-base font-bold text-slate-900">Response History</h3>
          <span className="text-xs text-slate-400 font-normal">
            · {filteredHistory.length} responses
          </span>
        </div>

        {/* Engine filter tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60">
          <button
            onClick={() => setSelectedEngine("all")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              selectedEngine === "all"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>
          {(["chatgpt", "claude", "gemini", "perplexity"] as SupportedEngine[]).map(
            (eng) => (
              <button
                key={eng}
                onClick={() => setSelectedEngine(eng)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedEngine === eng
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <EngineFavicon engine={eng} size={13} />
                <span className="capitalize">{eng}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border-y border-slate-200">
          <thead>
            <tr className="border-b border-slate-200 divide-x divide-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/75">
              <th className="py-3 px-6">AI Response</th>
              <th className="py-3 px-4 w-32 text-center">Mentioned?</th>
              <th className="py-3 px-4 w-28 text-center">Position</th>
              <th className="py-3 px-6 w-32 text-right">Last ran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-700">
            {filteredHistory.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-slate-400 text-xs"
                >
                  No response history recorded for this prompt.
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 divide-x divide-slate-200 transition-colors"
                >
                  {/* AI Response with Engine Favicon */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 p-1 rounded-md bg-slate-50 border border-slate-200/60 shadow-2xs">
                        <EngineFavicon engine={item.engineName} size={18} />
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                        {renderResponseSnippet(item)}
                      </div>
                    </div>
                  </td>

                  {/* Mentioned? (CheckCircle2 Yes / XCircle No) */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {item.isMentioned ? (
                      <div className="inline-flex items-center gap-1.5 font-medium text-slate-900 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-slate-900 text-white shrink-0" />
                        <span>Yes</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 font-medium text-slate-400 text-xs">
                        <XCircle className="w-3.5 h-3.5 text-slate-300 stroke-[1.5] shrink-0" />
                        <span>No</span>
                      </div>
                    )}
                  </td>

                  {/* Position */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {item.isMentioned && item.positionRank ? (
                      <span className="font-semibold text-slate-800 text-xs">
                        {item.positionRank}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs font-normal">
                        —
                      </span>
                    )}
                  </td>

                  {/* Last ran */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <span className="text-xs text-slate-500 font-normal">
                      {item.lastRan}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
