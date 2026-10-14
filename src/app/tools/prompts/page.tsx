"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useBrand } from "@/context/brand-context";
import {
  PromptItem,
  SupportedEngine,
  ErrorLogItem,
  PromptType,
  BrandStatus,
  SearchIntent,
  PromptCategory,
} from "@/lib/types";
import { INITIAL_PROMPTS } from "@/lib/mock-data";
import { EngineBadge } from "@/components/prompts/engine-badge";
import { AddPromptModal } from "@/components/prompts/add-prompt-modal";
import {
  getPromptsByBrandAction,
  createPromptAction,
  updatePromptAction,
  deletePromptAction,
  runPromptAction,
  retryFailedEnginesAction,
} from "@/app/actions/prompt-actions";
import {
  Plus,
  MoreVertical,
  Play,
  Edit2,
  Trash2,
  Clock,
  Inbox,
  CheckCircle2,
  Loader2,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Info,
  ShieldAlert,
  BarChart2,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ListFilter,
  RefreshCw,
} from "lucide-react";
import { PromptDiscoveryInbox } from "@/components/growth/prompt-discovery-inbox";
import { getPromptOpportunitiesAction } from "@/app/actions/minePromptOpportunities";
import { PromptOpportunity } from "@/lib/types";

export default function PromptManagementPage() {
  const { currentBrand } = useBrand();

  // Prompt state
  const [prompts, setPrompts] = useState<PromptItem[]>(INITIAL_PROMPTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptItem | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [runningPromptId, setRunningPromptId] = useState<string | null>(null);
  const [retryingPromptId, setRetryingPromptId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTooltipPromptId, setActiveTooltipPromptId] = useState<string | null>(null);
  const [selectedPromptIds, setSelectedPromptIds] = useState<string[]>([]);

  // Filter states
  const [searchFilter, setSearchFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [intentFilter, setIntentFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const handleToggleSelectAll = () => {
    if (selectedPromptIds.length === filteredPrompts.length) {
      setSelectedPromptIds([]);
    } else {
      setSelectedPromptIds(filteredPrompts.map((p) => p.id));
    }
  };

  const handleToggleSelectPrompt = (id: string) => {
    setSelectedPromptIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchRun = async () => {
    const count = selectedPromptIds.length;
    showToast(`Dispatched ${count} prompts to AI engines queue.`);
    for (const id of selectedPromptIds) {
      const p = prompts.find((item) => item.id === id);
      if (p) {
        runPromptAction(p.id, p.queryText, p.targetEngines);
      }
    }
    setSelectedPromptIds([]);
  };

  const handleBatchDelete = async () => {
    const count = selectedPromptIds.length;
    for (const id of selectedPromptIds) {
      deletePromptAction(id);
    }
    setPrompts((prev) => prev.filter((p) => !selectedPromptIds.includes(p.id)));
    setSelectedPromptIds([]);
    showToast(`Deleted ${count} prompts.`);
  };

  const handleBatchExport = () => {
    const selected = prompts.filter((p) => selectedPromptIds.includes(p.id));
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Prompt Query,Brand Status,Intent,Category,Frequency"]
        .concat(
          selected.map(
            (p) =>
              `"${p.queryText}","${p.brandedType || "Unbranded"}","${p.searchIntent || "Commercial"}","${p.promptCategory || "General"}","${p.frequency}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `recomnd_prompts_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${selected.length} prompts to CSV.`);
  };

  // Tab state: "active" (tracked prompts) vs "discovery" (triage inbox)
  const [activeTab, setActiveTab] = useState<"active" | "discovery">("active");

  // Prompt Discovery Opportunities state
  const [opportunities, setOpportunities] = useState<PromptOpportunity[]>([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(true);
  const [isMineModalOpen, setIsMineModalOpen] = useState(false);

  const loadOpportunities = () => {
    setIsLoadingOpportunities(true);
    getPromptOpportunitiesAction(currentBrand.id)
      .then((data) => {
        setOpportunities(data);
        setIsLoadingOpportunities(false);
      })
      .catch((err) => {
        console.error("Failed to load prompt opportunities:", err);
        setIsLoadingOpportunities(false);
      });
  };

  // Load prompts and opportunities from DB with fallback
  useEffect(() => {
    let isMounted = true;
    getPromptsByBrandAction(currentBrand.id).then((items) => {
      if (isMounted) {
        setPrompts(items);
      }
    });
    loadOpportunities();
    return () => {
      isMounted = false;
    };
  }, [currentBrand.id]);

  const handlePromptTracked = (promptText: string) => {
    // Add newly tracked prompt to active prompts state optimistically
    const existing = prompts.find(
      (p) => p.brandId === currentBrand.id && p.queryText.toLowerCase() === promptText.toLowerCase()
    );
    if (!existing) {
      const newTrackedPrompt: PromptItem = {
        id: `p-${Date.now()}`,
        brandId: currentBrand.id,
        queryText: promptText,
        frequency: "daily",
        targetEngines: ["chatgpt", "gemini", "perplexity", "claude"],
        promptType: "Recommendation",
        brandedType: "Unbranded",
        searchIntent: "Commercial",
        promptCategory: "Top of Funnel Discovery",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        latestStatus: "completed",
      };
      setPrompts((prev) => [newTrackedPrompt, ...prev]);
    }

    setOpportunities((prev) =>
      prev.map((o) =>
        o.suggestedPrompt === promptText
          ? { ...o, status: "accepted", updatedAt: new Date().toISOString() }
          : o
      )
    );
  };

  // Filter prompts for the active brand
  const currentPrompts = prompts.filter(
    (p) => p.brandId === currentBrand.id
  );

  // Filtered prompts based on active search & dropdown filters
  const filteredPrompts = useMemo(() => {
    return currentPrompts.filter((prompt) => {
      if (
        searchFilter.trim() &&
        !prompt.queryText.toLowerCase().includes(searchFilter.trim().toLowerCase())
      ) {
        return false;
      }
      if (brandFilter !== "all" && (prompt.brandedType || "Unbranded") !== brandFilter) {
        return false;
      }
      if (intentFilter !== "all" && (prompt.searchIntent || "Commercial") !== intentFilter) {
        return false;
      }
      if (categoryFilter !== "all" && (prompt.promptCategory || "Top of Funnel Discovery") !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [currentPrompts, searchFilter, brandFilter, intentFilter, categoryFilter]);

  const hasActiveFilters =
    Boolean(searchFilter.trim()) ||
    brandFilter !== "all" ||
    intentFilter !== "all" ||
    categoryFilter !== "all";

  const resetFilters = () => {
    setSearchFilter("");
    setBrandFilter("all");
    setIntentFilter("all");
    setCategoryFilter("all");
  };

  // Badge render helpers
  const renderPromptTypeBadge = (type?: PromptType) => {
    const val = type || "Recommendation";
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
        {val}
      </span>
    );
  };

  const renderBrandedBadge = (status?: BrandStatus) => {
    const isBranded = status === "Branded";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${
          isBranded
            ? "bg-purple-50 text-purple-700 border-purple-200"
            : "bg-slate-100 text-slate-600 border-slate-200"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${
            isBranded ? "bg-purple-500" : "bg-slate-400"
          }`}
        />
        {isBranded ? "Branded" : "Unbranded"}
      </span>
    );
  };

  const renderSearchIntentBadge = (intent?: SearchIntent) => {
    const val = intent || "Commercial";
    const styles: Record<SearchIntent, string> = {
      Commercial: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Transactional: "bg-amber-50 text-amber-700 border-amber-200",
      Informational: "bg-sky-50 text-sky-700 border-sky-200",
      Navigational: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
    const dotColors: Record<SearchIntent, string> = {
      Commercial: "bg-emerald-500",
      Transactional: "bg-amber-500",
      Informational: "bg-sky-500",
      Navigational: "bg-indigo-500",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${
          styles[val] || styles.Commercial
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[val] || "bg-emerald-500"}`} />
        <span>{val}</span>
      </span>
    );
  };

  const renderCategoryBadge = (cat?: PromptCategory) => {
    const val = cat || "Top of Funnel Discovery";
    const styles: Record<PromptCategory, string> = {
      "Product Comparison": "bg-blue-50 text-blue-700 border-blue-200",
      "Top of Funnel Discovery": "bg-violet-50 text-violet-700 border-violet-200",
      "Buying Guide": "bg-teal-50 text-teal-700 border-teal-200",
      "Feature Reviews": "bg-orange-50 text-orange-800 border-orange-200",
      "Competitor Alternatives": "bg-rose-50 text-rose-700 border-rose-200",
    };
    const dotColors: Record<PromptCategory, string> = {
      "Product Comparison": "bg-blue-500",
      "Top of Funnel Discovery": "bg-violet-500",
      "Buying Guide": "bg-teal-500",
      "Feature Reviews": "bg-orange-500",
      "Competitor Alternatives": "bg-rose-500",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${
          styles[val] || styles["Top of Funnel Discovery"]
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[val] || "bg-violet-500"}`} />
        <span>{val}</span>
      </span>
    );
  };

  // Helper to format relative time
  const formatRelativeTime = (isoString?: string | null) => {
    if (!isoString) return "Never";
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "Just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSavePrompt = async (data: {
    queryText: string;
    frequency: "daily" | "weekly";
    targetEngines: SupportedEngine[];
    promptType?: PromptType;
    brandedType?: BrandStatus;
    searchIntent?: SearchIntent;
    promptCategory?: PromptCategory;
  }) => {
    if (editingPrompt) {
      await updatePromptAction({
        id: editingPrompt.id,
        ...data,
      });
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === editingPrompt.id
            ? {
                ...p,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );
      showToast("Prompt successfully updated.");
    } else {
      const res = await createPromptAction({
        brandId: currentBrand.id,
        ...data,
      });
      const newPrompt: PromptItem = res.data;
      setPrompts((prev) => [newPrompt, ...prev]);
      showToast("New audit prompt created and registered with Inngest queue.");
    }
  };

  const handleDeletePrompt = async (id: string) => {
    await deletePromptAction(id);
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    setActiveMenuId(null);
    showToast("Prompt deleted.");
  };

  const handleRunNow = async (prompt: PromptItem) => {
    setActiveMenuId(null);
    setRunningPromptId(prompt.id);
    await runPromptAction(prompt.id, prompt.queryText, prompt.targetEngines);

    setPrompts((prev) =>
      prev.map((p) =>
        p.id === prompt.id
          ? {
              ...p,
              lastExecutedAt: new Date().toISOString(),
              latestStatus: "completed",
              failedEngines: [],
              latestErrorLog: [],
            }
          : p
      )
    );
    setRunningPromptId(null);
    showToast("Dispatched durable AI execution through Inngest queue! Results saved.");
  };

  const handleRetryFailedEngines = async (prompt: PromptItem) => {
    setActiveMenuId(null);
    const failed = prompt.failedEngines || [];
    if (failed.length === 0) {
      handleRunNow(prompt);
      return;
    }

    setRetryingPromptId(prompt.id);
    await retryFailedEnginesAction(prompt.id, failed);

    setPrompts((prev) =>
      prev.map((p) =>
        p.id === prompt.id
          ? {
              ...p,
              latestStatus: "completed",
              failedEngines: [],
              latestErrorLog: [],
              lastExecutedAt: new Date().toISOString(),
            }
          : p
      )
    );
    setRetryingPromptId(null);
    showToast(`Successfully retried ${failed.join(", ")} via Inngest step-level recovery.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header: Title & Brand Subtitle on Left, Global Actions on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              Prompt Intelligence
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Prompt Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure conversational search queries and discover high-intent buyer opportunities for{" "}
            <span className="font-semibold text-slate-700">{currentBrand.brandName}</span>.
          </p>
        </div>

        {/* Global Page Actions: Primary "Discover New Prompts", "+ Add New Prompt", and "Refresh" */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsMineModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all hover:shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
            <span>Discover New Prompts</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingPrompt(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all hover:shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Prompt</span>
          </button>

          <button
            type="button"
            onClick={() => {
              getPromptsByBrandAction(currentBrand.id).then((items) => setPrompts(items));
              loadOpportunities();
            }}
            disabled={isLoadingOpportunities}
            title="Refresh prompts and discovery inbox"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer shadow-2xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isLoadingOpportunities ? "animate-spin text-emerald-600" : "text-slate-500"
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Consolidated Primary Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/90 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-xs rounded-t-xl transition-all cursor-pointer border-b-2 -mb-px ${
            activeTab === "active"
              ? "border-slate-900 text-slate-900 font-bold bg-white shadow-2xs"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <ListFilter
            className={`w-3.5 h-3.5 ${
              activeTab === "active" ? "text-slate-900" : "text-slate-400"
            }`}
          />
          <span>Tracked Prompts</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            25
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("discovery")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-xs rounded-t-xl transition-all cursor-pointer border-b-2 -mb-px ${
            activeTab === "discovery"
              ? "border-emerald-600 text-emerald-700 font-bold bg-emerald-50/40 shadow-2xs"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Sparkles
            className={`w-3.5 h-3.5 ${
              activeTab === "discovery" ? "text-emerald-600" : "text-slate-400"
            }`}
          />
          <span>Prompt Discovery Inbox</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            14 new
          </span>
        </button>
      </div>

      {/* Tab 1: Active Tracked Prompts */}
      {activeTab === "active" && (
        <div className="space-y-6 animate-in fade-in duration-200 pt-2">
          {/* Main Table or Empty State */}
      {currentPrompts.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Inbox className="w-6 h-6 stroke-1" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            No prompts configured for {currentBrand.brandName} yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 mb-6">
            Track your brand presence across conversational search models. Add your first buyer question or generate ideas automatically with AI.
          </p>
          <button
            onClick={() => {
              setEditingPrompt(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Prompt</span>
          </button>
        </div>
      ) : (
        /* Data Table & Filtering Controls */
        <div className="space-y-4">
          {/* Filtering & Search Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Quick Search */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search prompts by query..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full text-xs pl-10 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all placeholder:text-slate-400"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status / Count */}
              <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                <span>
                  Showing <strong className="text-slate-900">{filteredPrompts.length}</strong> of{" "}
                  <strong>25</strong> prompts
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline ml-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Reset filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-slate-100">
              {/* Filter: Brand Status */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Branded / Unbranded
                </label>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                >
                  <option value="all">All Brand Status</option>
                  <option value="Branded">Branded</option>
                  <option value="Unbranded">Unbranded</option>
                </select>
              </div>

              {/* Filter: Search Intent */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Search Intent
                </label>
                <select
                  value={intentFilter}
                  onChange={(e) => setIntentFilter(e.target.value)}
                  className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                >
                  <option value="all">All Intents</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Transactional">Transactional</option>
                  <option value="Informational">Informational</option>
                  <option value="Navigational">Navigational</option>
                </select>
              </div>

              {/* Filter: Prompt Category */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Prompt Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                >
                  <option value="all">All Categories</option>
                  <option value="Product Comparison">Product Comparison</option>
                  <option value="Top of Funnel Discovery">Top of Funnel Discovery</option>
                  <option value="Buying Guide">Buying Guide</option>
                  <option value="Feature Reviews">Feature Reviews</option>
                  <option value="Competitor Alternatives">Competitor Alternatives</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 select-none">
                    <th className="py-4 px-3 text-center border-r border-slate-200/80 w-10">
                      <input
                        type="checkbox"
                        checked={
                          filteredPrompts.length > 0 &&
                          selectedPromptIds.length === filteredPrompts.length
                        }
                        onChange={handleToggleSelectAll}
                        className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                        title="Select all prompts"
                      />
                    </th>
                    <th className="py-4 px-4 text-center border-r border-slate-200/80 min-w-[280px]">Prompt Query</th>
                    <th className="py-4 px-3 text-center border-r border-slate-200/80 whitespace-nowrap">Category</th>
                    <th className="py-4 px-3 text-center border-r border-slate-200/80 whitespace-nowrap">Brand Status</th>
                    <th className="py-4 px-3 text-center border-r border-slate-200/80 whitespace-nowrap">Search Intent</th>
                    <th className="py-4 px-3 text-center border-r border-slate-200/80 whitespace-nowrap">Engines</th>
                    <th className="py-4 px-3 text-center border-r border-slate-200/80 whitespace-nowrap">Frequency</th>
                    <th className="py-4 px-3 text-center border-r border-slate-200/80 whitespace-nowrap">Performance</th>
                    <th className="py-4 px-3 text-center border-r border-slate-200/80 whitespace-nowrap">Last Executed</th>
                    <th className="py-4 px-4 text-center whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {filteredPrompts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 px-4 text-center text-slate-500 border-b border-slate-200/80">
                        <div className="max-w-xs mx-auto space-y-2">
                          <p className="font-semibold text-slate-800 text-sm">
                            No prompts match the selected filters
                          </p>
                          <p className="text-xs text-slate-400">
                            Try broadening your search term or resetting category and intent filters.
                          </p>
                          <button
                            onClick={resetFilters}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors mt-2 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Clear All Filters</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPrompts.map((prompt) => {
                      const isRunning = runningPromptId === prompt.id || prompt.latestStatus === "running";
                      const isRetrying = retryingPromptId === prompt.id;
                      const isMenuOpen = activeMenuId === prompt.id;
                      const hasError =
                        prompt.latestStatus === "partial_success" ||
                        prompt.latestStatus === "failed" ||
                        (prompt.failedEngines && prompt.failedEngines.length > 0);
                      const isTooltipOpen = activeTooltipPromptId === prompt.id;

                      return (
                        <tr
                          key={prompt.id}
                          className={`hover:bg-slate-50/70 transition-colors group ${
                            selectedPromptIds.includes(prompt.id) ? "bg-slate-50/60" : ""
                          }`}
                        >
                          {/* Selection Checkbox */}
                          <td className="py-4 px-3 text-center border-r border-b border-slate-200/80">
                            <input
                              type="checkbox"
                              checked={selectedPromptIds.includes(prompt.id)}
                              onChange={() => handleToggleSelectPrompt(prompt.id)}
                              className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                            />
                          </td>

                          {/* Column 1: Prompt Query & Geo/Market Pill */}
                          <td className="py-4 px-4 text-left border-r border-b border-slate-200/80 min-w-[280px]">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-start gap-2.5">
                                {/* Warning / Error Indicator with Tooltip */}
                                {hasError && (
                                  <div className="relative shrink-0">
                                    <button
                                      type="button"
                                      onMouseEnter={() => setActiveTooltipPromptId(prompt.id)}
                                      onMouseLeave={() => setActiveTooltipPromptId(null)}
                                      onClick={() =>
                                        setActiveTooltipPromptId(isTooltipOpen ? null : prompt.id)
                                      }
                                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                                        prompt.latestStatus === "failed"
                                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                          : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                      }`}
                                      aria-label="View engine error details"
                                    >
                                      <AlertTriangle className="w-3.5 h-3.5 stroke-2" />
                                    </button>

                                    {/* Human-Readable Error Tooltip */}
                                    {isTooltipOpen && (
                                      <div className="absolute left-1/2 -translate-x-1/2 top-7 z-40 w-72 p-3 bg-white/95 backdrop-blur-md text-slate-800 rounded-xl shadow-xl shadow-slate-900/10 border border-slate-200/90 text-xs space-y-2 animate-in fade-in zoom-in-95 text-left">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                          <span className="font-semibold text-amber-600 flex items-center gap-1.5">
                                            <ShieldAlert className="w-3.5 h-3.5" />
                                            {prompt.latestStatus === "failed"
                                              ? "Execution Failed"
                                              : "Partial Engine Outage"}
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-mono">
                                            {prompt.failedEngines?.join(", ").toUpperCase()}
                                          </span>
                                        </div>

                                        <div className="space-y-1.5">
                                          {prompt.latestErrorLog && prompt.latestErrorLog.length > 0 ? (
                                            prompt.latestErrorLog.map((err, i) => (
                                              <div key={i} className="text-[11px] text-slate-600">
                                                <span className="font-semibold text-rose-600">
                                                  [{typeof err.engine === "string" ? err.engine : "ENGINE"}]:
                                                </span>{" "}
                                                {err.message}
                                              </div>
                                            ))
                                          ) : (
                                            <p className="text-[11px] text-slate-500 italic">
                                              Rate limited or timeout encountered during model generation.
                                            </p>
                                          )}
                                        </div>

                                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                                          <span>Use Actions &rarr; Retry</span>
                                          <span className="text-amber-600 font-medium">Auto-backoff active</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <Link
                                  href={`/reports/prompts?promptId=${prompt.id}`}
                                  className="font-semibold text-slate-900 text-xs leading-snug hover:text-indigo-600 transition-colors inline-block text-left"
                                >
                                  {prompt.queryText}
                                </Link>
                              </div>

                              {/* Subtle Region / Market Persona Pill */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                {prompt.geoMarket ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100/90 text-slate-600 border border-slate-200/70">
                                    {prompt.geoMarket}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100/90 text-slate-600 border border-slate-200/70">
                                    🇺🇸 US • General Activewear
                                  </span>
                                )}

                                {hasError && (
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                    prompt.latestStatus === "failed"
                                      ? "bg-rose-50 text-rose-700 border-rose-200"
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`}>
                                    {prompt.latestStatus === "failed"
                                      ? "All Engines Failed"
                                      : `Partial: ${prompt.failedEngines?.join(", ")} failed`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Prompt Category */}
                          <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              {renderCategoryBadge(prompt.promptCategory)}
                            </div>
                          </td>

                          {/* Column 3: Branded / Unbranded */}
                          <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              {renderBrandedBadge(prompt.brandedType)}
                            </div>
                          </td>

                          {/* Column 4: Search Intent */}
                          <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              {renderSearchIntentBadge(prompt.searchIntent)}
                            </div>
                          </td>

                          {/* Column 5: Engines (Horizontal compact row) */}
                          <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {prompt.targetEngines.map((engine) => {
                                const isFailed = prompt.failedEngines?.includes(engine);
                                return (
                                  <div key={engine} className="relative shrink-0">
                                    <EngineBadge engine={engine} size="sm" />
                                    {isFailed && (
                                      <span
                                        title={`${engine} failed during latest run`}
                                        className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white ring-1 ring-rose-300"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </td>

                          {/* Column 6: Frequency */}
                          <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              <span
                                className={`inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                  prompt.frequency === "daily"
                                    ? "bg-slate-100/80 text-slate-800 border-slate-200"
                                    : "bg-purple-50 text-purple-700 border-purple-200/80"
                                }`}
                              >
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span className="capitalize">{prompt.frequency}</span>
                              </span>
                            </div>
                          </td>

                          {/* Column 7: Performance / Avg Rank */}
                          <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              {prompt.performanceRank ? (
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                    prompt.performanceRank.variant === "green"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                                      : prompt.performanceRank.variant === "blue"
                                      ? "bg-blue-50 text-blue-700 border-blue-200/80"
                                      : "bg-slate-100 text-slate-500 border-slate-200"
                                  }`}
                                >
                                  {prompt.performanceRank.variant === "green" && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  )}
                                  {prompt.performanceRank.variant === "blue" && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                  )}
                                  <span>{prompt.performanceRank.label}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                  Unranked
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Column 8: Last Executed */}
                          <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                              {isRunning || isRetrying ? (
                                <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  {isRetrying ? "Retrying failed..." : "Executing queue..."}
                                </span>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{formatRelativeTime(prompt.lastExecutedAt)}</span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Column 9: Actions Menu */}
                          <td className="py-3.5 px-3 text-center border-b border-slate-200/80 whitespace-nowrap relative">
                            <div className="flex items-center justify-center gap-1.5">
                              <Link
                                href={`/reports/prompts?promptId=${prompt.id}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/70 transition-colors"
                              >
                                <span>Inspect</span>
                                <span className="text-[10px]">&rarr;</span>
                              </Link>
                              <button
                                onClick={() =>
                                  setActiveMenuId(isMenuOpen ? null : prompt.id)
                                }
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="More actions"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-20"
                                  onClick={() => setActiveMenuId(null)}
                                />
                                <div className="absolute right-3 top-9 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 text-left">
                                  {/* Inspect Analysis Link */}
                                  <Link
                                    href={`/reports/prompts?promptId=${prompt.id}`}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                  >
                                    <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Inspect Analysis</span>
                                  </Link>

                                  {/* Run Now (Full) */}
                                  <button
                                    onClick={() => handleRunNow(prompt)}
                                    disabled={isRunning || isRetrying}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                  >
                                    <Play className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Run All Engines</span>
                                  </button>

                                  {/* Retry Failed Engines Option */}
                                  {hasError && (
                                    <button
                                      onClick={() => handleRetryFailedEngines(prompt)}
                                      disabled={isRunning || isRetrying}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                                      <span>Retry Failed Engines</span>
                                    </button>
                                  )}

                                  {/* Edit Prompt Option */}
                                  <button
                                    onClick={() => {
                                      setEditingPrompt(prompt);
                                      setIsModalOpen(true);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Edit Configuration</span>
                                  </button>

                                  {/* Delete Prompt Option */}
                                  <div className="border-t border-slate-100 my-1" />
                                  <button
                                    onClick={() => handleDeletePrompt(prompt.id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                    <span>Delete Prompt</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
        </div>
      )}

      {/* Tab 2: Prompt Discovery Inbox */}
      {activeTab === "discovery" && (
        <div className="animate-in fade-in duration-200 pt-2">
          <PromptDiscoveryInbox
            key={currentBrand.id}
            brandId={currentBrand.id}
            brandName={currentBrand.brandName}
            competitors={currentBrand.competitors || []}
            initialOpportunities={opportunities}
            onPromptTracked={handlePromptTracked}
            isMineModalOpen={isMineModalOpen}
            onCloseMineModal={() => setIsMineModalOpen(false)}
            onOpenMineModal={() => setIsMineModalOpen(true)}
          />
        </div>
      )}

      {/* Add / Edit Prompt Dialog Modal */}
      <AddPromptModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPrompt(null);
        }}
        brandId={currentBrand.id}
        brandName={currentBrand.brandName}
        onSavePrompt={handleSavePrompt}
        initialPrompt={editingPrompt}
      />

      {/* Floating Bottom Action Bar for Bulk Operations */}
      {selectedPromptIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 px-5 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center font-mono">
              {selectedPromptIds.length}
            </span>
            <span className="text-xs font-medium text-slate-200">
              selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBatchRun}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run in AI Engines</span>
            </button>

            <button
              type="button"
              onClick={handleBatchExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Export Selected (CSV)</span>
            </button>

            <button
              type="button"
              onClick={handleBatchDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900/80 text-rose-300 text-xs font-medium border border-rose-800/60 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSelectedPromptIds([])}
            className="text-xs text-slate-400 hover:text-white underline ml-2 cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
