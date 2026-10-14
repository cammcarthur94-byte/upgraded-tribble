"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { MessageSquare, Link2 } from "lucide-react";
import { MetricTrendSeries } from "@/lib/types";

interface MetricTrendChartCardProps {
  type: "mentions" | "citations";
  data?: MetricTrendSeries;
  brandName?: string;
}

export function MetricTrendChartCard({
  type,
  data,
  brandName = "Gymshark",
}: MetricTrendChartCardProps) {
  const isMentions = type === "mentions";

  // Fallback data matching the user's reference design
  const defaultMentionsData: MetricTrendSeries = {
    total: 9518,
    delta: 514,
    timeframe: "7 Days",
    data: [
      { date: "May 8", value: 1152 },
      { date: "May 9", value: 1294 },
      { date: "May 10", value: 1238 },
      { date: "May 11", value: 1412 },
      { date: "May 12", value: 1370 },
      { date: "May 13", value: 1446 },
      { date: "May 14", value: 1606 },
    ],
  };

  const defaultCitationsData: MetricTrendSeries = {
    total: 8396,
    delta: 487,
    timeframe: "7 Days",
    data: [
      { date: "May 8", value: 1018 },
      { date: "May 9", value: 1162 },
      { date: "May 10", value: 1124 },
      { date: "May 11", value: 1276 },
      { date: "May 12", value: 1244 },
      { date: "May 13", value: 1194 },
      { date: "May 14", value: 1378 },
    ],
  };

  const series = data || (isMentions ? defaultMentionsData : defaultCitationsData);

  const title = isMentions ? "Mentions" : "Citations";
  const subtitle = isMentions
    ? "Times your brand appeared in AI responses over time"
    : "Direct links to your domain in AI responses over time";
  const kpiLabel = isMentions ? "Total Mentions" : "Total Citations";
  const gradientId = isMentions ? "mentionsGreenGrad" : "citationsGreenGrad";
  const timeframeBadge = series.timeframe
    ? series.timeframe.toLowerCase().includes("day")
      ? series.timeframe
      : `${series.timeframe} Days`
    : "7 Days";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between min-h-[350px]">
      {/* Standardized Card Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-slate-900">
            {title}
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 bg-slate-50/70 font-mono">
            {timeframeBadge}
          </span>
        </div>
        <p className="text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      {/* Interactive Legend & KPI Row matching Dashboard SoV */}
      <div className="flex items-center justify-between mb-2 text-[11px] font-medium text-slate-500">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium text-slate-500">{kpiLabel}:</span>
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
            {series.total.toLocaleString()}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            +{series.delta.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-300" />
            <span className="text-emerald-950 font-bold">{brandName}</span>
          </div>
        </div>
      </div>

      {/* Smooth Area Chart Canvas */}
      <div className="w-full h-[200px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={series.data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />
            <YAxis
              domain={["dataMin - 80", "dataMax + 80"]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={(val) => Number(val).toLocaleString()}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  return (
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl text-xs shadow-lg shadow-slate-900/5 border border-slate-200/90 space-y-1.5 min-w-[160px] pointer-events-none">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 border-b border-slate-100 pb-1.5 gap-3">
                        <span>{label}</span>
                        <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {brandName}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-3 pt-0.5">
                        <span className="text-slate-500 text-[11px]">{title}</span>
                        <span className="font-mono font-bold text-sm text-emerald-600">
                          {val.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name={title}
              stroke="#10b981"
              strokeWidth={3.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              activeDot={{
                r: 5,
                fill: "#10b981",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function MentionsTrendCard({
  data,
  brandName,
}: {
  data?: MetricTrendSeries;
  brandName?: string;
}) {
  return (
    <MetricTrendChartCard type="mentions" data={data} brandName={brandName} />
  );
}

export function CitationsTrendCard({
  data,
  brandName,
}: {
  data?: MetricTrendSeries;
  brandName?: string;
}) {
  return (
    <MetricTrendChartCard type="citations" data={data} brandName={brandName} />
  );
}
