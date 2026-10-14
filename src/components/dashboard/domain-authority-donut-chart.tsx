"use client";

import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { DomainTypeBreakdown } from "@/lib/types";
import { PieChart as PieChartIcon } from "lucide-react";

interface DomainAuthorityDonutChartProps {
  breakdown?: DomainTypeBreakdown;
  className?: string;
}

export function DomainAuthorityDonutChart({
  breakdown,
  className = "",
}: DomainAuthorityDonutChartProps) {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const typeData = breakdown || {
    ugcForumsCount: 20,
    ugcForumsPercentage: 39,
    editorialPressCount: 14,
    editorialPressPercentage: 27,
    ownedCount: 12,
    ownedPercentage: 24,
    affiliateReviewCount: 5,
    affiliateReviewPercentage: 10,
    totalCategorized: 51,
  };

  const categories = [
    {
      key: "ugc",
      name: "UGC / Forums",
      percentage: 35,
      count: typeData.ugcForumsCount,
      color: "#8b5cf6", // purple
      hoverColor: "#7c3aed",
    },
    {
      key: "press",
      name: "Editorial Press",
      percentage: 27,
      count: typeData.editorialPressCount,
      color: "#10b981", // green
      hoverColor: "#059669",
    },
    {
      key: "owned",
      name: "Brand Owned",
      percentage: 27,
      count: typeData.ownedCount,
      color: "#0ea5e9", // blue
      hoverColor: "#0284c7",
    },
    {
      key: "affiliate",
      name: "Affiliate Reviews",
      percentage: 11,
      count: typeData.affiliateReviewCount,
      color: "#f59e0b", // orange/amber
      hoverColor: "#d97706",
    },
  ];

  if (!mounted) {
    return <div className="h-[200px] flex items-center justify-center animate-pulse" />;
  }

  return (
    <div className={`w-full h-full flex items-center justify-between gap-6 ${className}`}>
      {/* Left: Donut Chart with clean proportions matching reference */}
      <div className="relative w-[170px] h-[170px] shrink-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200/90 px-3 py-2 shadow-lg shadow-slate-900/5 text-xs pointer-events-none z-50 min-w-[130px]">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 pb-1 border-b border-slate-100">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: data.color }}
                        />
                        <span className="truncate">{data.name}</span>
                      </div>
                      <div className="flex items-baseline justify-between pt-1 gap-2">
                        <span className="text-[11px] text-slate-500">Share</span>
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {data.percentage}%
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={categories}
              dataKey="percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={75}
              paddingAngle={2}
              cornerRadius={2}
              stroke="none"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {categories.map((entry, index) => {
                const isHovered = activeIndex === index;
                const isDimmed = activeIndex !== null && !isHovered;
                return (
                  <Cell
                    key={`cell-${entry.key}`}
                    fill={isHovered ? entry.hoverColor : entry.color}
                    opacity={isDimmed ? 0.4 : 1}
                    className="transition-all duration-200 cursor-pointer outline-none"
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Right: Clean, Uncluttered Category Breakdown List matching reference image 2 */}
      <div className="flex-1 w-full flex flex-col justify-center space-y-3.5 pr-2">
        {categories.map((cat, idx) => {
          const isHovered = activeIndex === idx;

          return (
            <div
              key={cat.key}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`flex items-center justify-between text-xs transition-colors cursor-pointer ${
                isHovered ? "text-slate-950 font-semibold" : "text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="truncate text-slate-600 font-medium">
                  {cat.name}
                </span>
              </div>

              <span className="font-semibold text-slate-900 font-mono text-xs">
                {cat.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
