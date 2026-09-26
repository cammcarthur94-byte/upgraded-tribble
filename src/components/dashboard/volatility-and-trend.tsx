"use client";

import React from "react";
import Link from "next/link";
import { SovTrajectoryPoint } from "@/lib/types";
import { SovTrajectoryChart } from "./sov-trajectory-chart";

interface VolatilityRow {
  prompt: string;
  days: number[];
  status: "Shake-up" | "Fluctuating" | "Stable" | string;
  statusStyle: string;
}

interface VolatilityAndTrendProps {
  brandName?: string;
  sovData?: SovTrajectoryPoint[];
  currentSoV?: number;
  volatilityRows?: VolatilityRow[];
  className?: string;
}

const DEFAULT_VOLATILITY_ROWS: VolatilityRow[] = [
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

const DEFAULT_DAYS_HEADER = ["SUN 13", "MON 14", "TUE 15", "WED 16", "THU 17", "FRI 18", "TODAY 19"];

export default function VolatilityAndTrend({
  brandName = "Gymshark",
  sovData,
  currentSoV = 64,
  volatilityRows = DEFAULT_VOLATILITY_ROWS,
  className = "",
}: VolatilityAndTrendProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto ${className}`}>
      
      {/* 1. SHARE OF VOICE (Clean Line Chart Container) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Share of Voice</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-engine brand vs competitor visibility share over time
              </p>
            </div>
            <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              30 Days
            </span>
          </div>

          {/* If live recharts sovData is provided, render the interactive SovTrajectoryChart, otherwise render the clean minimalist mock */}
          {sovData && sovData.length > 0 ? (
            <SovTrajectoryChart
              data={sovData}
              currentSoV={currentSoV}
              brandName={brandName}
            />
          ) : (
            <>
              {/* Minimalist Legend Switcher */}
              <div className="flex items-center gap-4 mb-6 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> {brandName}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-300" /> Nike
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-300" /> Alo Yoga
                </div>
              </div>

              {/* Chart Viewport Mock (Borderless & Gridless) */}
              <div className="h-48 w-full bg-slate-50/40 rounded-xl border border-slate-100 flex items-end px-4 pb-4 relative overflow-hidden">
                {/* Subtle Trend Line representation */}
                <div className="absolute inset-x-0 bottom-12 h-20 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="w-full flex justify-between items-end text-[10px] text-slate-400 pt-2 border-t border-slate-200/60 font-mono">
                  <span>Aug 22</span>
                  <span>Aug 26</span>
                  <span>Aug 31</span>
                  <span>Sep 4</span>
                  <span>Sep 8</span>
                  <span>Sep 12</span>
                  <span>Sep 19</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. PROMPT VOLATILITY & RANK FLUCTUATION MATRIX */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Prompt Volatility & Rank Fluctuation</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Day-to-day ranking shifts across active queries
              </p>
            </div>
            <Link
              href="/tools/prompts"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors inline-block"
            >
              Audit Prompts &rarr;
            </Link>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-12 gap-2 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Tracked Prompt</div>
            <div className="col-span-6 grid grid-cols-7 text-center">
              {DEFAULT_DAYS_HEADER.map((d, i) => (
                <span key={i} className={i === 6 ? "text-indigo-600 font-bold" : ""}>
                  {d.slice(0, 3)}
                </span>
              ))}
            </div>
            <div className="col-span-2 text-right">Stability</div>
          </div>

          {/* Rows */}
          <div className="space-y-3">
            {volatilityRows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 items-center py-2 border-b border-slate-50 last:border-0 text-xs hover:bg-slate-50/40 rounded px-1 transition-colors"
              >
                <div className="col-span-4 font-medium text-slate-800 truncate pr-2" title={row.prompt}>
                  {row.prompt}
                </div>
                <div className="col-span-6 grid grid-cols-7 gap-1 text-center items-center">
                  {row.days.map((val, dIdx) => (
                    <span
                      key={dIdx}
                      className={`inline-flex items-center justify-center w-6 h-6 mx-auto rounded text-[11px] font-medium font-mono ${
                        val >= 3
                          ? "bg-rose-50 text-rose-600 font-semibold"
                          : "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {val}
                    </span>
                  ))}
                </div>
                <div className="col-span-2 text-right">
                  <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${row.statusStyle}`}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export { VolatilityAndTrend };
