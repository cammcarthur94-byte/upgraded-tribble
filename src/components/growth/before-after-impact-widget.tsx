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
import { TaskImpactData, TaskStatus } from "@/lib/types/growth";
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
  status?: TaskStatus;
  estimatedLift?: string;
  implementedDate?: string | null;
  taskTitle: string;
}

export function BeforeAfterImpactWidget({
  brandId,
  status = "To Do",
  estimatedLift,
  implementedDate,
  taskTitle,
}: BeforeAfterImpactWidgetProps) {
  const [impactData, setImpactData] = useState<TaskImpactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isImplemented = status === "Implemented";

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
        <span>{isImplemented ? "Computing verified impact..." : "Calculating projected model lift..."}</span>
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
    : "Oct 9, 2026";

  // If task is not yet implemented, show the Projected Impact Forecast card
  if (!isImplemented) {
    return (
      <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50/40 via-slate-50/60 to-purple-50/30 border border-indigo-200/80 space-y-4">
        {/* Forecast Header & Lift Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-indigo-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full border border-indigo-300">
                <Sparkles className="w-3 h-3 text-indigo-600" /> Projected Impact Forecast
              </span>
            </div>
            <p className="text-xs text-slate-500 pt-0.5">
              Verification begins automatically once marked Implemented
            </p>
          </div>

          {/* Projected Metric Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400 leading-none">
                  Projected Lift
                </div>
                <div className="text-sm font-black text-indigo-700 mt-0.5">
                  Est. {estimatedLift || "+16 pts"}
                </div>
              </div>
            </div>

            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
              <Quote className="w-4 h-4 text-indigo-600" />
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400 leading-none">
                  Est. New Citations
                </div>
                <div className="text-sm font-black text-slate-900 mt-0.5">
                  +15–22
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Area Chart Canvas */}
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={impactData.trajectory}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
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
                      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl text-xs shadow-lg shadow-slate-900/5 border border-slate-200/90 space-y-2 min-w-[170px] pointer-events-none">
                        <div className="font-semibold text-slate-800 pb-1.5 border-b border-slate-100 flex items-center justify-between gap-3">
                          <span>{label}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                            {pt.isPostImplementation ? "Projected Growth" : "Current Baseline"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 gap-3">
                          <span>Visibility Score:</span>
                          <span className="font-bold text-indigo-600 font-mono text-sm">
                            {pt.visibilityScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 gap-3 text-[11px]">
                          <span>Est. Brand Mentions:</span>
                          <span className="font-semibold text-slate-800 font-mono">
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
                stroke="#6366f1"
                strokeDasharray="4 4"
                label={{
                  value: "Sprint Target",
                  fill: "#6366f1",
                  fontSize: 10,
                  position: "insideTopLeft",
                }}
              />
              <Area
                type="monotone"
                dataKey="visibilityScore"
                stroke="#6366f1"
                strokeWidth={3}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#forecastGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trajectory Insights Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white/80 p-2.5 rounded-lg border border-indigo-100/80">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              Current baseline: <strong>{impactData.preScore} pts</strong>
            </span>
          </span>
          <span className="text-indigo-700 font-semibold">
            Forecast target: ~{impactData.postScore} pts ({estimatedLift || `+${impactData.deltaLift} pts`} estimated lift)
          </span>
        </div>
      </div>
    );
  }

  // If task is Implemented, show the verified impact results
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
              Verified on {implFormattedDate}
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
                +{impactData.citationsGained} Citations
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-44">
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
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl text-xs shadow-lg shadow-slate-900/5 border border-slate-200/90 space-y-2 min-w-[170px] pointer-events-none">
                      <div className="font-semibold text-slate-800 pb-1.5 border-b border-slate-100 flex items-center justify-between gap-3">
                        <span>{label}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            pt.isPostImplementation
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                              : "bg-slate-100 text-slate-600 border border-slate-200/70"
                          }`}
                        >
                          {pt.isPostImplementation ? "Post-Launch" : "Baseline"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 gap-3">
                        <span>Visibility Score:</span>
                        <span className="font-bold text-emerald-600 font-mono text-sm">
                          {pt.visibilityScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 gap-3 text-[11px]">
                        <span>Brand Mentions:</span>
                        <span className="font-semibold text-slate-800 font-mono">
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
      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
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
