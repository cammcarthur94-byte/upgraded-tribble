"use client";

import React, { useState } from "react";
import {
  useGlobalFilters,
  DateRangeType,
  ALL_ENGINES,
} from "@/context/filter-context";
import { SupportedEngine } from "@/lib/types";
import { EngineFavicon } from "@/components/ui/favicon";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  Check,
  RotateCcw,
  Filter,
} from "lucide-react";

export function GlobalFilterBar() {
  const {
    dateRange,
    setDateRange,
    selectedEngines,
    toggleEngine,
    selectAllEngines,
    searchIntent,
    setSearchIntent,
    resetFilters,
  } = useGlobalFilters();

  const [isEngineDropdownOpen, setIsEngineDropdownOpen] = useState(false);
  const [isIntentDropdownOpen, setIsIntentDropdownOpen] = useState(false);

  const engineMeta: Record<SupportedEngine, { label: string }> = {
    chatgpt: { label: "ChatGPT" },
    claude: { label: "Claude" },
    gemini: { label: "Gemini" },
    perplexity: { label: "Perplexity" },
  };

  const intents = ["all", "Commercial", "Transactional", "Informational", "Navigational"] as const;

  const isAllEnginesSelected = selectedEngines.length === ALL_ENGINES.length;
  const hasCustomFilters =
    dateRange !== "30d" || !isAllEnginesSelected || searchIntent !== "all";

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5 mb-6 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Filter label & chips */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span className="uppercase tracking-wider text-[11px]">Filters:</span>
          </div>

          {/* Date Range Selector */}
          <DateRangePicker />

          {/* AI Engines Multi-Select Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsEngineDropdownOpen(!isEngineDropdownOpen);
                setIsIntentDropdownOpen(false);
              }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                !isAllEnginesSelected
                  ? "bg-indigo-50/80 text-indigo-900 border-indigo-200"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center -space-x-1">
                {selectedEngines.slice(0, 4).map((eng) => (
                  <div
                    key={eng}
                    className="w-4 h-4 rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center overflow-hidden shrink-0"
                  >
                    <EngineFavicon engine={eng} size={11} />
                  </div>
                ))}
              </div>
              <span>
                {isAllEnginesSelected
                  ? `All Engines (${ALL_ENGINES.length})`
                  : `${selectedEngines.length} Engine${
                      selectedEngines.length > 1 ? "s" : ""
                    }`}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isEngineDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isEngineDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsEngineDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                    <span>Target Engines</span>
                    <button
                      type="button"
                      onClick={() => selectAllEngines()}
                      className="text-[10px] text-indigo-600 font-semibold hover:underline"
                    >
                      Select All
                    </button>
                  </div>

                  <div className="p-1 space-y-0.5">
                    {ALL_ENGINES.map((engine) => {
                      const meta = engineMeta[engine];
                      const isChecked = selectedEngines.includes(engine);

                      return (
                        <button
                          key={engine}
                          type="button"
                          onClick={() => toggleEngine(engine)}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <EngineFavicon engine={engine} size={15} />
                            <span className="font-medium text-slate-800">
                              {meta.label}
                            </span>
                          </div>
                          {isChecked ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <span className="w-3.5 h-3.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Search Intent Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsIntentDropdownOpen(!isIntentDropdownOpen);
                setIsEngineDropdownOpen(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                searchIntent !== "all"
                  ? "bg-indigo-50/80 text-indigo-900 border-indigo-200"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="w-3 h-3 text-slate-400" />
              <span>{searchIntent === "all" ? "Intent: All" : `Intent: ${searchIntent}`}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isIntentDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isIntentDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsIntentDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Search Intent
                  </div>
                  <div className="p-1 space-y-0.5">
                    {intents.map((item) => {
                      const isSelected = searchIntent === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setSearchIntent(item);
                            setIsIntentDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors text-left ${
                            isSelected
                              ? "bg-indigo-50 font-semibold text-indigo-900"
                              : "text-slate-700 hover:bg-slate-50 font-medium"
                          }`}
                        >
                          <span>{item === "all" ? "All Intents" : item}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Reset or Active summary */}
        {hasCustomFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
