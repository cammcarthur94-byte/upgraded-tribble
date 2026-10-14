"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";
import { EngineInsightItem } from "@/lib/scoring/modelInsights";
import { Smile, Frown, Meh } from "lucide-react";

interface SentimentBreakdownChartProps {
  engines: EngineInsightItem[];
}

export function SentimentBreakdownChart({
  engines,
}: SentimentBreakdownChartProps) {
  const chartData = engines.map((item) => ({
    name: item.displayName.replace("OpenAI ", "").replace("Anthropic ", "").replace("Google ", ""),
    fullName: item.displayName,
    positive: item.sentimentBreakdown.positivePct,
    neutral: item.sentimentBreakdown.neutralPct,
    negative: item.sentimentBreakdown.negativePct,
    rawPos: item.sentimentBreakdown.positive,
    rawNeu: item.sentimentBreakdown.neutral,
    rawNeg: item.sentimentBreakdown.negative,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Sentiment & Tone Distribution
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase">
              Tone Profile
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <Smile className="w-3.5 h-3.5" /> Positive
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
              <Meh className="w-3.5 h-3.5" /> Neutral
            </span>
            <span className="inline-flex items-center gap-1 text-rose-500 font-medium">
              <Frown className="w-3.5 h-3.5" /> Critical
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Proportion of favorable vs. neutral vs. critical entity context when answering buyer queries
        </p>
      </div>

      {/* Stacked Horizontal Bar Canvas */}
      <div className="w-full h-[320px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#f1f5f9"
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              unit="%"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "#334155", fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={75}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200/90 p-3 shadow-lg shadow-slate-900/5 text-xs space-y-2 min-w-[190px] pointer-events-none">
                      <div className="font-semibold text-slate-800 pb-1.5 border-b border-slate-100 flex items-center justify-between text-xs">
                        <span>{data.fullName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Sentiment</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Positive
                          </span>
                          <div className="font-mono text-right">
                            <span className="font-bold text-emerald-600">{data.positive}%</span>
                            <span className="text-[10px] text-slate-400 ml-1">({data.rawPos})</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Neutral
                          </span>
                          <div className="font-mono text-right">
                            <span className="font-semibold text-slate-700">{data.neutral}%</span>
                            <span className="text-[10px] text-slate-400 ml-1">({data.rawNeu})</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Critical
                          </span>
                          <div className="font-mono text-right">
                            <span className="font-semibold text-rose-600">{data.negative}%</span>
                            <span className="text-[10px] text-slate-400 ml-1">({data.rawNeg})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="positive"
              name="Positive"
              stackId="sentiment"
              fill="#10b981"
              radius={[0, 0, 0, 0]}
            >
              <LabelList
                dataKey="positive"
                position="insideLeft"
                offset={10}
                fill="#ffffff"
                fontSize={11}
                fontWeight={700}
                formatter={(val: any) => `${val}%`}
              />
            </Bar>
            <Bar
              dataKey="neutral"
              name="Neutral"
              stackId="sentiment"
              fill="#94a3b8"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="negative"
              name="Critical"
              stackId="sentiment"
              fill="#f43f5e"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
