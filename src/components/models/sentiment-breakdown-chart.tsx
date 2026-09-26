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
  Legend,
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
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-2 min-w-[190px]">
                      <div className="font-semibold text-slate-900 pb-1 border-b border-slate-100 flex items-center justify-between">
                        <span>{data.fullName}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-emerald-700">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Positive:
                          </span>
                          <span className="font-bold">
                            {data.positive}% ({data.rawPos} mentions)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-400" />
                            Neutral:
                          </span>
                          <span className="font-bold">
                            {data.neutral}% ({data.rawNeu} mentions)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-rose-600">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Critical:
                          </span>
                          <span className="font-bold">
                            {data.negative}% ({data.rawNeg} mentions)
                          </span>
                        </div>
                      </div>
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
            <Bar
              dataKey="positive"
              name="Positive"
              stackId="sentiment"
              fill="#10b981"
              radius={[0, 0, 0, 0]}
            />
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
