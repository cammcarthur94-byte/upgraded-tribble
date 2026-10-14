"use client";

import React, { useState, useEffect, useMemo, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBrand } from "@/context/brand-context";
import { usePlan } from "@/context/plan-context";
import { PlanFeatureLock } from "@/components/ui/plan-feature-lock";
import { Button } from "@/components/ui/button";
import { ShoppingAnalyticsSummary, ShoppingProductCardItem, ShoppingPromptRow } from "@/lib/types";
import {
  getProductVisibilityAnalyticsAction,
  extractProductsForPromptAction,
  reextractAllProductsForBrandAction,
} from "@/app/actions/product-actions";
import {
  ShoppingSubnavTabs,
  ShoppingTabType,
} from "@/components/shopping/shopping-subnav-tabs";
import { BrandsMerchantsView } from "@/components/shopping/brands-merchants-view";
import { ProductsView } from "@/components/shopping/products-view";
import { PromptsView } from "@/components/shopping/prompts-view";
import { ProductLeaderboardTable } from "@/components/shopping/product-leaderboard-table";
import {
  ShoppingBag,
  RefreshCw,
  CheckCircle2,
  Search,
  Download,
  Lock,
} from "lucide-react";

function ShoppingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ShoppingTabType) || "brands";

  const { currentBrand } = useBrand();
  const { limits, activePlanId } = usePlan();

  // Primary State
  const [activeTab, setActiveTab] = useState<ShoppingTabType>(initialTab);
  const [data, setData] = useState<ShoppingAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframeDays, setTimeframeDays] = useState<number>(7);
  const [granularity, setGranularity] = useState<"daily" | "weekly">("daily");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [shoppingOnly, setShoppingOnly] = useState<boolean>(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  const loadData = async (days?: number, platform?: string) => {
    setIsLoading(true);
    try {
      const res = await getProductVisibilityAnalyticsAction(
        currentBrand.id,
        "all",
        platform || selectedPlatform,
        days || timeframeDays
      );
      setData(res);
    } catch (err) {
      console.error("Failed to load product visibility analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(timeframeDays, selectedPlatform);
  }, [currentBrand.id]);

  const handleTabChange = (tab: ShoppingTabType) => {
    setActiveTab(tab);
    router.replace(`/reports/shopping?tab=${tab}`, { scroll: false });
  };

  const handlePlatformChange = (p: string) => {
    setSelectedPlatform(p);
    loadData(timeframeDays, p);
  };

  const handleTimeframeChange = (days: number) => {
    setTimeframeDays(days);
    loadData(days, selectedPlatform);
  };

  const handleExport = () => {
    if (!data) return;
    const cardsToExport = !limits.hasFullAiShoppingSuite
      ? data.productsView.productCards.slice(0, 10)
      : data.productsView.productCards;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Product Name,Brand,Category,Price,Rating,Occurrences\n" +
      cardsToExport
        .map(
          (p: ShoppingProductCardItem) =>
            `"${p.productName}","${p.brandName}","${p.category}","${p.price}",${p.rating},${p.occurrences}`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ai-shopping-${activeTab}-export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification(
      !limits.hasFullAiShoppingSuite
        ? "Export downloaded (Pro Plan: Top 10 products)."
        : "Export downloaded successfully."
    );
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReextract = () => {
    startTransition(async () => {
      try {
        const res = await reextractAllProductsForBrandAction(currentBrand.id);
        setData(res);
        setNotification("Successfully re-scanned all commercial prompts for product recommendations.");
        setTimeout(() => setNotification(null), 4000);
      } catch (err) {
        console.error("Extraction error:", err);
      }
    });
  };

  // Filtered Data for Active Views
  const filteredProducts = useMemo(() => {
    if (!data) return [];
    let list: ShoppingProductCardItem[] = data.productsView.productCards;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p: ShoppingProductCardItem) =>
          p.productName.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedPlatform !== "all") {
      list = list.filter((p: ShoppingProductCardItem) => p.engine === selectedPlatform);
    }

    if (selectedCategory !== "all") {
      list = list.filter((p: ShoppingProductCardItem) =>
        p.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    return list;
  }, [data, searchQuery, selectedPlatform, selectedCategory]);

  const filteredPrompts = useMemo(() => {
    if (!data) return [];
    let list: ShoppingPromptRow[] = data.promptsView.prompts;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p: ShoppingPromptRow) =>
          p.promptText.toLowerCase().includes(q) ||
          p.topBrand.toLowerCase().includes(q) ||
          (p.products &&
            p.products.some(
              (prod: any) =>
                prod.productName.toLowerCase().includes(q) ||
                prod.brandName.toLowerCase().includes(q) ||
                (prod.skuOrIdentifier &&
                  prod.skuOrIdentifier.toLowerCase().includes(q))
            ))
      );
    }

    if (selectedPlatform !== "all") {
      list = list.filter((p: ShoppingPromptRow) =>
        p.engines.some((e: string) => e === selectedPlatform)
      );
    }

    return list;
  }, [data, searchQuery, selectedPlatform]);

  if (!limits.hasAiShopping) {
    return (
      <div className="space-y-6 pb-16">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            AI Shopping
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Benchmark product carousel dominance, competitor share of shelf, and model recommendation frequency for{" "}
            <span className="font-semibold text-slate-700">{currentBrand.brandName}</span>.
          </p>
        </div>

        <PlanFeatureLock
          requiredPlan="pro"
          featureName="AI Shopping Shelf & Product Carousel Intelligence"
          description="AI Shopping tracking is available on Pro (Top 10 Products) and Scale plans (Full Carousel Suite). Upgrade your plan to track product visibility, merchant share of shelf, and AI recommendation rates across LLMs."
          highlights={[
            "Track brand recommendation frequency across ChatGPT, Perplexity & Claude shopping queries",
            "Monitor competitor merchant share of shelf and product pricing carousels",
            "Extract product recommendations and verbatim AI quotes in real time",
            "Export CSV product rankings and analyze top merchant vendors",
          ]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            AI Shopping
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Benchmark product carousel dominance, competitor share of shelf, and model recommendation frequency for{" "}
            <span className="font-semibold text-slate-700">{currentBrand.brandName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>
          <button
            onClick={handleReextract}
            disabled={isPending || isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 ${
                isPending || isLoading ? "animate-spin text-emerald-600" : ""
              }`}
            />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Pro Plan Summary View Indicator Banner */}
      {!limits.hasFullAiShoppingSuite && (
        <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-white p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Pro Plan: AI Shopping Summary View (Top 10 Products)
              </p>
              <p className="text-[11px] text-slate-500">
                Displaying your top 10 recommended products. Upgrade to Scale (Commerce) for unlimited SKU tracking, multi-region shelf analysis, and verified lift attribution.
              </p>
            </div>
          </div>
          <Link href="/settings?tab=billing" className="shrink-0">
            <Button size="sm" className="h-7 text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs">
              Upgrade to Scale →
            </Button>
          </Link>
        </div>
      )}

      {/* Top Controls & Navigation Bar */}
      <ShoppingSubnavTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        timeframeDays={timeframeDays}
        onTimeframeChange={handleTimeframeChange}
        shoppingOnly={shoppingOnly}
        onShoppingOnlyToggle={() => setShoppingOnly(!shoppingOnly)}
        selectedPlatform={selectedPlatform}
        onPlatformChange={handlePlatformChange}
        onShowToast={(msg) => {
          setNotification(msg);
          setTimeout(() => setNotification(null), 3000);
        }}
      />

      {/* Main View Render */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-20 text-center text-slate-400 shadow-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-sm font-medium text-slate-700">Loading AI Shopping analytics...</p>
          <p className="text-xs text-slate-400 mt-1">
            Aggregating brand share, product carousels, and commercial prompt intelligence
          </p>
        </div>
      ) : !data ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center text-slate-400 shadow-xs">
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-slate-300 stroke-1" />
          <p className="text-sm font-semibold text-slate-700">No shopping data available</p>
          <button
            onClick={handleReextract}
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Run Product Scan
          </button>
        </div>
      ) : (
        <>
          {/* Tab 1: Brands & Merchants */}
          {activeTab === "brands" && (
            <BrandsMerchantsView
              currentBrandName={currentBrand.brandName}
              productSharePct={data.brandsView.productSharePct}
              productShareDelta={data.brandsView.productShareDelta}
              competitors={data.brandsView.competitors}
              visibilityPct={data.brandsView.visibilityPct}
              visibilityDelta={data.brandsView.visibilityDelta}
              visibilityTrend={data.brandsView.visibilityTrend}
              vendors={data.brandsView.vendors}
              timeframeText={`Last ${timeframeDays} days`}
              onShowToast={(msg) => {
                setNotification(msg);
                setTimeout(() => setNotification(null), 3000);
              }}
            />
          )}

          {/* Tab 2: Products */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <ProductsView
                productCards={
                  !limits.hasFullAiShoppingSuite
                    ? filteredProducts.slice(0, 10)
                    : filteredProducts
                }
                categories={data.productsView.categories}
                onViewPrompt={(promptText) => {
                  setSearchQuery(promptText);
                  handleTabChange("prompts");
                }}
              />

              {/* Detailed Leaderboard with Verbatim AI Quotes Drawer */}
              <ProductLeaderboardTable
                products={
                  !limits.hasFullAiShoppingSuite
                    ? data.products.slice(0, 10)
                    : data.products
                }
                currentBrandName={currentBrand.brandName}
                onViewPrompt={(promptText) => {
                  setSearchQuery(promptText);
                  handleTabChange("prompts");
                }}
              />
            </div>
          )}

          {/* Tab 3: Prompts */}
          {activeTab === "prompts" && (
            <PromptsView
              prompts={filteredPrompts}
              totalCount={data.promptsView.totalCount}
              currentBrandName={currentBrand.brandName}
              onViewProduct={(productName) => {
                setSearchQuery(productName);
                handleTabChange("products");
              }}
            />
          )}
        </>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-400 pb-6">
        AI Shopping Analytics Dashboard • Powered by Recomnd v1.0
      </footer>
    </div>
  );
}

export default function ShoppingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
          <p className="text-sm">Loading AI Shopping analytics...</p>
        </div>
      }
    >
      <ShoppingPageContent />
    </Suspense>
  );
}
