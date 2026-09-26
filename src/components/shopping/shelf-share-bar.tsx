"use client";

import React from "react";
import { BrandShelfShare } from "@/lib/types";
import { ShoppingBag, TrendingUp, Sparkles } from "lucide-react";

interface ShelfShareBarProps {
  breakdown: BrandShelfShare[];
  currentBrandName: string;
}

const BRAND_COLORS = [
  "bg-emerald-500", // Current brand
  "bg-indigo-500",  // Top rival
  "bg-violet-500",  // 2nd rival
  "bg-sky-500",     // 3rd rival
  "bg-amber-500",   // 4th rival
  "bg-slate-400",   // Others
];

const BRAND_TEXT_COLORS = [
  "text-emerald-700 bg-emerald-50 border-emerald-200",
  "text-indigo-700 bg-indigo-50 border-indigo-200",
  "text-violet-700 bg-violet-50 border-violet-200",
  "text-sky-700 bg-sky-50 border-sky-200",
  "text-amber-700 bg-amber-50 border-amber-200",
  "text-slate-700 bg-slate-100 border-slate-200",
];

export function ShelfShareBar({
  breakdown,
  currentBrandName,
}: ShelfShareBarProps) {
  const currentBrandItem = breakdown.find((b) => b.isCurrentBrand);
  const currentBrandShare = currentBrandItem?.sharePercentage || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 lg:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Product Share of Shelf Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Proportion of total AI product recommendations captured by your brand vs. competitors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Your Brand Share:</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <TrendingUp className="w-3 h-3" />
            {currentBrandShare}% of Recommendations
          </span>
        </div>
      </div>

      {/* Multi-Segmented Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden p-0.5 gap-0.5">
          {breakdown.map((item, idx) => {
            const colorClass =
              item.isCurrentBrand
                ? "bg-emerald-500"
                : BRAND_COLORS[(idx % (BRAND_COLORS.length - 1)) + 1];
            return (
              <div
                key={item.brandName}
                style={{ width: `${Math.max(3, item.sharePercentage)}%` }}
                className={`${colorClass} h-full rounded-xs transition-all duration-500 first:rounded-l-full last:rounded-r-full hover:opacity-90 cursor-help`}
                title={`${item.brandName}: ${item.sharePercentage}% (${item.totalRecommendations} recommendations)`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
          <span>0%</span>
          <span>50% Share</span>
          <span>100% Shelf</span>
        </div>
      </div>

      {/* Legend / Brand Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {breakdown.map((item, idx) => {
          const badgeStyle = item.isCurrentBrand
            ? BRAND_TEXT_COLORS[0]
            : BRAND_TEXT_COLORS[(idx % (BRAND_TEXT_COLORS.length - 1)) + 1];

          return (
            <div
              key={item.brandName}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border shadow-2xs ${badgeStyle}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isCurrentBrand
                    ? "bg-emerald-500"
                    : BRAND_COLORS[(idx % (BRAND_COLORS.length - 1)) + 1]
                }`}
              />
              <span>{item.brandName}</span>
              {item.isCurrentBrand && (
                <span className="text-[10px] uppercase tracking-wider bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                  You
                </span>
              )}
              <span className="font-mono text-slate-500 font-normal">
                {item.sharePercentage}%
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                ({item.productCount} {item.productCount === 1 ? "product" : "products"})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
