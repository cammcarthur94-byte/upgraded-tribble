"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { SovTrajectoryPoint } from "@/lib/types";
import { TrendingUp, Eye, EyeOff } from "lucide-react";

interface SovTrajectoryChartProps {
  data: SovTrajectoryPoint[];
  currentSoV: number;
  brandName?: string;
}

export function SovTrajectoryChart({
  data,
  currentSoV,
  brandName = "Gymshark",
}: SovTrajectoryChartProps) {
  const comp1Name = data[0]?.competitor1Name || "Nike";
  const comp2Name = data[0]?.competitor2Name || "Alo Yoga";
  const hasComp1 = data.some((d) => d.competitor1Sov !== undefined);
  const hasComp2 = data.some((d) => d.competitor2Sov !== undefined);

  const [showComp1, setShowComp1] = useState(true);
  const [showComp2, setShowComp2] = useState(true);

  const defaultData: SovTrajectoryPoint[] = [
    { date: "Aug 22", sov: 32, brandMentions: 12, competitorMentions: 25, competitor1Sov: 27, competitor2Sov: 22, competitor1Name: "Nike", competitor2Name: "AloYoga" },
    { date: "Aug 26", sov: 34, brandMentions: 14, competitorMentions: 26, competitor1Sov: 27, competitor2Sov: 22.5, competitor1Name: "Nike", competitor2Name: "AloYoga" },
    { date: "Aug 31", sov: 34, brandMentions: 15, competitorMentions: 27, competitor1Sov: 28, competitor2Sov: 22, competitor1Name: "Nike", competitor2Name: "AloYoga" },
    { date: "Sep 4", sov: 35, brandMentions: 16, competitorMentions: 28, competitor1Sov: 27, competitor2Sov: 23, competitor1Name: "Nike", competitor2Name: "AloYoga" },
    { date: "Sep 8", sov: 37, brandMentions: 18, competitorMentions: 27, competitor1Sov: 26, competitor2Sov: 24, competitor1Name: "Nike", competitor2Name: "AloYoga" },
    { date: "Sep 13", sov: 38, brandMentions: 19, competitorMentions: 26, competitor1Sov: 26, competitor2Sov: 25, competitor1Name: "Nike", competitor2Name: "AloYoga" },
    { date: "Sep 19", sov: 40, brandMentions: 22, competitorMentions: 26, competitor1Sov: 26.5, competitor2Sov: 25, competitor1Name: "Nike", competitor2Name: "AloYoga" },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Chart Viewport */}
      <div className="h-52 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              dy={6}
            />
            <YAxis
              domain={[0, 45]}
              ticks={[0, 10, 20, 30, 40]}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload as SovTrajectoryPoint;
                  return (
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl text-xs shadow-lg shadow-slate-900/5 border border-slate-200/90 space-y-1.5 min-w-[165px] pointer-events-none">
                      <div className="text-[11px] font-semibold text-slate-500 border-b border-slate-100 pb-1.5">
                        {label}
                      </div>
                      <div className="flex items-center justify-between text-slate-900 font-semibold text-xs bg-emerald-50/70 px-2 py-1 rounded-lg border border-emerald-100">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {brandName}
                        </span>
                        <span className="font-mono text-emerald-700 font-bold">{p.sov}%</span>
                      </div>
                      {p.competitor1Sov !== undefined && (
                        <div className="flex items-center justify-between text-slate-600 text-[11px] px-1 py-0.5">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            {p.competitor1Name || comp1Name}
                          </span>
                          <span className="font-mono text-slate-700 font-semibold">{p.competitor1Sov}%</span>
                        </div>
                      )}
                      {p.competitor2Sov !== undefined && (
                        <div className="flex items-center justify-between text-slate-600 text-[11px] px-1 py-0.5">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {p.competitor2Name || comp2Name}
                          </span>
                          <span className="font-mono text-slate-700 font-semibold">{p.competitor2Sov}%</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Primary Brand Line (Solid Green) */}
            <Area
              type="monotone"
              dataKey="sov"
              name={brandName}
              stroke="#10b981"
              strokeWidth={2}
              fill="none"
              activeDot={{ r: 4, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
            />
            {/* Competitor 1 Line (Dashed Gray) */}
            <Line
              type="monotone"
              dataKey="competitor1Sov"
              name={comp1Name}
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
              activeDot={{ r: 3, fill: "#94a3b8" }}
            />
            {/* Competitor 2 Line (Dashed Orange) */}
            <Line
              type="monotone"
              dataKey="competitor2Sov"
              name={comp2Name}
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
              activeDot={{ r: 3, fill: "#f59e0b" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Centered Legend below chart matching reference image 1 */}
      <div className="flex items-center justify-center gap-6 pt-3 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center text-amber-500 font-mono text-[11px]">—o—</span>
          <span className="text-slate-700 font-medium">AloYoga</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center text-emerald-500 font-mono text-[11px]">—o—</span>
          <span className="text-slate-900 font-medium">{brandName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center text-slate-400 font-mono text-[11px]">—o—</span>
          <span className="text-slate-600 font-medium">{comp1Name}</span>
        </div>
      </div>
    </div>
  );
}
