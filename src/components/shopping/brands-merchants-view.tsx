"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingCompetitorRow,
  ShoppingVendorRow,
  ShoppingVisibilityPoint,
} from "@/lib/types";
import { Favicon } from "@/components/ui/favicon";

interface BrandsMerchantsViewProps {
  currentBrandName: string;
  productSharePct: number;
  productShareDelta: number;
  competitors: ShoppingCompetitorRow[];
  visibilityPct: number;
  visibilityDelta: number;
  visibilityTrend: ShoppingVisibilityPoint[];
  vendors: ShoppingVendorRow[];
  timeframeText?: string;
  onShowToast?: (msg: string) => void;
}

// Harmonious color palette matching the application and HTML template
const DONUT_COLORS = [
  "#10b981", // Gymshark / Current brand (emerald-500)
  "#8b5cf6", // Nike / Rival 1 (purple-500)
  "#0ea5e9", // Lululemon / Rival 2 (sky-500)
  "#f59e0b", // Alo Yoga / Rival 3 (amber-500)
  "#cbd5e1", // Other Brands (slate-300)
];

const BRAND_DOMAINS: Record<string, string> = {
  gymshark: "gymshark.com",
  nike: "nike.com",
  lululemon: "lululemon.com",
  "alo yoga": "aloyoga.com",
  aloyoga: "aloyoga.com",
  "under armour": "underarmour.com",
  underarmour: "underarmour.com",
  vuori: "vuoriclothing.com",
  athleta: "athleta.gap.com",
  "sweaty betty": "sweatybetty.com",
  sweatybetty: "sweatybetty.com",
  "gym people": "thegympeople.com",
  "the gym people": "thegympeople.com",
  youngla: "youngla.com",
  nobull: "nobullproject.com",
};

const VENDOR_DOMAINS: Record<string, string> = {
  "official brand store": "gymshark.com",
  "official store": "gymshark.com",
  nordstrom: "nordstrom.com",
  "dick's sporting goods": "dickssportinggoods.com",
  "dicks sporting goods": "dickssportinggoods.com",
  "rei co-op": "rei.com",
  rei: "rei.com",
  selfridges: "selfridges.com",
  amazon: "amazon.com",
  asos: "asos.com",
};

export function resolveBrandDomain(name: string, explicitDomain?: string): string {
  if (explicitDomain && explicitDomain.includes(".")) return explicitDomain;
  const key = name.trim().toLowerCase();
  if (BRAND_DOMAINS[key]) return BRAND_DOMAINS[key];
  for (const [k, v] of Object.entries(BRAND_DOMAINS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return `${key.replace(/[^a-z0-9]/g, "")}.com`;
}

export function resolveVendorDomain(name: string, explicitDomain?: string): string {
  if (explicitDomain && explicitDomain.includes(".")) return explicitDomain;
  const key = name.trim().toLowerCase();
  if (VENDOR_DOMAINS[key]) return VENDOR_DOMAINS[key];
  for (const [k, v] of Object.entries(VENDOR_DOMAINS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return `${key.replace(/[^a-z0-9]/g, "")}.com`;
}

export function BrandsMerchantsView({
  currentBrandName,
  productSharePct,
  productShareDelta,
  competitors,
  visibilityPct,
  visibilityDelta,
  visibilityTrend,
  vendors,
  timeframeText = "Last 7 days",
  onShowToast,
}: BrandsMerchantsViewProps) {
  // Deduplicate competitors by brand name to prevent duplicate rows (e.g. Under Armour)
  const uniqueCompetitors = useMemo(() => {
    return competitors
      .filter(
        (comp, index, self) =>
          index ===
          self.findIndex(
            (c) => c.brandName.trim().toLowerCase() === comp.brandName.trim().toLowerCase()
          )
      )
      .map((comp, idx) => ({
        ...comp,
        rank: idx + 1,
      }));
  }, [competitors]);

  const currentBrandItem = uniqueCompetitors.find((c) => c.isCurrentBrand);
  const currentProdCount = currentBrandItem?.productCount || 7456;

  // Compute breakdown list for Card 1 (Top 4 brands + Other Brands remainder across 18,410 total products)
  const TOTAL_CATALOG_PRODUCTS = 18410;
  const top4Competitors = uniqueCompetitors.slice(0, 4);
  const top4TotalShare = top4Competitors.reduce((acc, c) => acc + c.sharePercentage, 0);
  const otherShare = Math.max(0, Number((100 - top4TotalShare).toFixed(1)));
  const top4ProdCount = top4Competitors.reduce((acc, c) => acc + c.productCount, 0);
  const otherProdCount = Math.max(0, TOTAL_CATALOG_PRODUCTS - top4ProdCount);

  const breakdownItems = [
    ...top4Competitors.map((c, i) => ({
      name: c.brandName,
      domain: c.domain,
      share: c.sharePercentage,
      prodCount: c.productCount,
      isCurrentBrand: c.isCurrentBrand,
      color: i === 0 ? "#10b981" : i === 1 ? "#8b5cf6" : i === 2 ? "#0ea5e9" : "#f59e0b",
      dotClass: i === 0 ? "bg-emerald-500" : i === 1 ? "bg-purple-500" : i === 2 ? "bg-sky-500" : "bg-amber-500",
    })),
    {
      name: "Other Brands",
      domain: "",
      share: otherShare,
      prodCount: otherProdCount || 9130,
      isCurrentBrand: false,
      color: "#cbd5e1",
      dotClass: "bg-slate-300",
    },
  ];

  // Compute conic gradient for Donut Chart
  const conicGradient = useMemo(() => {
    let currentPct = 0;
    const stops: string[] = [];
    breakdownItems.forEach((item) => {
      const start = currentPct;
      currentPct += item.share;
      stops.push(`${item.color} ${start.toFixed(1)}% ${currentPct.toFixed(1)}%`);
    });
    return `conic-gradient(${stops.join(", ")})`;
  }, [breakdownItems]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* CARD 1: PRODUCT SHARE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div>
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Product Share</h2>
              <p className="text-xs text-slate-500">Brand share in product recommendations and carousels</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">
              Catalog Share
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-baseline gap-2.5">
              <span className="text-xs text-slate-500 font-medium">{currentBrandName} Share:</span>
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                {productSharePct.toFixed(1)}%
              </span>
              <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-[11px] font-semibold font-mono">
                +{productShareDelta.toFixed(1)}%
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold rounded-full">
              <Favicon
                domain={resolveBrandDomain(currentBrandName)}
                size={14}
                rounded="full"
                fallbackText={currentBrandName}
                className="shrink-0"
              />
              {currentBrandName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-auto py-2">
          {/* Donut Chart */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
            <div
              className="w-36 h-36 rounded-full relative flex items-center justify-center shadow-inner transition-transform duration-300"
              style={{ background: conicGradient }}
            >
              <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-lg font-bold text-slate-900 font-mono">
                  {productSharePct.toFixed(1)}%
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  {currentBrandName.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="sm:col-span-7 space-y-2.5">
            {breakdownItems.map((item) => {
              const brandDomain = resolveBrandDomain(item.name, item.domain);

              if (item.isCurrentBrand) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-emerald-50/50 border border-emerald-100/60"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <Favicon
                        domain={brandDomain}
                        size={14}
                        rounded="sm"
                        fallbackText={item.name}
                        className="shrink-0 shadow-2xs"
                      />
                      <span className="font-semibold text-slate-900 truncate">{item.name}</span>
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded shrink-0">
                        You
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono shrink-0">
                      <span className="font-bold text-slate-900">{item.share.toFixed(1)}%</span>
                      <span className="text-slate-400 text-[11px]">{item.prodCount.toLocaleString()} prod</span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={item.name} className="flex items-center justify-between text-xs py-1 px-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${item.dotClass}`}></span>
                    {item.name !== "Other Brands" && (
                      <Favicon
                        domain={brandDomain}
                        size={14}
                        rounded="sm"
                        fallbackText={item.name}
                        className="shrink-0 shadow-2xs"
                      />
                    )}
                    <span className="font-medium text-slate-700 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono shrink-0">
                    <span className="font-semibold text-slate-800">{item.share.toFixed(1)}%</span>
                    <span className="text-slate-400 text-[11px]">{item.prodCount.toLocaleString()} prod</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Updated 12 mins ago</span>
          <button
            type="button"
            onClick={() => onShowToast?.("Loading detailed catalog breakdown...")}
            className="hover:text-slate-600 cursor-pointer font-medium transition-colors"
          >
            View full breakdown &rarr;
          </button>
        </div>
      </div>

      {/* CARD 2: TOP COMPETITORS */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Top Competitors</h2>
              <p className="text-xs text-slate-500">Brands dominating shopping answer carousels and recommendations</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">
              Ranked Dominance
            </span>
          </div>

          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2 px-2 w-10">#</th>
                  <th className="py-2 px-2">Brand</th>
                  <th className="py-2 px-2 text-right">Share</th>
                  <th className="py-2 px-2 text-right">Products</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {uniqueCompetitors.slice(0, 9).map((comp) => {
                  const brandDomain = resolveBrandDomain(comp.brandName, comp.domain);
                  return (
                    <tr key={comp.brandName} className="hover:bg-slate-50/85 transition-all">
                      <td className="py-2 px-2 font-semibold text-slate-500 font-mono">{comp.rank}</td>
                      <td className="py-2 px-2 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <Favicon
                            domain={brandDomain}
                            size={16}
                            rounded="sm"
                            fallbackText={comp.brandName}
                            className="shrink-0 shadow-2xs"
                          />
                          <span>{comp.brandName}</span>
                          {comp.isCurrentBrand && (
                            <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-semibold rounded">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className={`py-2 px-2 text-right font-mono ${
                          comp.isCurrentBrand ? "font-bold text-emerald-600" : "font-semibold text-slate-800"
                        }`}
                      >
                        {comp.sharePercentage.toFixed(1)}%
                      </td>
                      <td className="py-2 px-2 text-right text-slate-600 font-mono">
                        {comp.productCount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Showing top {Math.min(9, uniqueCompetitors.length)} competitors</span>
          <button
            type="button"
            onClick={() => onShowToast?.("Loading full competitor matrix...")}
            className="hover:text-slate-600 cursor-pointer font-medium transition-colors"
          >
            View full ranking &rarr;
          </button>
        </div>
      </div>

      {/* CARD 3: SHOPPING VISIBILITY */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div>
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Shopping Visibility</h2>
              <p className="text-xs text-slate-500">Brand product visibility across generative shopping queries</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">
              7-Day Run Rate
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-baseline gap-2.5">
              <span className="text-xs text-slate-500 font-medium">Product Visibility:</span>
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                {visibilityPct.toFixed(1)}%
              </span>
              <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-[11px] font-semibold font-mono">
                +{visibilityDelta.toFixed(1)}%
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold rounded-full">
              <Favicon
                domain={resolveBrandDomain(currentBrandName)}
                size={14}
                rounded="full"
                fallbackText={currentBrandName}
                className="shrink-0"
              />
              {currentBrandName}
            </span>
          </div>
        </div>

        {/* Visibility Line & Area Chart Container */}
        <div className="relative w-full pt-4">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={visibilityTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="visGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "Google Sans, sans-serif" }}
                />
                <YAxis
                  domain={[35, 45]}
                  ticks={[35, 38, 41, 44]}
                  tickFormatter={(val) => `${Math.round(val)}%`}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "Google Sans, sans-serif" }}
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200/90 p-3 shadow-lg shadow-slate-900/5 text-xs min-w-[140px] pointer-events-none">
                          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 border-b border-slate-100 pb-1.5 mb-1.5 gap-3">
                            <span>{label}</span>
                            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {currentBrandName}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-slate-500 text-[11px]">Visibility</span>
                            <span className="font-mono font-bold text-sm text-emerald-600">
                              {Number(payload[0].value).toFixed(1)}%
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
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#visGradient)"
                  dot={{ r: 4, fill: "#ffffff", stroke: "#10b981", strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Model visibility tracking active</span>
          <button
            type="button"
            onClick={() => onShowToast?.("Loading query breakdown...")}
            className="hover:text-slate-600 cursor-pointer font-medium transition-colors"
          >
            View query breakdown &rarr;
          </button>
        </div>
      </div>

      {/* CARD 4: VENDOR SHARE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Vendor Share</h2>
              <p className="text-xs text-slate-500">Top retailers and distributors citing and selling your catalog</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">
              Distributors
            </span>
          </div>

          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2 px-2 w-10">#</th>
                  <th className="py-2 px-2">Vendor</th>
                  <th className="py-2 px-2 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendors.slice(0, 5).map((vendor, idx) => {
                  const vendorDomain = resolveVendorDomain(vendor.vendorName, vendor.domain);
                  const isTop = idx === 0;
                  return (
                    <tr key={vendor.vendorName} className="hover:bg-slate-50/85 transition-all">
                      <td className="py-2.5 px-2 font-semibold text-slate-500 font-mono">{vendor.rank}</td>
                      <td className="py-2.5 px-2 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <Favicon
                            domain={vendorDomain}
                            size={16}
                            rounded="sm"
                            fallbackText={vendor.vendorName}
                            className="shrink-0 shadow-2xs"
                          />
                          <span>{vendor.vendorName}</span>
                        </div>
                      </td>
                      <td
                        className={`py-2.5 px-2 text-right font-mono ${
                          isTop ? "font-bold text-slate-900" : "font-semibold text-slate-800"
                        }`}
                      >
                        {vendor.sharePercentage.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tracking {Math.min(5, vendors.length)} top distributors</span>
          <button
            type="button"
            onClick={() => onShowToast?.("Loading all vendors...")}
            className="hover:text-slate-600 cursor-pointer font-medium transition-colors"
          >
            View all vendors &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
