"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { getTaskImpactTrajectoryAction } from "@/app/actions/growth-task-actions";
import { TaskImpactData } from "@/lib/types/growth";
import {
  TrendingUp,
  Award,
  Calendar,
  Sparkles,
  Quote,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface BeforeAfterImpactWidgetProps {
  brandId: string;
  implementedDate?: string | null;
  taskTitle: string;
}

export function BeforeAfterImpactWidget({
  brandId,
  implementedDate,
  taskTitle,
}: BeforeAfterImpactWidgetProps) {
  const [impactData, setImpactData] = useState<TaskImpactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getTaskImpactTrajectoryAction(brandId, implementedDate)
      .then((data) => {
        if (isMounted) {
          setImpactData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load task impact trajectory:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [brandId, implementedDate]);

  if (isLoading) {
    return (
      <div className="p-6 rounded-xl bg-slate-50/70 border border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
        <span>Computing pre vs post implementation impact...</span>
      </div>
    );
  }

  if (!impactData) return null;

  const isPositiveLift = impactData.deltaLift > 0;
  const implFormattedDate = implementedDate
    ? new Date(implementedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Implemented";

  return (
    <div className="p-5 rounded-xl bg-emerald-50/30 border border-emerald-200/80 space-y-4">
      {/* Widget Header & Lift Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-emerald-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
              <CheckCircle2 className="w-3 h-3" /> Impact Verified
            </span>
            <span className="text-xs text-slate-500">
              Implemented on {implFormattedDate}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-800 leading-snug">
            Before vs. After Visibility Score
          </p>
        </div>

        {/* Lift Delta Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400 leading-none">
                Score Lift
              </div>
              <div className="text-sm font-black text-emerald-700 mt-0.5">
                {isPositiveLift ? `+${impactData.deltaLift}` : impactData.deltaLift} pts
              </div>
            </div>
          </div>

          <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
            <Quote className="w-4 h-4 text-indigo-600" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400 leading-none">
                Citations Gained
              </div>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                +{impactData.citationsGained}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={impactData.trajectory}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="scoreLiftGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={["dataMin - 5", "dataMax + 5"]}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 backdrop-blur-xs text-white p-3 rounded-xl text-xs shadow-xl border border-slate-800 space-y-1.5 min-w-[170px]">
                      <p className="font-semibold text-white pb-1 border-b border-slate-800 flex items-center justify-between gap-3">
                        <span>{label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            pt.isPostImplementation
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {pt.isPostImplementation ? "Post-Launch" : "Baseline"}
                        </span>
                      </p>
                      <div className="flex items-center justify-between text-slate-300 gap-4">
                        <span>Visibility Score:</span>
                        <span className="font-bold text-emerald-400 font-mono">
                          {pt.visibilityScore} / 100
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 gap-4 text-[11px]">
                        <span>Brand Mentions:</span>
                        <span className="font-medium text-slate-200 font-mono">
                          {pt.brandMentions}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              x={impactData.trajectory[7]?.date}
              stroke="#059669"
              strokeDasharray="4 4"
              label={{
                value: "Implemented",
                fill: "#059669",
                fontSize: 10,
                position: "insideTopLeft",
              }}
            />
            <Area
              type="monotone"
              dataKey="visibilityScore"
              stroke="#10b981"
              strokeWidth={3.5}
              fillOpacity={1}
              fill="url(#scoreLiftGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Trajectory Insights Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white/80 p-2 rounded-lg border border-emerald-100">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Pre-implementation baseline: <strong>{impactData.preScore} pts</strong>
          </span>
        </span>
        <span className="text-emerald-700 font-semibold">
          Current score: {impactData.postScore} pts (+{impactData.deltaLift} pts growth)
        </span>
      </div>
    </div>
  );
}
