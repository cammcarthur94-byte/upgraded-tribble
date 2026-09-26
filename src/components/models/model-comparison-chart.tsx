"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { RadarComparisonPoint } from "@/lib/scoring/modelInsights";
import { BarChart3, Radio } from "lucide-react";

interface ModelComparisonChartProps {
  radarData: RadarComparisonPoint[];
}

export function ModelComparisonChart({ radarData }: ModelComparisonChartProps) {
  const [viewMode, setViewMode] = useState<"radar" | "bar">("radar");

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-2xs flex flex-col justify-between">
      {/* Chart Card Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Multi-Axis Engine Footprint
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 uppercase">
              Cross-Platform
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized 0–100 benchmark across SoV, prominence rank, sentiment, and citation authority
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100/90 border border-slate-200/60 text-xs shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("radar")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
              viewMode === "radar"
                ? "bg-white text-slate-900 shadow-2xs font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Radar View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("bar")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
              viewMode === "bar"
                ? "bg-white text-slate-900 shadow-2xs font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar View</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[320px]">
        {viewMode === "radar" ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="#cbd5e1"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
              />
              <Radar
                name="Perplexity"
                dataKey="perplexity"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Radar
                name="ChatGPT"
                dataKey="chatgpt"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Claude"
                dataKey="claude"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name="Gemini"
                dataKey="gemini"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
                        <p className="font-semibold text-slate-900 mb-1.5 pb-1 border-b border-slate-100">
                          {label} (0 - 100)
                        </p>
                        {payload.map((entry: any) => (
                          <div
                            key={entry.name}
                            className="flex items-center justify-between gap-4"
                          >
                            <span
                              className="font-medium"
                              style={{ color: entry.stroke }}
                            >
                              {entry.name}:
                            </span>
                            <span className="font-bold text-slate-800">
                              {entry.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ paddingTop: "12px", fontSize: "11px" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={radarData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="axis"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
                        <p className="font-semibold text-slate-900 mb-1.5 pb-1 border-b border-slate-100">
                          {label}
                        </p>
                        {payload.map((entry: any) => (
                          <div
                            key={entry.name}
                            className="flex items-center justify-between gap-4"
                          >
                            <span
                              className="font-medium"
                              style={{ color: entry.fill }}
                            >
                              {entry.name}:
                            </span>
                            <span className="font-bold text-slate-800">
                              {entry.value} / 100
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ paddingTop: "12px", fontSize: "11px" }}
              />
              <Bar dataKey="perplexity" name="Perplexity" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="chatgpt" name="ChatGPT" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="claude" name="Claude" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gemini" name="Gemini" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
