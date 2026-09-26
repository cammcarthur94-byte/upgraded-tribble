"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingProductCardItem,
  ShoppingCategoryCluster,
} from "@/lib/types";
import {
  ShoppingBag,
  Star,
  Check,
  Tag,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  MessageSquare,
  X,
  ArrowRight,
} from "lucide-react";
import { EngineBadge } from "@/components/prompts/engine-badge";
import { Favicon, EngineFavicon } from "@/components/ui/favicon";

interface ProductsViewProps {
  productCards: ShoppingProductCardItem[];
  categories: ShoppingCategoryCluster[];
  currentBrandName?: string;
  onViewPrompt?: (promptText: string) => void;
}

export function ProductsView({
  productCards,
  categories,
  currentBrandName = "Gymshark",
  onViewPrompt,
}: ProductsViewProps) {
  const [filterScope, setFilterScope] = useState<"all" | "own" | "competitors">("all");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [selectedCardForPrompts, setSelectedCardForPrompts] = useState<ShoppingProductCardItem | null>(null);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const ownCount = useMemo(
    () => productCards.filter((p) => p.isCurrentBrand).length,
    [productCards]
  );
  const compCount = useMemo(
    () => productCards.filter((p) => p.isCompetitor).length,
    [productCards]
  );

  const displayedCards = useMemo(() => {
    if (filterScope === "own") {
      return productCards.filter((p) => p.isCurrentBrand);
    }
    if (filterScope === "competitors") {
      return productCards.filter((p) => p.isCompetitor);
    }
    return productCards;
  }, [productCards, filterScope]);

  return (
    <div className="space-y-6">
      {/* 1. Upper Card: Product Visibility Cards with Image Packshots */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-5 lg:p-6 shadow-2xs space-y-4">
        {/* Header & Filter Scope Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-slate-500 shrink-0" />
            <h3 className="text-sm font-bold text-slate-900">Product Visibility</h3>
            <span className="text-xs text-slate-400 hidden sm:inline">
              · Most popular products in AI shopping tiles
            </span>
          </div>

          {/* Quick Scope Filter: All | Your Products | Competitor Products */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 text-xs">
            <button
              type="button"
              onClick={() => setFilterScope("all")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterScope === "all"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Products ({productCards.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterScope("own")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterScope === "own"
                  ? "bg-white text-emerald-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Your Brand ({ownCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterScope("competitors")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterScope === "competitors"
                  ? "bg-white text-indigo-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Competitors ({compCount})
            </button>
          </div>
        </div>

        {/* Product Tile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayedCards.map((card) => {
            const hasValidImage = card.imageUrl && !imageErrors[card.id];

            return (
              <div
                key={card.id}
                className={`rounded-xl border p-3 flex flex-col justify-between transition-all hover:border-slate-300 hover:shadow-xs group ${
                  card.isCurrentBrand
                    ? "border-emerald-300/70 bg-emerald-50/15"
                    : "border-slate-200/60 bg-white"
                }`}
              >
                <div>
                  {/* Product Image Container with Badges */}
                  <div className="w-full h-32 rounded-lg mb-2 bg-slate-50 border border-slate-200/60 relative overflow-hidden flex items-center justify-center">
                    {hasValidImage ? (
                      <img
                        src={card.imageUrl}
                        alt={card.productName}
                        onError={() => handleImageError(card.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white shadow-2xs flex items-center justify-center text-slate-400 border border-slate-200/60 group-hover:scale-105 transition-transform">
                        <ShoppingBag className="w-7 h-7 text-slate-400 stroke-1" />
                      </div>
                    )}

                    {/* Brand Ownership Pill: You vs Competitor */}
                    {card.isCurrentBrand ? (
                      <span className="absolute top-2 right-2 text-[9px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                        You
                      </span>
                    ) : (
                      <span className="absolute top-2 right-2 text-[9px] font-bold bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                        Competitor
                      </span>
                    )}

                    {/* Cited Source Link Overlay */}
                    {card.citedUrl && (
                      <a
                        href={card.citedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 left-2 p-1 rounded-md bg-white/90 backdrop-blur-xs text-slate-600 hover:text-slate-900 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title={`View cited product source: ${card.citedUrl}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Brand Tag Row */}
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        card.isCurrentBrand
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                          : "bg-slate-100 text-slate-700 border border-slate-200/60"
                      }`}
                    >
                      <Favicon
                        domain={card.brandName}
                        size={12}
                        rounded="sm"
                        fallbackText={card.brandName}
                        className="shrink-0"
                      />
                      <span>{card.brandName}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      SKU-{card.id.slice(-4).toUpperCase()}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h4
                    className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug"
                    title={card.productName}
                  >
                    {card.productName}
                  </h4>

                  {/* Unified Meta-Pill Bar directly under Product Title */}
                  <div className="flex flex-wrap items-center gap-1 mt-1.5 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100/90 text-slate-700 border border-slate-200/60 uppercase tracking-wider">
                      <EngineFavicon engine={card.engine} size={11} />
                      <span>{card.engine}</span>
                    </span>
                    <span className="inline-flex items-center text-[10px] font-medium text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60 truncate max-w-[85px]">
                      {card.category}
                    </span>
                    <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                      Rank #{card.occurrences > 2 ? "1" : "2"}
                    </span>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[11px] text-amber-500">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(card.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-700 ml-0.5">
                      {card.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Price & Merchant */}
                  <div className="mt-1 text-xs text-slate-600">
                    <span className="font-mono font-bold text-slate-900">
                      {card.price}
                    </span>{" "}
                    <span className="text-slate-400 text-[11px]">· {card.merchant}</span>
                  </div>
                </div>

                {/* Bottom Occurrences & Prompts Footer */}
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                  <span className="text-[11px] text-slate-500">{card.occurrences} hits</span>
                  {card.prompts && card.prompts.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setSelectedCardForPrompts(card)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                      title="View prompts where this product appeared"
                    >
                      <MessageSquare className="w-2.5 h-2.5" />
                      <span>{card.prompts.length} prompt{card.prompts.length !== 1 ? "s" : ""}</span>
                    </button>
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
          <span>{displayedCards.length} products displayed</span>
          <span className="text-slate-400 text-[11px]">
            Images resolved via product catalog Open Graph & cited metadata
          </span>
        </div>
      </div>

      {/* 2. Lower Card: Product Categories Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-2xs overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-500 shrink-0" />
            <h3 className="text-sm font-bold text-slate-900">Product Categories</h3>
            <span className="text-xs text-slate-400 hidden sm:inline">
              · Product clusters appearing in AI answers
            </span>
          </div>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 select-none">
                <th className="py-3.5 px-4 text-center border-r border-slate-200/80">Category</th>
                <th className="py-3.5 px-4 text-center border-r border-slate-200/80">Products</th>
                <th className="py-3.5 px-4 text-center border-r border-slate-200/80">Occurrences</th>
                <th className="py-3.5 px-4 text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {categories.map((cat) => (
                <tr key={cat.category} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-center border-r border-b border-slate-200/80 font-semibold text-slate-900">
                    {cat.category}
                  </td>
                  <td className="py-3.5 px-4 text-center border-r border-b border-slate-200/80 font-mono text-slate-600">
                    {cat.productCount}
                  </td>
                  <td className="py-3.5 px-4 text-center border-r border-b border-slate-200/80 font-mono font-medium text-slate-800">
                    {cat.occurrences.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center border-b border-slate-200/80 font-mono font-bold text-slate-900">
                    <span className="inline-flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{cat.rating.toFixed(1)}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Product Prompts Modal Dialog */}
      {selectedCardForPrompts && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-2xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Prompts Featuring Product
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    "{selectedCardForPrompts.productName}" ({selectedCardForPrompts.brandName})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCardForPrompts(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Prompt List */}
            <div className="p-5 overflow-y-auto space-y-3 divide-y divide-slate-100">
              <div className="text-xs text-slate-500 pb-1 flex items-center justify-between">
                <span>
                  Appeared in <strong>{selectedCardForPrompts.prompts?.length || 0}</strong> tracked commercial prompt queries:
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {selectedCardForPrompts.category} · {selectedCardForPrompts.price}
                </span>
              </div>

              {selectedCardForPrompts.prompts && selectedCardForPrompts.prompts.length > 0 ? (
                selectedCardForPrompts.prompts.map((p, pIdx) => (
                  <div
                    key={pIdx}
                    className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                          #{p.rankPosition}
                        </span>
                        <EngineBadge engine={p.engine} size="sm" />
                      </div>
                      <p className="text-xs font-semibold text-slate-900 leading-snug">
                        "{p.promptText}"
                      </p>
                    </div>

                    {onViewPrompt && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCardForPrompts(null);
                          onViewPrompt(p.promptText);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-all shrink-0 cursor-pointer"
                      >
                        <span>View in Prompts</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No linked prompt queries found for this product.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
              <span>Click "View in Prompts" to switch to the Prompts tab with this query</span>
              <button
                type="button"
                onClick={() => setSelectedCardForPrompts(null)}
                className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
