"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Layers,
  Filter,
  ChevronDown,
  Search,
} from "lucide-react";

export type ShoppingTabType = "brands" | "products" | "prompts";

interface ShoppingSubnavTabsProps {
  activeTab: ShoppingTabType;
  onTabChange: (tab: ShoppingTabType) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  timeframeDays: number;
  onTimeframeChange: (days: number) => void;
  shoppingOnly: boolean;
  onShoppingOnlyToggle: () => void;
  selectedPlatform: string;
  onPlatformChange: (p: string) => void;
  onShowToast?: (msg: string) => void;
}

export function ShoppingSubnavTabs({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  timeframeDays,
  onTimeframeChange,
  shoppingOnly,
  onShoppingOnlyToggle,
  selectedPlatform,
  onPlatformChange,
  onShowToast,
}: ShoppingSubnavTabsProps) {
  const [dateOpen, setDateOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);

  const dateRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setDateOpen(false);
      }
      if (platformRef.current && !platformRef.current.contains(event.target as Node)) {
        setPlatformOpen(false);
      }
    }
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const tabs: Array<{ id: ShoppingTabType; label: string }> = [
    { id: "brands", label: "Brands & Merchants" },
    { id: "products", label: "Products" },
    { id: "prompts", label: "Prompts" },
  ];

  const dateLabels: Record<number, string> = {
    7: "Last 7 days",
    30: "Last 30 days",
    90: "Quarter to Date",
  };

  const platformLabels: Record<string, string> = {
    all: "All platforms",
    chatgpt: "ChatGPT & Search",
    gemini: "Google Gemini",
    perplexity: "Perplexity",
  };

  const handleSelectDate = (days: number) => {
    onTimeframeChange(days);
    setDateOpen(false);
    onShowToast?.(`Updated scope to: ${dateLabels[days] || `Last ${days} days`}`);
  };

  const handleSelectPlatform = (p: string) => {
    onPlatformChange(p);
    setPlatformOpen(false);
    onShowToast?.(`Updated scope to: ${platformLabels[p] || p}`);
  };

  return (
    <div className="space-y-6">
      {/* Primary Sub-Navigation Tabs & Search */}
      <div className="border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <nav className="flex gap-6 text-sm" id="navTabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  onShowToast?.(`Switched view to ${tab.label}`);
                }}
                className={`pb-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? "border-slate-900 font-semibold text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800 font-medium"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {onSearchChange && (
          <div className="pb-2.5 sm:pb-2">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                id="searchInput"
                value={searchQuery || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products, merchants, prompts..."
                className="w-full pl-8.5 pr-12 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs transition-all"
              />
              <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
                  ⌘K
                </kbd>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Scope Toolbar Bar - Sticky on Scroll */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider pr-2 border-r border-slate-200">
            <Filter className="w-3.5 h-3.5" />
            <span>Scope:</span>
          </div>

          {/* Date Dropdown */}
          <div className="relative" ref={dateRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPlatformOpen(false);
                setDateOpen((prev) => !prev);
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{dateLabels[timeframeDays] || "Last 7 days"}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {dateOpen && (
              <div className="absolute left-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs animate-in fade-in">
                <button
                  type="button"
                  onClick={() => handleSelectDate(7)}
                  className={`w-full text-left block px-3 py-2 hover:bg-slate-50 transition-colors ${
                    timeframeDays === 7 ? "text-slate-900 font-semibold bg-slate-50/50" : "text-slate-700"
                  }`}
                >
                  Last 7 days
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDate(30)}
                  className={`w-full text-left block px-3 py-2 hover:bg-slate-50 transition-colors ${
                    timeframeDays === 30 ? "text-slate-900 font-semibold bg-slate-50/50" : "text-slate-700"
                  }`}
                >
                  Last 30 days
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDate(90)}
                  className={`w-full text-left block px-3 py-2 hover:bg-slate-50 transition-colors ${
                    timeframeDays === 90 ? "text-slate-900 font-semibold bg-slate-50/50" : "text-slate-700"
                  }`}
                >
                  Quarter to Date
                </button>
              </div>
            )}
          </div>

          {/* Platform Dropdown */}
          <div className="relative" ref={platformRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDateOpen(false);
                setPlatformOpen((prev) => !prev);
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>{platformLabels[selectedPlatform] || "All platforms"}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {platformOpen && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs animate-in fade-in">
                <button
                  type="button"
                  onClick={() => handleSelectPlatform("all")}
                  className={`w-full text-left block px-3 py-2 hover:bg-slate-50 transition-colors ${
                    selectedPlatform === "all" ? "text-slate-900 font-semibold bg-slate-50/50" : "text-slate-700"
                  }`}
                >
                  All platforms
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPlatform("chatgpt")}
                  className={`w-full text-left block px-3 py-2 hover:bg-slate-50 transition-colors ${
                    selectedPlatform === "chatgpt" ? "text-slate-900 font-semibold bg-slate-50/50" : "text-slate-700"
                  }`}
                >
                  ChatGPT & Search
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPlatform("gemini")}
                  className={`w-full text-left block px-3 py-2 hover:bg-slate-50 transition-colors ${
                    selectedPlatform === "gemini" ? "text-slate-900 font-semibold bg-slate-50/50" : "text-slate-700"
                  }`}
                >
                  Google Gemini
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPlatform("perplexity")}
                  className={`w-full text-left block px-3 py-2 hover:bg-slate-50 transition-colors ${
                    selectedPlatform === "perplexity" ? "text-slate-900 font-semibold bg-slate-50/50" : "text-slate-700"
                  }`}
                >
                  Perplexity
                </button>
              </div>
            )}
          </div>

          {/* Shopping Toggle */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={shoppingOnly}
                onChange={() => {
                  onShoppingOnlyToggle();
                  onShowToast?.(
                    !shoppingOnly
                      ? "Shopping results filter enabled"
                      : "Showing all results"
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
            <span className="text-xs font-medium text-slate-700">
              Shopping results only
            </span>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs font-medium text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Commercial Feed</span>
          <span className="text-emerald-500/80 text-[10px]">• Real-time</span>
        </div>
      </div>
    </div>
  );
}
