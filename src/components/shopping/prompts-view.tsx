"use client";

import React, { useState, useMemo } from "react";
import { ShoppingPromptRow, SupportedEngine } from "@/lib/types";
import { EngineBadge } from "@/components/prompts/engine-badge";
import { Favicon } from "@/components/ui/favicon";
import {
  MessageSquare,
  Package,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Search,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  Tag,
  ArrowRight,
  Filter,
} from "lucide-react";

interface PromptsViewProps {
  prompts: ShoppingPromptRow[];
  totalCount: number;
  currentBrandName: string;
  onViewProduct?: (productName: string) => void;
}

export function PromptsView({
  prompts,
  totalCount,
  currentBrandName,
  onViewProduct,
}: PromptsViewProps) {
  const [groupBy, setGroupBy] = useState<"prompt" | "brand">("prompt");
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(
    prompts[0]?.id || null // Expand the first prompt by default so users immediately see the products!
  );
  const [engineFilter, setEngineFilter] = useState<string>("all");
  const [productQuery, setProductQuery] = useState<string>("");

  const toggleExpand = (id: string) => {
    if (expandedPromptId === id) {
      setExpandedPromptId(null);
    } else {
      setExpandedPromptId(id);
      setEngineFilter("all");
      setProductQuery("");
    }
  };

  // Group prompts if "Group by top brand" is selected
  const groupedPrompts = useMemo(() => {
    if (groupBy === "prompt") {
      return [{ groupKey: "All Prompts", items: prompts }];
    }

    const map = new Map<string, ShoppingPromptRow[]>();
    prompts.forEach((p) => {
      const key = p.topBrand || "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });

    return Array.from(map.entries()).map(([groupKey, items]) => ({
      groupKey,
      items,
    }));
  }, [prompts, groupBy]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
          <h3 className="text-sm font-bold text-slate-900">Shopping Prompts</h3>
          <span className="text-xs text-slate-400 hidden sm:inline">
            · Prompts triggering AI product recommendations (click any row to view products)
          </span>
        </div>

        {/* Group By Dropdown */}
        <div className="relative self-start sm:self-auto">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as "prompt" | "brand")}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl pl-3 pr-7 py-1.5 appearance-none hover:bg-slate-50 shadow-2xs cursor-pointer focus:outline-hidden"
          >
            <option value="prompt">Group by prompt</option>
            <option value="brand">Group by top brand</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Prompts Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 select-none">
              <th className="py-3.5 px-3 w-10 text-center border-r border-slate-200/80"></th>
              <th className="py-3.5 px-4 text-left border-r border-slate-200/80">Prompt Query</th>
              <th className="py-3.5 px-4 text-center border-r border-slate-200/80">Models</th>
              <th className="py-3.5 px-4 text-center border-r border-slate-200/80">Products Detected</th>
              <th className="py-3.5 px-4 text-center">Top Recommended Brand</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {groupedPrompts.map((group) => (
              <React.Fragment key={group.groupKey}>
                {groupBy === "brand" && (
                  <tr className="bg-slate-100/70 border-y border-slate-200">
                    <td colSpan={5} className="py-2 px-4 text-left font-bold text-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Top Brand: {group.groupKey}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          ({group.items.length} prompt{group.items.length !== 1 ? "s" : ""})
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

                {group.items.map((p) => {
                  const isCurrentBrandTop =
                    p.topBrand.toLowerCase() === currentBrandName.toLowerCase();
                  const isExpanded = expandedPromptId === p.id;
                  const products = p.products || [];

                  // Filter products in expanded drawer
                  let displayedProducts = products;
                  if (engineFilter !== "all") {
                    displayedProducts = displayedProducts.filter(
                      (prod) =>
                        prod.engine === engineFilter ||
                        (prod.engines && prod.engines.includes(engineFilter as SupportedEngine))
                    );
                  }
                  if (productQuery.trim()) {
                    const q = productQuery.toLowerCase();
                    displayedProducts = displayedProducts.filter(
                      (prod) =>
                        prod.productName.toLowerCase().includes(q) ||
                        prod.brandName.toLowerCase().includes(q) ||
                        (prod.skuOrIdentifier &&
                          prod.skuOrIdentifier.toLowerCase().includes(q))
                    );
                  }

                  return (
                    <React.Fragment key={p.id}>
                      <tr
                        onClick={() => toggleExpand(p.id)}
                        className={`transition-colors cursor-pointer border-b border-slate-200/80 ${
                          isExpanded
                            ? "bg-indigo-50/20 hover:bg-indigo-50/30"
                            : isCurrentBrandTop
                            ? "hover:bg-slate-50/70 bg-emerald-50/10"
                            : "hover:bg-slate-50/70"
                        }`}
                      >
                        {/* Expand / Collapse Indicator */}
                        <td className="py-3.5 px-3 text-center border-r border-slate-200/80">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(p.id);
                            }}
                            className={`p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors ${
                              isExpanded ? "text-indigo-600 bg-indigo-50" : ""
                            }`}
                            title={isExpanded ? "Collapse products" : "View products in prompt"}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Prompt Query */}
                        <td className="py-3.5 px-4 text-left border-r border-slate-200/80 max-w-md">
                          <div className="flex items-start gap-2">
                            <span
                              className={`font-semibold transition-colors ${
                                isExpanded
                                  ? "text-indigo-900"
                                  : "text-slate-900 hover:text-indigo-600"
                              }`}
                            >
                              {p.promptText}
                            </span>
                          </div>
                        </td>

                        {/* Multi-Model Badges */}
                        <td className="py-3.5 px-4 text-center border-r border-slate-200/80">
                          <div className="flex flex-wrap items-center justify-center gap-1">
                            {p.engines.map((eng) => (
                              <EngineBadge key={eng} engine={eng} size="sm" />
                            ))}
                          </div>
                        </td>

                        {/* Product Count Badge with Action Trigger */}
                        <td className="py-3.5 px-4 text-center border-r border-slate-200/80">
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(p.id);
                              }}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all border shadow-2xs ${
                                isExpanded
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                  : "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200/80"
                              }`}
                            >
                              <Package className="w-3 h-3" />
                              <span>{products.length > 0 ? products.length : p.productCount} products</span>
                              <span className="text-[10px] font-sans font-normal opacity-75">
                                {isExpanded ? "hide" : "view"}
                              </span>
                            </button>
                          </div>
                        </td>

                        {/* Top Brand */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                isCurrentBrandTop
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              <Favicon
                                domain={p.topBrand}
                                size={13}
                                rounded="sm"
                                fallbackText={p.topBrand}
                                className="shrink-0"
                              />
                              <span>{p.topBrand}</span>
                              {isCurrentBrandTop && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Section: Products That Showed Up in This Prompt */}
                      {isExpanded && (
                        <tr className="bg-slate-50/95 border-b-2 border-indigo-200">
                          <td colSpan={5} className="p-4 lg:p-6 text-left">
                            <div className="space-y-4">
                              {/* Sub-header with Filter Controls */}
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-600" />
                                    <h4 className="text-sm font-bold text-slate-900">
                                      Products Recommended for this Query ({displayedProducts.length})
                                    </h4>
                                    <span className="text-xs text-slate-500 font-normal hidden sm:inline">
                                      · Extracted from AI responses to "{p.promptText.slice(0, 55)}..."
                                    </span>
                                  </div>
                                </div>

                                {/* Controls: Engine Filter Tabs & Search */}
                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Filter by Model */}
                                  <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEngineFilter("all");
                                      }}
                                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                                        engineFilter === "all"
                                          ? "bg-slate-900 text-white font-semibold shadow-2xs"
                                          : "text-slate-600 hover:text-slate-900"
                                      }`}
                                    >
                                      All Models
                                    </button>
                                    {p.engines.map((eng) => (
                                      <button
                                        key={eng}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEngineFilter(eng);
                                        }}
                                        className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all ${
                                          engineFilter === eng
                                            ? "bg-indigo-600 text-white font-semibold shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                        }`}
                                      >
                                        {eng}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Quick Product Search */}
                                  <div className="relative">
                                    <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      type="text"
                                      placeholder="Filter products..."
                                      value={productQuery}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => setProductQuery(e.target.value)}
                                      className="pl-8 pr-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-36 sm:w-44"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Products List / Grid */}
                              {displayedProducts.length === 0 ? (
                                <div className="p-8 text-center bg-white rounded-xl border border-slate-200/80 text-slate-400">
                                  <Package className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                                  <p className="text-xs font-semibold text-slate-600">
                                    No products matched the selected filters for this prompt.
                                  </p>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEngineFilter("all");
                                      setProductQuery("");
                                    }}
                                    className="mt-2 text-xs text-indigo-600 hover:underline font-semibold"
                                  >
                                    Reset filters
                                  </button>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {displayedProducts.map((prod, pIdx) => {
                                    const isBrand =
                                      prod.isCurrentBrand ||
                                      prod.brandName.toLowerCase() === currentBrandName.toLowerCase();

                                    return (
                                      <div
                                        key={prod.id || pIdx}
                                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                                          isBrand
                                            ? "bg-white border-emerald-200/80 shadow-xs hover:border-emerald-300"
                                            : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
                                        }`}
                                      >
                                        <div>
                                          {/* Top Meta Bar */}
                                          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                                            <div className="flex items-center gap-1.5">
                                              <span
                                                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono ${
                                                  prod.rankPosition === 1
                                                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                                                    : prod.rankPosition === 2
                                                    ? "bg-slate-100 text-slate-700 border border-slate-300"
                                                    : prod.rankPosition === 3
                                                    ? "bg-orange-100 text-orange-800 border border-orange-200"
                                                    : "bg-slate-50 text-slate-600 border border-slate-200"
                                                }`}
                                              >
                                                #{prod.rankPosition}
                                              </span>
                                              <span
                                                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                                  isBrand
                                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                                }`}
                                              >
                                                <Favicon
                                                  domain={prod.brandName}
                                                  size={11}
                                                  rounded="sm"
                                                  fallbackText={prod.brandName}
                                                  className="shrink-0"
                                                />
                                                <span>{prod.brandName} {isBrand ? "· You" : "· Competitor"}</span>
                                              </span>
                                            </div>

                                            {prod.priceMentioned && (
                                              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                                                {prod.priceMentioned}
                                              </span>
                                            )}
                                          </div>

                                          {/* Product Info with Optional Image */}
                                          <div className="flex items-start gap-3 my-2.5">
                                            {prod.imageUrl ? (
                                              <img
                                                src={prod.imageUrl}
                                                alt={prod.productName}
                                                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                                                loading="lazy"
                                              />
                                            ) : (
                                              <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                                                <ShoppingBag className="w-5 h-5 stroke-1" />
                                              </div>
                                            )}

                                            <div className="min-w-0 flex-1">
                                              <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                                                {prod.productName}
                                              </h5>
                                              {prod.skuOrIdentifier && (
                                                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                                                  SKU: {prod.skuOrIdentifier}
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          {/* Verbatim AI Quote & Reasoning */}
                                          {prod.quote && (
                                            <blockquote className="text-[11px] text-slate-600 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60 italic leading-relaxed my-2">
                                              "{prod.quote}"
                                            </blockquote>
                                          )}
                                        </div>

                                        {/* Bottom Card Footer: Engine Badges & Action */}
                                        <div className="pt-2.5 mt-1 border-t border-slate-100 flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-1 flex-wrap">
                                            <span className="text-[10px] text-slate-400 font-medium">Recommended by:</span>
                                            {(prod.engines && prod.engines.length > 0
                                              ? prod.engines
                                              : [prod.engine]
                                            ).map((eng) => (
                                              <EngineBadge key={eng} engine={eng} size="sm" />
                                            ))}
                                          </div>

                                          {onViewProduct && (
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onViewProduct(prod.productName);
                                              }}
                                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline shrink-0"
                                            >
                                              <span>View Product</span>
                                              <ArrowRight className="w-3 h-3" />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
        <span>{totalCount} prompts with shopping results</span>
        <span className="text-[11px] text-slate-400">
          Showing AI recommendation rankings across ChatGPT, Gemini, Claude & Perplexity
        </span>
      </div>
    </div>
  );
}

