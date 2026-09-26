"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useBrand } from "@/context/brand-context";
import {
  CitationsExplorerSummary,
  DomainIntelligenceItem,
  SupportedEngine,
} from "@/lib/types";
import { getCitationsExplorerDataAction } from "@/app/actions/report-actions";
import { EngineBadge } from "@/components/prompts/engine-badge";
import { CitationDetailsSheet } from "@/components/reports/citation-details-sheet";
import { MentionsTrendCard, CitationsTrendCard } from "@/components/citations/metric-trend-chart-card";
import { Favicon } from "@/components/ui/favicon";
import {
  Globe,
  Link2,
  PieChart,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  ArrowRight,
  Layers,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react";

export default function CitationsExplorerPage() {
  const { currentBrand } = useBrand();
  const [data, setData] = useState<CitationsExplorerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "owned" | "third_party">("all");
  const [engineFilter, setEngineFilter] = useState<SupportedEngine | "all">("all");
  const [sortBy, setSortBy] = useState<"citations" | "sentiment" | "trend" | "recent">("citations");
  const [activeTab, setActiveTab] = useState<"domains" | "clusters">("domains");
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<DomainIntelligenceItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedDomainNames, setSelectedDomainNames] = useState<string[]>([]);

  const handleToggleSelectAllDomains = () => {
    if (selectedDomainNames.length === sortedDomains.length) {
      setSelectedDomainNames([]);
    } else {
      setSelectedDomainNames(sortedDomains.map((d) => d.domain));
    }
  };

  const handleToggleSelectDomain = (domain: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedDomainNames((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const handleBatchExportDomains = () => {
    const selected = (data?.domains || []).filter((d) =>
      selectedDomainNames.includes(d.domain)
    );
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Domain,Type,Sentiment,Citations,Engines"]
        .concat(
          selected.map(
            (d) =>
              `"${d.domain}","${d.isBrandOwned ? "Brand Owned" : "Third Party"}","${d.sentiment}","${d.citationCount}","${d.referencingEngines.join("; ")}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `recomnd_citations_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadData = async (brandId: string) => {
    setLoading(true);
    try {
      const res = await getCitationsExplorerDataAction(brandId);
      setData(res);
    } catch (err) {
      console.error("Failed loading citations explorer data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentBrand.id);
  }, [currentBrand.id]);

  const handleRefresh = () => {
    startTransition(() => {
      loadData(currentBrand.id);
    });
  };

  const handleInspectDomain = (domainItem: DomainIntelligenceItem) => {
    setSelectedDomain(domainItem);
    setIsSheetOpen(true);
  };

  const toggleExpandDomain = (domain: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedDomain((prev) => (prev === domain ? null : domain));
  };

  // Filtered & Sorted domains
  const filteredDomains = (data?.domains || []).filter((item) => {
    const matchesSearch = item.domain.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const matchesType =
      typeFilter === "all"
        ? true
        : typeFilter === "owned"
        ? item.isBrandOwned
        : !item.isBrandOwned;
    const matchesEngine =
      engineFilter === "all" ? true : item.referencingEngines.includes(engineFilter);

    return matchesSearch && matchesType && matchesEngine;
  });

  const sortedDomains = [...filteredDomains].sort((a, b) => {
    if (sortBy === "sentiment") {
      return (b.sentimentScore ?? 0) - (a.sentimentScore ?? 0);
    }
    if (sortBy === "trend") {
      return (b.trendChange ?? 0) - (a.trendChange ?? 0);
    }
    if (sortBy === "recent") {
      return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
    }
    return b.citationCount - a.citationCount;
  });

  const formatRelativeTime = (iso: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      const days = Math.floor(diff / 86400);
      if (days === 1) return "Yesterday";
      if (days < 30) return `${days}d ago`;
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  const brandCompetitorShare = data?.competitorShare || [];
  const currentBrandShare = brandCompetitorShare.find((b) => b.isCurrentBrand) || {
    brandName: currentBrand.brandName,
    percentage: 42,
    citationCount: data?.totalSourcesCited || 60,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Citations & Referring Domains
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Analyze authoritative grounding sources, competitor share of citations, buyer intent clusters, and inline URLs for{" "}
            <span className="font-semibold text-slate-700">{currentBrand.brandName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={loading || isPending}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 ${
                loading || isPending ? "animate-spin text-indigo-600" : ""
              }`}
            />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sources Cited */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Total Sources Cited
            </span>
            <Link2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {loading ? "..." : data?.totalSourcesCited ?? 0}
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              +18% this wk
            </span>
          </div>
        </div>

        {/* Card 2: Unique Referring Domains */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Referring Domains
            </span>
            <Globe className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {loading ? "..." : data?.uniqueReferringDomains ?? 0}
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200/80">
              High Authority
            </span>
          </div>
        </div>

        {/* Card 3: Owned Source Ratio */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Owned Source Ratio
            </span>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {loading ? "..." : `${data?.ownedSourceRatio ?? 0}%`}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {100 - (data?.ownedSourceRatio ?? 27)}% 3rd-party
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, data?.ownedSourceRatio ?? 0)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Citation Share of Voice */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Citation Share (SoV)
            </span>
            <BarChart3 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {currentBrandShare.percentage}%
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                +8% this mo
              </span>
            </div>
            {/* Single brand progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, currentBrandShare.percentage)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mentions & Citations Trajectory Charts (2-Card Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <MentionsTrendCard
          data={data?.mentionsTrend}
          brandName={currentBrand.brandName}
        />
        <CitationsTrendCard
          data={data?.citationsTrend}
          brandName={currentBrand.brandName}
        />
      </div>

      {/* View Switcher: Domain Explorer vs Query Intent Clusters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("domains")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "domains"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Domain Explorer</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "domains" ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"
              }`}
            >
              {filteredDomains.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("clusters")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "clusters"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Query Intent Clusters</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "clusters" ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"
              }`}
            >
              {data?.intentClusters?.length || 4}
            </span>
          </button>
        </div>

        {activeTab === "domains" && (
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Click any row to expand inline URLs or inspect AI synthesis
          </div>
        )}
      </div>

      {/* TAB 1: DOMAIN EXPLORER */}
      {activeTab === "domains" && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search domains (e.g. reddit.com, runnersworld.com, gymshark.com)..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Domain Type Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 self-stretch lg:self-auto">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    typeFilter === "all"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setTypeFilter("owned")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    typeFilter === "owned"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Brand Owned
                </button>
                <button
                  onClick={() => setTypeFilter("third_party")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    typeFilter === "third_party"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Third-Party
                </button>
              </div>

              {/* Engine Filter Dropdown */}
              <div className="flex items-center gap-2 self-stretch lg:self-auto">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  Engine:
                </span>
                <select
                  value={engineFilter}
                  onChange={(e) => setEngineFilter(e.target.value as SupportedEngine | "all")}
                  className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-slate-400 shadow-xs cursor-pointer"
                >
                  <option value="all">All AI Engines</option>
                  <option value="perplexity">Perplexity Sonar</option>
                  <option value="chatgpt">OpenAI ChatGPT</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="claude">Anthropic Claude</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 self-stretch lg:self-auto">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-slate-400 shadow-xs cursor-pointer"
                >
                  <option value="citations">Most Citations</option>
                  <option value="sentiment">Top Sentiment</option>
                  <option value="trend">Momentum (+ Trend)</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>
            </div>

            {/* Filter stats active pill */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>
                Showing <span className="text-slate-900 font-semibold">{sortedDomains.length}</span> of{" "}
                <span className="text-slate-900 font-semibold">{data?.domains.length || 0}</span> discovered domains
              </span>
              {(searchQuery || typeFilter !== "all" || engineFilter !== "all" || sortBy !== "citations") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                    setEngineFilter("all");
                    setSortBy("citations");
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Domain Aggregation Table */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-3 text-center border-r border-slate-200/80 w-10">
                      <input
                        type="checkbox"
                        checked={
                          sortedDomains.length > 0 &&
                          selectedDomainNames.length === sortedDomains.length
                        }
                        onChange={handleToggleSelectAllDomains}
                        className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                        title="Select all domains"
                      />
                    </th>
                    <th className="py-4 px-4 text-center border-r border-slate-200/80">Root Domain</th>
                    <th className="py-4 px-4 text-center border-r border-slate-200/80">Domain Type</th>
                    <th className="py-4 px-4 text-center border-r border-slate-200/80">Sentiment Context</th>
                    <th className="py-4 px-4 text-center border-r border-slate-200/80">Citations & Trend</th>
                    <th className="py-4 px-4 text-center border-r border-slate-200/80">Referencing Engines</th>
                    <th className="py-4 px-4 text-center border-r border-slate-200/80">Last Seen</th>
                    <th className="py-4 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-slate-400 border-b border-slate-200/80">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                          <p className="text-sm font-medium text-slate-600">
                            Aggregating citation intelligence across models...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : sortedDomains.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-slate-400 border-b border-slate-200/80">
                        <div className="max-w-md mx-auto space-y-2">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                            <Globe className="w-6 h-6 stroke-1" />
                          </div>
                          <h4 className="text-base font-semibold text-slate-900">No Domains Found</h4>
                          <p className="text-xs text-slate-500">
                            No referring sources match your current filter parameters or search term.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedDomains.map((item) => {
                      const isExpanded = expandedDomain === item.domain;
                      return (
                        <React.Fragment key={item.domain}>
                          <tr
                            onClick={() => toggleExpandDomain(item.domain)}
                            className={`hover:bg-slate-50/70 transition-colors cursor-pointer group ${
                              isExpanded ? "bg-slate-50/90 font-medium" : ""
                            } ${selectedDomainNames.includes(item.domain) ? "bg-slate-50/60" : ""}`}
                          >
                            {/* Checkbox */}
                            <td
                              onClick={(e) => handleToggleSelectDomain(item.domain, e)}
                              className="py-4 px-3 text-center border-r border-b border-slate-200/80"
                            >
                              <input
                                type="checkbox"
                                checked={selectedDomainNames.includes(item.domain)}
                                onChange={() => {}}
                                className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                              />
                            </td>

                            {/* Root Domain */}
                            <td className="py-4 px-4 text-center border-r border-b border-slate-200/80">
                              <div className="flex items-center justify-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                  <Favicon
                                    domain={item.domain}
                                    size={18}
                                    fallbackText={item.domain}
                                  />
                                </div>
                                <div className="text-left min-w-0">
                                  <span className="font-semibold text-slate-900 text-xs sm:text-sm group-hover:text-indigo-600 transition-colors truncate block">
                                    {item.domain}
                                  </span>
                                  <span className="block text-[11px] text-slate-400 font-mono">
                                    {item.instances.length} URL snapshot{item.instances.length !== 1 ? "s" : ""}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Domain Type Badge (Minimalist Dot Indicator) */}
                            <td className="py-4 px-4 text-center whitespace-nowrap border-r border-b border-slate-200/80">
                              <div className="flex items-center justify-center">
                                {item.isBrandOwned ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>Brand Owned</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    <span>Third-Party</span>
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Sentiment & Context Breakdown */}
                            <td className="py-4 px-4 text-center whitespace-nowrap border-r border-b border-slate-200/80">
                              <div className="flex items-center justify-center">
                                {item.sentiment === "positive" ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>{item.sentimentScore ?? 80}% Positive</span>
                                  </span>
                                ) : item.sentiment === "neutral" ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span>Neutral ({item.sentimentScore ?? 55}%)</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    <span>Critical</span>
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Citation Count & Trend Momentum */}
                            <td className="py-4 px-4 text-center whitespace-nowrap border-r border-b border-slate-200/80">
                              <div className="inline-flex items-center justify-center gap-2">
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 min-w-[2rem]">
                                  {item.citationCount}
                                </span>
                                {(item.trendChange ?? 0) > 0 ? (
                                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-md">
                                    <TrendingUp className="w-3 h-3" />
                                    +{item.trendChange}%
                                  </span>
                                ) : (item.trendChange ?? 0) < 0 ? (
                                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200/60 px-1.5 py-0.5 rounded-md">
                                    <TrendingDown className="w-3 h-3" />
                                    {item.trendChange}%
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-medium text-slate-400">Flat</span>
                                )}
                              </div>
                            </td>

                            {/* Referencing AI Engines */}
                            <td className="py-4 px-4 text-center border-r border-b border-slate-200/80">
                              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xs mx-auto">
                                {item.referencingEngines.map((engine) => (
                                  <EngineBadge key={engine} engine={engine} size="sm" />
                                ))}
                              </div>
                            </td>

                            {/* Last Seen */}
                            <td className="py-4 px-4 text-center text-xs text-slate-600 font-medium whitespace-nowrap border-r border-b border-slate-200/80">
                              {formatRelativeTime(item.lastSeen)}
                            </td>

                            {/* Actions (Toggle Inline vs Inspect) */}
                            <td className="py-4 px-4 text-center whitespace-nowrap border-b border-slate-200/80">
                              <div className="inline-flex items-center justify-center gap-2">
                                <button
                                  onClick={(e) => toggleExpandDomain(item.domain, e)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                                  title={isExpanded ? "Collapse inline URLs" : "Expand inline URLs"}
                                >
                                  <span>{isExpanded ? "Hide" : "URLs"}</span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInspectDomain(item);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all shadow-2xs cursor-pointer"
                                >
                                  <span>Inspect</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* INLINE URL EXPANSION ROW */}
                          {isExpanded && (
                            <tr className="bg-slate-50/80 border-b border-slate-200/80">
                              <td colSpan={7} className="p-4 sm:p-5 border-b border-slate-200/80 text-left">
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Link2 className="w-4 h-4 text-indigo-600" />
                                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Exact Cited URLs & Grounding Snapshots ({item.instances.length})
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleInspectDomain(item)}
                                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                                    >
                                      <span>Open Full Context Analysis</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <div className="space-y-2">
                                    {item.instances.map((inst, i) => (
                                      <div
                                        key={i}
                                        className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                      >
                                        <div className="min-w-0 flex-1 space-y-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <EngineBadge engine={inst.engineName} size="sm" />
                                            <a
                                              href={inst.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={(e) => e.stopPropagation()}
                                              className="text-xs font-semibold text-indigo-600 hover:underline truncate max-w-lg inline-flex items-center gap-1 font-mono"
                                            >
                                              <span className="truncate">{inst.url}</span>
                                              <ExternalLink className="w-3 h-3 shrink-0" />
                                            </a>
                                          </div>
                                          <p className="text-xs text-slate-700 font-medium">
                                            <span className="text-slate-400 font-normal">Consumer Query:</span> &ldquo;{inst.promptQuery}&rdquo;
                                          </p>
                                          {inst.contextSnippet && (
                                            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2">
                                              {inst.contextSnippet}
                                            </p>
                                          )}
                                        </div>

                                        <button
                                          onClick={() => handleInspectDomain(item)}
                                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shrink-0 self-start sm:self-center cursor-pointer shadow-2xs"
                                        >
                                          Preview Context
                                        </button>
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
        </div>
      )}

      {/* TAB 2: QUERY INTENT CLUSTERS */}
      {activeTab === "clusters" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Buyer Intent & Consumer Query Clusters
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Citations grouped by consumer query type to connect LLM sourcing to specific buyer consideration stages.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(data?.intentClusters || []).map((cluster) => (
              <div
                key={cluster.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Cluster Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {cluster.intentPhase}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2">
                        {cluster.clusterName}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-400 font-medium">Volume</div>
                      <div className="text-sm font-bold text-slate-800">
                        {cluster.queryCount} Prompts • {cluster.totalCitations} Citations
                      </div>
                    </div>
                  </div>

                  {/* Brand Citation Share / SoV */}
                  <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/70">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700">
                        {currentBrand.brandName} Citation Share
                      </span>
                      <span className="font-bold text-emerald-600">{cluster.brandSoV}% SoV</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, cluster.brandSoV)}%` }}
                      />
                    </div>
                  </div>

                  {/* Top Driving Domains */}
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Primary Sourced Domains
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {cluster.topDomains.map((dom) => (
                        <div
                          key={dom.domain}
                          className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-white text-xs shadow-2xs"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <Favicon domain={dom.domain} size={14} fallbackText={dom.domain} />
                            <span className="truncate font-semibold text-slate-800">{dom.domain}</span>
                          </div>
                          <span className="font-bold text-slate-600 shrink-0 ml-1.5 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            {dom.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Customer Queries */}
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Driving Customer Queries
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {cluster.sampleQueries.map((q, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 text-slate-700 leading-relaxed"
                        >
                          <span className="text-indigo-500 font-bold">•</span>
                          <span className="italic">&ldquo;{q}&rdquo;</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Target for GEO content seeding</span>
                  <Link
                    href={`/tools/growth?category=Content%20Structure&task=${encodeURIComponent(cluster.clusterName)}`}
                  >
                    <button className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                      <span>Create Optimization Task</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Domain Details Slide-over Sheet */}
      <CitationDetailsSheet
        domainItem={selectedDomain}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />

      {/* Floating Bottom Action Bar for Bulk Citation Operations */}
      {selectedDomainNames.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 px-5 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
            <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold text-xs flex items-center justify-center font-mono">
              {selectedDomainNames.length}
            </span>
            <span className="text-xs font-medium text-slate-200">
              domains selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBatchExportDomains}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Export Selected (CSV)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDomainNames([])}
            className="text-xs text-slate-400 hover:text-white underline ml-2 cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
