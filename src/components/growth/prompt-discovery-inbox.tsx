"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  CheckCircle2,
  Inbox,
  Filter,
  Search,
  Flame,
  Layers,
  ArrowUpRight,
  Compass,
  Scale,
  ShoppingBag,
  RotateCcw,
  CheckSquare,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PromptOpportunity,
  OpportunityIntent,
  OpportunityStatus,
} from "@/lib/types";
import { MinePromptsModal } from "./mine-prompts-modal";
import {
  trackOpportunityAction,
  dismissOpportunityAction,
  minePromptOpportunities,
} from "@/app/actions/minePromptOpportunities";

interface PromptDiscoveryInboxProps {
  brandId: string;
  brandName: string;
  competitors: string[];
  initialOpportunities: PromptOpportunity[];
  onPromptTracked?: (promptText: string) => void;
  isMineModalOpen?: boolean;
  onCloseMineModal?: () => void;
  onOpenMineModal?: () => void;
}

export function PromptDiscoveryInbox({
  brandId,
  brandName,
  competitors,
  initialOpportunities,
  onPromptTracked,
  isMineModalOpen,
  onCloseMineModal,
  onOpenMineModal,
}: PromptDiscoveryInboxProps) {
  const [opportunities, setOpportunities] =
    useState<PromptOpportunity[]>(initialOpportunities);
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | "all">(
    "pending"
  );
  const [selectedCluster, setSelectedCluster] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedClusters, setCollapsedClusters] = useState<Record<string, boolean>>({});
  const [localModalOpen, setLocalModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Scroll ref for cluster filter container
  const clusterScrollRef = useRef<HTMLDivElement | null>(null);

  const modalIsOpen = isMineModalOpen !== undefined ? isMineModalOpen : localModalOpen;
  const handleCloseModal = onCloseMineModal || (() => setLocalModalOpen(false));
  const handleOpenModal = onOpenMineModal || (() => setLocalModalOpen(true));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle accordion cluster
  const toggleCluster = (clusterName: string) => {
    setCollapsedClusters((prev) => ({
      ...prev,
      [clusterName]: !prev[clusterName],
    }));
  };

  // Metrics
  const pendingCount = opportunities.filter((o) => o.status === "pending").length;
  const acceptedCount = opportunities.filter((o) => o.status === "accepted").length;
  const dismissedCount = opportunities.filter((o) => o.status === "dismissed").length;
  const totalCount = opportunities.length;

  const avgRelevance =
    opportunities.length > 0
      ? Math.round(
          opportunities.reduce((sum, o) => sum + o.estimatedRelevance, 0) /
            opportunities.length
        )
      : 0;

  // Extract all unique topic clusters
  const clusters = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => {
      if (o.topicCluster) set.add(o.topicCluster);
    });
    return Array.from(set);
  }, [opportunities]);

  // Filtered list based on status, search, and cluster
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      if (selectedCluster !== "all" && item.topicCluster !== selectedCluster) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesPrompt = item.suggestedPrompt.toLowerCase().includes(query);
        const matchesCluster = item.topicCluster.toLowerCase().includes(query);
        const matchesIntent = item.intentCategory.toLowerCase().includes(query);
        if (!matchesPrompt && !matchesCluster && !matchesIntent) return false;
      }
      return true;
    });
  }, [opportunities, statusFilter, selectedCluster, searchQuery]);

  // Group filtered items by topic_cluster
  const groupedByCluster = useMemo(() => {
    const groups: Record<string, PromptOpportunity[]> = {};
    filteredOpportunities.forEach((opp) => {
      const cluster = opp.topicCluster || "Uncategorized Opportunities";
      if (!groups[cluster]) {
        groups[cluster] = [];
      }
      groups[cluster].push(opp);
    });
    return groups;
  }, [filteredOpportunities]);

  // Single Item Selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Cluster Select All Toggle
  const toggleClusterSelect = (clusterItems: PromptOpportunity[]) => {
    const clusterIds = clusterItems.map((i) => i.id);
    const allSelected = clusterIds.every((id) => selectedIds.has(id));

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        clusterIds.forEach((id) => next.delete(id));
      } else {
        clusterIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const allVisibleSelected =
    filteredOpportunities.length > 0 &&
    filteredOpportunities.every((item) => selectedIds.has(item.id));
  const someVisibleSelected =
    !allVisibleSelected &&
    filteredOpportunities.some((item) => selectedIds.has(item.id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      clearSelection();
    } else {
      setSelectedIds(new Set(filteredOpportunities.map((i) => i.id)));
    }
  };

  // Bulk Actions
  const handleBulkTrack = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkProcessing(true);
    const idsToTrack = Array.from(selectedIds);
    const selectedItems = opportunities.filter((o) => selectedIds.has(o.id));

    // Optimistic update
    setOpportunities((prev) =>
      prev.map((o) =>
        selectedIds.has(o.id)
          ? { ...o, status: "accepted", updatedAt: new Date().toISOString() }
          : o
      )
    );

    if (onPromptTracked) {
      selectedItems.forEach((i) => onPromptTracked(i.suggestedPrompt));
    }

    showToast(`Successfully tracked ${idsToTrack.length} prompts to active monitoring!`);
    clearSelection();

    // Call server action for each
    try {
      await Promise.all(
        idsToTrack.map((id) => trackOpportunityAction(id, brandId))
      );
    } catch (err) {
      console.error("Bulk track error:", err);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkDismiss = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkProcessing(true);
    const idsToDismiss = Array.from(selectedIds);

    // Optimistic update
    setOpportunities((prev) =>
      prev.map((o) =>
        selectedIds.has(o.id)
          ? { ...o, status: "dismissed", updatedAt: new Date().toISOString() }
          : o
      )
    );

    showToast(`Dismissed ${idsToDismiss.length} prompt opportunities.`);
    clearSelection();

    try {
      await Promise.all(
        idsToDismiss.map((id) => dismissOpportunityAction(id, brandId))
      );
    } catch (err) {
      console.error("Bulk dismiss error:", err);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Scroll cluster filter left/right
  const scrollClusters = (direction: "left" | "right") => {
    if (clusterScrollRef.current) {
      clusterScrollRef.current.scrollBy({
        left: direction === "left" ? -220 : 220,
        behavior: "smooth",
      });
    }
  };

  // Handle single Track Prompt
  const handleTrackPrompt = async (opp: PromptOpportunity) => {
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === opp.id
          ? { ...o, status: "accepted", updatedAt: new Date().toISOString() }
          : o
      )
    );
    showToast(`Added "${opp.suggestedPrompt.substring(0, 45)}..." to daily tracking!`);

    if (onPromptTracked) {
      onPromptTracked(opp.suggestedPrompt);
    }

    const res = await trackOpportunityAction(opp.id, brandId);
    if (!res.success) {
      showToast(res.error || "Failed to track prompt");
      setOpportunities((prev) =>
        prev.map((o) => (o.id === opp.id ? { ...o, status: "pending" } : o))
      );
    }
  };

  // Handle single Dismiss Prompt
  const handleDismissPrompt = async (opp: PromptOpportunity) => {
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === opp.id
          ? { ...o, status: "dismissed", updatedAt: new Date().toISOString() }
          : o
      )
    );
    showToast("Opportunity dismissed.");

    const res = await dismissOpportunityAction(opp.id, brandId);
    if (!res.success) {
      showToast(res.error || "Failed to dismiss opportunity");
      setOpportunities((prev) =>
        prev.map((o) => (o.id === opp.id ? { ...o, status: "pending" } : o))
      );
    }
  };

  // Handle restore prompt back to pending
  const handleRestorePrompt = async (opp: PromptOpportunity) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === opp.id ? { ...o, status: "pending" } : o))
    );
    showToast("Opportunity moved back to Pending Inbox.");
  };

  // Handle autonomous mining trigger from modal
  const handleMine = async (customCompetitors: string[], catalogContext: string) => {
    const res = await minePromptOpportunities({
      brandId,
      brandName,
      competitorNames: customCompetitors,
      catalogContext,
    });

    if (res.success && res.data) {
      setOpportunities((prev) => [...res.data!, ...prev]);
      setStatusFilter("pending");
      showToast(`Successfully mined ${res.data.length} new high-intent prompts!`);
    } else {
      showToast(res.error || "Prompt mining failed. Please try again.");
    }
  };

  const getIntentBadge = (intent: OpportunityIntent) => {
    switch (intent) {
      case "Discovery":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
            <Compass className="w-3 h-3 text-sky-500 shrink-0" />
            <span>Discovery</span>
          </span>
        );
      case "Consideration":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
            <Scale className="w-3 h-3 text-indigo-500 shrink-0" />
            <span>Consideration</span>
          </span>
        );
      case "Commercial":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <ShoppingBag className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Commercial</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {intent}
          </span>
        );
    }
  };

  // Standardized intuitive traffic-light relevance styling
  const getRelevanceStyle = (score: number) => {
    if (score >= 90) {
      return {
        barColor: "bg-emerald-500",
        textColor: "text-emerald-700",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        label: "High",
      };
    }
    if (score >= 80) {
      return {
        barColor: "bg-amber-500",
        textColor: "text-amber-700",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200/80",
        label: "Good",
      };
    }
    if (score >= 70) {
      return {
        barColor: "bg-orange-500",
        textColor: "text-orange-700",
        badgeBg: "bg-orange-50 text-orange-700 border-orange-200/80",
        label: "Moderate",
      };
    }
    return {
      barColor: "bg-slate-400",
      textColor: "text-slate-600",
      badgeBg: "bg-slate-100 text-slate-600 border-slate-200",
      label: "Low",
    };
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Discovery Modal */}
      <MinePromptsModal
        isOpen={modalIsOpen}
        onClose={handleCloseModal}
        brandName={brandName}
        defaultCompetitors={competitors}
        onMine={handleMine}
      />

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold">
              {selectedIds.size} {selectedIds.size === 1 ? "query" : "queries"} selected
            </span>
          </div>

          <Button
            size="sm"
            onClick={handleBulkTrack}
            disabled={isBulkProcessing}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-8.5 px-3.5 gap-1.5 shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Track Selected ({selectedIds.size})</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkDismiss}
            disabled={isBulkProcessing}
            className="rounded-xl border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs h-8.5 px-3.5 gap-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Dismiss Selected ({selectedIds.size})</span>
          </Button>

          <button
            onClick={clearSelection}
            disabled={isBulkProcessing}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer ml-1"
          >
            Cancel
          </button>
        </div>
      )}

      {/* KPI Cards Strip - Clear Non-Conflicting Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending In Inbox */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Pending Triage
            </span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {pendingCount}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              Requires Review
            </span>
          </div>
        </div>

        {/* Accepted / Promoted */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Accepted to Tracker
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-600 tracking-tight">
              {acceptedCount}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Triaged & Added
            </span>
          </div>
        </div>

        {/* Dismissed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Dismissed Queries
            </span>
            <X className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-700 tracking-tight">
              {dismissedCount}
            </span>
            <span className="text-xs font-medium text-slate-400">
              Filtered out
            </span>
          </div>
        </div>

        {/* Avg Relevance Score */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Avg. Relevance Score
            </span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {avgRelevance}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              High Buyer Intent
            </span>
          </div>
        </div>
      </div>

      {/* List Toolbar: Status Tabs & Search (Dedicated Strictly to Manipulating Current List) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Status Tabs Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === "pending"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Pending Inbox</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === "pending"
                    ? "bg-amber-100 text-amber-800 font-bold"
                    : "bg-slate-200 text-slate-600 font-medium"
                }`}
              >
                {pendingCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("accepted")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === "accepted"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Accepted</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === "accepted"
                    ? "bg-emerald-100 text-emerald-800 font-bold"
                    : "bg-slate-200 text-slate-600 font-medium"
                }`}
              >
                {acceptedCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("dismissed")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === "dismissed"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Dismissed</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-600 font-medium">
                {dismissedCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>All</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-600 font-medium">
                {totalCount}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search discovered queries or clusters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Refined Topic Cluster Filter UI: No native scrollbar, Chevron Controls, & Subtle Fade */}
        {clusters.length > 0 && (
          <div className="relative flex items-center pt-2.5 border-t border-slate-100">
            {/* Left Chevron */}
            <button
              type="button"
              onClick={() => scrollClusters("left")}
              aria-label="Scroll clusters left"
              className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors mr-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Seamless Horizontal Scroll Container (Native Scrollbar Hidden) */}
            <div
              ref={clusterScrollRef}
              className="flex-1 flex items-center gap-1.5 overflow-x-auto scroll-smooth py-0.5 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <button
                type="button"
                onClick={() => setSelectedCluster("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCluster === "all"
                    ? "bg-slate-900 text-white font-semibold shadow-2xs"
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                All Clusters ({opportunities.length})
              </button>
              {clusters.map((c) => {
                const clusterItemCount = opportunities.filter(
                  (o) => o.topicCluster === c
                ).length;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCluster(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                      selectedCluster === c
                        ? "bg-slate-900 text-white font-semibold shadow-2xs"
                        : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {c} ({clusterItemCount})
                  </button>
                );
              })}
            </div>

            {/* Right Chevron */}
            <button
              type="button"
              onClick={() => scrollClusters("right")}
              aria-label="Scroll clusters right"
              className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Accordion Cluster List with Clear Visual Hierarchy */}
      <div className="space-y-4">
        {Object.keys(groupedByCluster).length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {statusFilter === "pending"
                ? "Inbox Zero! All prompt opportunities triaged."
                : `No ${statusFilter} prompt opportunities found.`}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Run the autonomous Prompt Discovery Engine to crawl competitive search trends and unearth new buyer queries for {brandName}.
            </p>
            <Button
              type="button"
              onClick={handleOpenModal}
              className="mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs text-xs font-medium px-4 h-9 gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Discover High-Intent Prompts</span>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto max-h-[750px] overflow-y-auto">
              <table className="w-full text-center border-collapse text-xs">
                {/* Single Master Sticky Header */}
                <thead className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200 shadow-2xs">
                  <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 select-none">
                    <th className="py-3.5 px-3 text-center border-r border-slate-200/80 w-12 bg-slate-50">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={toggleSelectAllVisible}
                          title={allVisibleSelected ? "Deselect all queries" : "Select all queries"}
                          className="text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          {allVisibleSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : someVisibleSelected ? (
                            <div className="w-4 h-4 rounded border border-emerald-500 bg-emerald-50 flex items-center justify-center">
                              <div className="w-2 h-0.5 bg-emerald-600 rounded-xs" />
                            </div>
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 hover:text-slate-400" />
                          )}
                        </button>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-left border-r border-slate-200/80 min-w-[280px] bg-slate-50">
                      Suggested Query
                    </th>
                    <th className="py-3.5 px-3 text-center border-r border-slate-200/80 whitespace-nowrap bg-slate-50">
                      Intent Category
                    </th>
                    <th className="py-3.5 px-3 text-center border-r border-slate-200/80 whitespace-nowrap bg-slate-50">
                      Relevance Score
                    </th>
                    <th className="py-3.5 px-3 text-center border-r border-slate-200/80 whitespace-nowrap bg-slate-50">
                      Discovered
                    </th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap bg-slate-50">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedByCluster).map(([clusterName, clusterItems]) => {
                    const isCollapsed = Boolean(collapsedClusters[clusterName]);
                    const clusterPendingCount = clusterItems.filter(
                      (i) => i.status === "pending"
                    ).length;
                    const clusterAvgRelevance = Math.round(
                      clusterItems.reduce((acc, i) => acc + i.estimatedRelevance, 0) /
                        clusterItems.length
                    );
                    const clusterRelevanceStyle = getRelevanceStyle(clusterAvgRelevance);

                    const allClusterSelected =
                      clusterItems.length > 0 &&
                      clusterItems.every((item) => selectedIds.has(item.id));
                    const someClusterSelected =
                      !allClusterSelected &&
                      clusterItems.some((item) => selectedIds.has(item.id));

                    return (
                      <React.Fragment key={clusterName}>
                        {/* Divider Row: colSpan={6} with subtle gray background */}
                        <tr className="border-t border-b border-slate-200/80 bg-slate-50/90 transition-colors">
                          <td colSpan={6} className="px-5 py-3 text-left">
                            <div className="w-full flex items-center justify-between">
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Cluster Checkbox for Bulk Selection */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleClusterSelect(clusterItems);
                                  }}
                                  title={allClusterSelected ? "Deselect cluster" : "Select all in cluster"}
                                  className="p-0.5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                                >
                                  {allClusterSelected ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                                  ) : someClusterSelected ? (
                                    <div className="w-4 h-4 rounded border border-emerald-500 bg-emerald-50 flex items-center justify-center">
                                      <div className="w-2 h-0.5 bg-emerald-600 rounded-xs" />
                                    </div>
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-300 hover:text-slate-400" />
                                  )}
                                </button>

                                {/* Expand/Collapse Chevron Button */}
                                <button
                                  type="button"
                                  onClick={() => toggleCluster(clusterName)}
                                  className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  {isCollapsed ? (
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-700" />
                                  )}
                                </button>

                                {/* Cluster Name & Badges */}
                                <button
                                  type="button"
                                  onClick={() => toggleCluster(clusterName)}
                                  className="flex items-center gap-2 text-left cursor-pointer min-w-0 truncate"
                                >
                                  <span className="text-sm font-bold text-slate-900 tracking-tight truncate">
                                    {clusterName}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-slate-200/80 text-slate-600 shrink-0">
                                    {clusterItems.length} {clusterItems.length === 1 ? "query" : "queries"}
                                  </span>
                                  {clusterPendingCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0">
                                      {clusterPendingCount} pending
                                    </span>
                                  )}
                                </button>
                              </div>

                              {/* Standardized Cluster Relevance Badge */}
                              <div className="flex items-center gap-2 shrink-0 pl-2">
                                <span className="text-xs text-slate-400 hidden sm:inline">
                                  Cluster Relevance:
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${clusterRelevanceStyle.badgeBg}`}
                                >
                                  <Flame className="w-3 h-3" />
                                  {clusterAvgRelevance}%
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>

                        {/* Cluster Queries: Standard <tr> Data Rows */}
                        {!isCollapsed &&
                          clusterItems.map((item) => {
                            const isSelected = selectedIds.has(item.id);
                            const relStyle = getRelevanceStyle(item.estimatedRelevance);

                            return (
                              <tr
                                key={item.id}
                                className={`transition-colors ${
                                  isSelected ? "bg-emerald-50/40" : "hover:bg-slate-50/70"
                                }`}
                              >
                                {/* Checkbox */}
                                <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80">
                                  <div className="flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={() => toggleSelect(item.id)}
                                      className="text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                                    >
                                      {isSelected ? (
                                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                                      ) : (
                                        <Square className="w-4 h-4 text-slate-300 hover:text-slate-400" />
                                      )}
                                    </button>
                                  </div>
                                </td>

                                {/* Suggested Prompt Query */}
                                <td className="py-3.5 px-4 text-left border-r border-b border-slate-200/80">
                                  <div className="flex items-start gap-2">
                                    <span className="text-slate-300 font-serif text-sm leading-none select-none">
                                      “
                                    </span>
                                    <span className="text-xs font-semibold text-slate-800 leading-snug break-words">
                                      {item.suggestedPrompt}
                                    </span>
                                  </div>
                                </td>

                                {/* Intent Badge */}
                                <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 whitespace-nowrap">
                                  <div className="flex items-center justify-center">
                                    {getIntentBadge(item.intentCategory)}
                                  </div>
                                </td>

                                {/* Relevance Indicator */}
                                <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all ${relStyle.barColor}`}
                                        style={{ width: `${item.estimatedRelevance}%` }}
                                      />
                                    </div>
                                    <span className={`font-mono text-xs font-bold ${relStyle.textColor}`}>
                                      {item.estimatedRelevance}%
                                    </span>
                                  </div>
                                </td>

                                {/* Discovered Date */}
                                <td className="py-3.5 px-3 text-center border-r border-b border-slate-200/80 whitespace-nowrap text-[11px] text-slate-500 font-mono">
                                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>

                                {/* Action Buttons */}
                                <td className="py-3.5 px-4 text-center border-b border-slate-200/80 whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-2">
                                    {item.status === "pending" ? (
                                      <>
                                        <Button
                                          type="button"
                                          size="sm"
                                          onClick={() => handleTrackPrompt(item)}
                                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold text-xs px-3.5 h-8 gap-1.5 transition-all cursor-pointer"
                                        >
                                          <Plus className="w-3.5 h-3.5 text-emerald-100" />
                                          <span>Track Prompt</span>
                                        </Button>

                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleDismissPrompt(item)}
                                          className="rounded-xl border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs px-3 h-8 gap-1 transition-all cursor-pointer"
                                        >
                                          <X className="w-3.5 h-3.5 text-slate-400" />
                                          <span>Dismiss</span>
                                        </Button>
                                      </>
                                    ) : item.status === "accepted" ? (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Tracked in Prompts</span>
                                      </span>
                                    ) : (
                                      <div className="flex items-center justify-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                          <X className="w-3.5 h-3.5 text-slate-400" />
                                          <span>Dismissed</span>
                                        </span>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRestorePrompt(item)}
                                          title="Restore to pending inbox"
                                          className="h-7 px-2 text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                                        >
                                          <RotateCcw className="w-3 h-3 mr-1" />
                                          Restore
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
