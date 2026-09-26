"use client";

import React, { useState, useMemo } from "react";
import { ProductShelfItem, SupportedEngine } from "@/lib/types";
import { EngineBadge } from "@/components/prompts/engine-badge";
import { Favicon } from "@/components/ui/favicon";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Tag,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Quote,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUpDown,
} from "lucide-react";

interface ProductLeaderboardTableProps {
  products: ProductShelfItem[];
  currentBrandName: string;
  onViewPrompt?: (promptText: string) => void;
}

export function ProductLeaderboardTable({
  products,
  currentBrandName,
  onViewPrompt,
}: ProductLeaderboardTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEngine, setSelectedEngine] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<"all" | "own" | "competitors">("all");
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"rank" | "frequency" | "price">("rank");
  const [sortAsc, setSortAsc] = useState(true);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          (p.skuOrIdentifier && p.skuOrIdentifier.toLowerCase().includes(q))
      );
    }

    if (selectedEngine !== "all") {
      list = list.filter((p) => p.engines.includes(selectedEngine as SupportedEngine));
    }

    if (brandFilter === "own") {
      list = list.filter((p) => p.isCurrentBrand);
    } else if (brandFilter === "competitors") {
      list = list.filter((p) => !p.isCurrentBrand);
    }

    list.sort((a, b) => {
      let diff = 0;
      if (sortField === "rank") {
        diff = a.avgRankPosition - b.avgRankPosition;
      } else if (sortField === "frequency") {
        diff = b.inclusionFrequencyPct - a.inclusionFrequencyPct;
      } else if (sortField === "price") {
        const getPrice = (p: ProductShelfItem) => {
          const match = (p.priceMentioned || "").match(/\$?(\d+(\.\d+)?)/);
          return match ? parseFloat(match[1]) : 0;
        };
        diff = getPrice(a) - getPrice(b);
      }
      return sortAsc ? diff : -diff;
    });

    return list;
  }, [products, searchQuery, selectedEngine, brandFilter, sortField, sortAsc]);

  const handleToggleSort = (field: "rank" | "frequency" | "price") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === "rank");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedProductId(expandedProductId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Toolbar Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Product Share of Shelf Leaderboard
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filteredProducts.length} Items Detected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Rank positions, cross-model visibility frequency, and verbatim AI grounding quotes
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search product or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Brand Scope Filter */}
          <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/70 text-xs">
            <button
              onClick={() => setBrandFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                brandFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Brands
            </button>
            <button
              onClick={() => setBrandFilter("own")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                brandFilter === "own"
                  ? "bg-white text-emerald-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {currentBrandName} Only
            </button>
            <button
              onClick={() => setBrandFilter("competitors")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                brandFilter === "competitors"
                  ? "bg-white text-indigo-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Competitors
            </button>
          </div>

          {/* Engine Filter */}
          <div className="relative">
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl pl-7 pr-6 py-1.5 appearance-none hover:bg-slate-50 shadow-2xs cursor-pointer focus:outline-hidden"
            >
              <option value="all">All Models</option>
              <option value="chatgpt">ChatGPT</option>
              <option value="perplexity">Perplexity</option>
              <option value="gemini">Gemini</option>
              <option value="claude">Claude</option>
            </select>
            <Filter className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 select-none">
              <th
                onClick={() => handleToggleSort("rank")}
                className="py-3.5 px-3 text-center border-r border-slate-200/80 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Rank</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center border-r border-slate-200/80">Product Name & SKU</th>
              <th className="py-3.5 px-3 text-center border-r border-slate-200/80">Brand</th>
              <th className="py-3.5 px-3 text-center border-r border-slate-200/80">AI Engine Presence</th>
              <th
                onClick={() => handleToggleSort("rank")}
                className="py-3.5 px-3 text-center border-r border-slate-200/80 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Avg Position</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleToggleSort("frequency")}
                className="py-3.5 px-3 text-center border-r border-slate-200/80 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Share of Shelf</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleToggleSort("price")}
                className="py-3.5 px-3 text-center border-r border-slate-200/80 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-3 text-center border-r border-slate-200/80">Sentiment</th>
              <th className="py-3.5 px-4 text-center">Details</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-700">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 border-b border-slate-200/80">
                  <Tag className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                  <p className="font-semibold text-slate-600 text-sm">
                    No product recommendations found
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Try adjusting your search terms or filter selection.
                  </p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, idx) => {
                const isExpanded = expandedProductId === product.id;
                const isTopRank = idx === 0;

                return (
                  <React.Fragment key={product.id}>
                    <tr
                      className={`hover:bg-slate-50/70 transition-colors ${
                        product.isCurrentBrand ? "bg-emerald-50/15" : ""
                      }`}
                    >
                      {/* Rank Position */}
                      <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 font-mono font-bold">
                        <div className="flex items-center justify-center">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${
                              idx === 0
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : idx === 1
                                ? "bg-slate-200 text-slate-800 border border-slate-300"
                                : idx === 2
                                ? "bg-amber-50 text-amber-700 border border-amber-200/80"
                                : "text-slate-500 bg-slate-100"
                            }`}
                          >
                            #{idx + 1}
                          </span>
                        </div>
                      </td>

                      {/* Product Name & SKU */}
                      <td className="py-3.5 px-4 text-center border-r border-b border-slate-200/80 max-w-xs">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="font-bold text-slate-900 truncate max-w-full">
                            {product.productName}
                          </div>
                          {product.skuOrIdentifier && (
                            <div className="flex items-center justify-center gap-1.5 mt-0.5 text-[11px] text-slate-400 font-mono">
                              <Tag className="w-3 h-3 text-slate-400" />
                              <span>{product.skuOrIdentifier}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Brand Pill */}
                      <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80">
                        <div className="flex items-center justify-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              product.isCurrentBrand
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            <Favicon
                              domain={product.brandName}
                              size={13}
                              rounded="sm"
                              fallbackText={product.brandName}
                              className="shrink-0"
                            />
                            <span>{product.brandName}</span>
                            {product.isCurrentBrand && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Engine Presence */}
                      <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80">
                        <div className="flex flex-wrap items-center justify-center gap-1">
                          {product.engines.map((eng) => (
                            <EngineBadge key={eng} engine={eng} size="sm" />
                          ))}
                        </div>
                      </td>

                      {/* Avg Position */}
                      <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 font-mono font-semibold text-slate-900">
                        #{product.avgRankPosition}
                      </td>

                      {/* Frequency / Share of Shelf */}
                      <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 min-w-[140px]">
                        <div className="max-w-[140px] mx-auto">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                            <span>{product.inclusionFrequencyPct}%</span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              ({product.totalMentions} hits)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                product.isCurrentBrand ? "bg-emerald-500" : "bg-indigo-500"
                              }`}
                              style={{ width: `${product.inclusionFrequencyPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Price Mentioned */}
                      <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 font-mono font-medium text-slate-700">
                        <div className="flex items-center justify-center">
                          {product.priceMentioned ? (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-xs">
                              {product.priceMentioned}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </div>
                      </td>

                      {/* Sentiment */}
                      <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80">
                        <div className="flex items-center justify-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                              product.sentiment === "positive"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : product.sentiment === "negative"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {product.sentiment === "positive" ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <HelpCircle className="w-3 h-3 text-slate-400" />
                            )}
                            {product.sentiment}
                          </span>
                        </div>
                      </td>

                      {/* Expand Action */}
                      <td className="py-3.5 px-4 text-center border-b border-slate-200/80">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => toggleExpand(product.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                              isExpanded
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <Quote className="w-3 h-3" />
                            <span>{isExpanded ? "Hide Quotes" : "AI Quotes"}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Drawer: AI Grounding Context Quotes */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90 border-b border-slate-200/80">
                        <td colSpan={9} className="p-4 lg:p-5">
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                <span className="text-xs font-bold text-slate-900">
                                  Verbatim AI Grounding Quotes & Prompts for "{product.productName}"
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                {product.rawContexts.length} model citations recorded
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {product.rawContexts.map((ctx, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-2.5 flex flex-col justify-between"
                                >
                                  {/* Prompt Attribution */}
                                  {ctx.promptText && (
                                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 text-[11px]">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <MessageSquare className="w-3 h-3 text-indigo-500 shrink-0" />
                                        <span className="font-medium text-slate-700 truncate" title={ctx.promptText}>
                                          Prompt: "{ctx.promptText}"
                                        </span>
                                      </div>
                                      {onViewPrompt && (
                                        <button
                                          type="button"
                                          onClick={() => onViewPrompt(ctx.promptText!)}
                                          className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline shrink-0"
                                        >
                                          View in Prompts →
                                        </button>
                                      )}
                                    </div>
                                  )}

                                  {/* Engine & Rank Header */}
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <EngineBadge engine={ctx.engine} size="sm" />
                                      <span className="font-mono text-slate-500 text-[11px]">
                                        Rank #{ctx.rankPosition}
                                      </span>
                                    </div>
                                    {ctx.price && (
                                      <span className="font-mono text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                                        {ctx.price}
                                      </span>
                                    )}
                                  </div>

                                  <blockquote className="text-xs text-slate-600 italic leading-relaxed pt-0.5">
                                    "{ctx.quote}"
                                  </blockquote>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
