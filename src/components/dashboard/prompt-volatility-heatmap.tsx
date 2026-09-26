"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PromptVolatilityHeatmapProps {
  brandName?: string;
  className?: string;
}

export function PromptVolatilityHeatmap({
  brandName = "Gymshark",
  className = "",
}: PromptVolatilityHeatmapProps) {
  const volatilityRows = [
    {
      prompt: "affordable alternatives to alo yoga sets",
      days: [1, 1, 2, 2, 4, 4, 4],
      status: "Shake-up",
      statusStyle: "bg-rose-50 text-rose-600 border border-rose-100",
    },
    {
      prompt: "gymshark vs nike leggings durability",
      days: [1, 1, 1, 2, 3, 2, 2],
      status: "Fluctuating",
      statusStyle: "bg-amber-50 text-amber-600 border border-amber-100",
    },
    {
      prompt: "best gym wear for heavy lifting",
      days: [1, 1, 1, 1, 1, 1, 1],
      status: "Stable",
      statusStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      prompt: "seamless workout leggings high...",
      days: [2, 2, 1, 1, 2, 1, 1],
      status: "Stable",
      statusStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      prompt: "where to buy authentic gymshark sets",
      days: [1, 1, 1, 1, 1, 1, 1],
      status: "Stable",
      statusStyle: "bg-emerald-50 text-emerald-600",
    },
  ];

  const daysHeader = [
    { label: "SUN", day: "13" },
    { label: "MON", day: "14" },
    { label: "TUE", day: "15" },
    { label: "WED", day: "16" },
    { label: "THU", day: "17" },
    { label: "FRI", day: "18" },
    { label: "TODAY", day: "19", isToday: true },
  ];

  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return "bg-emerald-100/90 text-emerald-800 font-semibold";
    if (rank === 2) return "bg-blue-100/90 text-blue-800 font-semibold";
    if (rank === 3) return "bg-amber-100/90 text-amber-800 font-semibold";
    return "bg-rose-100/90 text-rose-800 font-semibold";
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-between space-y-4 ${className}`}
    >
      {/* Legend Row matching reference image 2 */}
      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>#1 Pick</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>#2 Pick</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Slight Drop (#3)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Drop (&gt;#3)</span>
        </div>
      </div>

      {/* 12-Column Table Header matching reference image 2 */}
      <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
        <div className="col-span-4">Tracked Prompt</div>
        <div className="col-span-6 grid grid-cols-7 text-center">
          {daysHeader.map((d, i) => (
            <div key={i} className={`flex flex-col items-center ${d.isToday ? "text-slate-900 font-bold" : ""}`}>
              <span className="text-[9px]">{d.label}</span>
              <span className="text-[10px]">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="col-span-2 text-right">Stability</div>
      </div>

      {/* Volatility Rows */}
      <div className="space-y-2 flex-1 flex flex-col justify-around">
        {volatilityRows.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-12 gap-2 items-center py-1.5 border-b border-slate-50 last:border-0 text-xs hover:bg-slate-50/50 rounded px-1 transition-colors"
          >
            <div
              className="col-span-4 font-medium text-slate-700 leading-tight text-xs pr-2"
              title={row.prompt}
            >
              {row.prompt}
            </div>
            <div className="col-span-6 grid grid-cols-7 gap-1 text-center items-center">
              {row.days.map((val, dIdx) => (
                <span
                  key={dIdx}
                  className={`inline-flex items-center justify-center w-6 h-6 mx-auto rounded text-[11px] font-mono ${getRankBadgeClass(
                    val
                  )}`}
                >
                  {val}
                </span>
              ))}
            </div>
            <div className="col-span-2 text-right">
              <span
                className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${row.statusStyle}`}
              >
                {row.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Footer Notice matching reference image */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-rose-500 pt-1">
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-100/80 text-rose-500 text-[10px] font-bold">
          !
        </span>
        <span>1 Algorithm Shake-up Detected</span>
      </div>
    </div>
  );
}

export default PromptVolatilityHeatmap;
