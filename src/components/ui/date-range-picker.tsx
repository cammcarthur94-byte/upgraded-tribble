"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  X,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useGlobalFilters, DateRangeType } from "@/context/filter-context";

export interface DateRangePickerProps {
  className?: string;
  showPresets?: boolean;
  compact?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DateRangePicker({
  className = "",
  showPresets = true,
  compact = false,
  onRefresh,
  isRefreshing = false,
}: DateRangePickerProps) {
  const {
    dateRange,
    dateRangeDays,
    customStartDate,
    customEndDate,
    setDateRange,
    setCustomDateRange,
  } = useGlobalFilters();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to format Date to YYYY-MM-DD
  const formatDateToYMD = (d: Date) => {
    return d.toISOString().split("T")[0];
  };

  // Helper to format Date nicely (e.g. "Aug 15")
  const formatDisplayDate = (ymdStr: string) => {
    try {
      const parts = ymdStr.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    } catch {}
    return ymdStr;
  };

  // Initial local draft dates
  const todayYMD = useMemo(() => formatDateToYMD(new Date()), []);
  const thirtyDaysAgoYMD = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return formatDateToYMD(d);
  }, []);

  const [draftStart, setDraftStart] = useState<string>(
    customStartDate || thirtyDaysAgoYMD
  );
  const [draftEnd, setDraftEnd] = useState<string>(
    customEndDate || todayYMD
  );

  // Keep local draft in sync when popover opens or custom dates change
  useEffect(() => {
    if (customStartDate && customEndDate) {
      setDraftStart(customStartDate);
      setDraftEnd(customEndDate);
    }
  }, [customStartDate, customEndDate, isOpen]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Compute draft duration in days
  const draftDurationDays = useMemo(() => {
    if (!draftStart || !draftEnd) return 0;
    const start = new Date(draftStart);
    const end = new Date(draftEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    if (start > end) return -1;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [draftStart, draftEnd]);

  const isDraftValid = draftDurationDays > 0 && draftDurationDays <= 365;

  const quickPresets = [
    {
      label: "Last 7 Days",
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6);
        return { start: formatDateToYMD(start), end: formatDateToYMD(end) };
      },
    },
    {
      label: "Last 14 Days",
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 13);
        return { start: formatDateToYMD(start), end: formatDateToYMD(end) };
      },
    },
    {
      label: "Last 30 Days",
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);
        return { start: formatDateToYMD(start), end: formatDateToYMD(end) };
      },
    },
    {
      label: "Last 60 Days",
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 59);
        return { start: formatDateToYMD(start), end: formatDateToYMD(end) };
      },
    },
    {
      label: "Last 90 Days",
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 89);
        return { start: formatDateToYMD(start), end: formatDateToYMD(end) };
      },
    },
    {
      label: "Month to Date",
      getRange: () => {
        const end = new Date();
        const start = new Date(end.getFullYear(), end.getMonth(), 1);
        return { start: formatDateToYMD(start), end: formatDateToYMD(end) };
      },
    },
    {
      label: "Year to Date",
      getRange: () => {
        const end = new Date();
        const start = new Date(end.getFullYear(), 0, 1);
        return { start: formatDateToYMD(start), end: formatDateToYMD(end) };
      },
    },
  ];

  const handleApplyCustom = () => {
    if (isDraftValid) {
      setCustomDateRange(draftStart, draftEnd);
      setIsOpen(false);
    }
  };

  const handlePresetSelect = (range: DateRangeType) => {
    setDateRange(range);
    setIsOpen(false);
  };

  // Label for the custom trigger button
  const customLabel = useMemo(() => {
    if (dateRange === "custom" && customStartDate && customEndDate) {
      return `${formatDisplayDate(customStartDate)} – ${formatDisplayDate(
        customEndDate
      )} (${dateRangeDays}d)`;
    }
    return "Custom";
  }, [dateRange, customStartDate, customEndDate, dateRangeDays]);

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      {/* Unified Toolbar Container */}
      <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100/90 border border-slate-200/80 text-xs shadow-2xs">
        {/* Preset Buttons */}
        {showPresets && (
          <>
            {[
              { label: "7 Days", value: "7d" as DateRangeType },
              { label: "30 Days", value: "30d" as DateRangeType },
              { label: "90 Days", value: "90d" as DateRangeType },
            ].map((opt) => {
              const isSelected = dateRange === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handlePresetSelect(opt.value)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all text-xs cursor-pointer ${
                    isSelected
                      ? "bg-white text-slate-900 shadow-2xs font-semibold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </>
        )}

        {/* Custom Range Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all text-xs cursor-pointer ${
            dateRange === "custom"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold shadow-2xs"
              : isOpen
              ? "bg-white text-slate-900 shadow-2xs font-semibold"
              : "text-slate-500 hover:text-slate-900"
          }`}
          title="Select custom date range"
        >
          <CalendarIcon
            className={`w-3.5 h-3.5 ${
              dateRange === "custom" ? "text-emerald-600" : "text-slate-400"
            }`}
          />
          <span className="whitespace-nowrap">{customLabel}</span>
          <ChevronDown
            className={`w-3 h-3 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Unified Refresh Action Button */}
        {onRefresh && (
          <>
            <span className="w-px h-3.5 bg-slate-200 mx-0.5" aria-hidden="true" />
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white transition-all cursor-pointer disabled:opacity-40"
              title="Refresh metrics"
              aria-label="Refresh metrics"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-slate-700" : ""}`}
              />
            </button>
          </>
        )}
      </div>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 z-50 w-[340px] sm:w-[460px] bg-white rounded-2xl border border-slate-200 shadow-xl p-4 sm:p-5 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Custom Date Range
                </h4>
                <p className="text-[11px] text-slate-500 font-normal">
                  Filter AI visibility intelligence by exact dates
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Quick Presets Shortcuts Column */}
            <div className="sm:col-span-1 space-y-1 sm:border-r sm:border-slate-100 sm:pr-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Quick Ranges
              </span>
              {quickPresets.map((preset) => {
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      const range = preset.getRange();
                      setDraftStart(range.start);
                      setDraftEnd(range.end);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition"
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Date Inputs & Preview Column */}
            <div className="sm:col-span-2 space-y-4">
              {/* Start Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={draftStart}
                  max={draftEnd || todayYMD}
                  onChange={(e) => setDraftStart(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition font-mono bg-slate-50/50"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={draftEnd}
                  min={draftStart}
                  max={todayYMD}
                  onChange={(e) => setDraftEnd(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition font-mono bg-slate-50/50"
                />
              </div>

              {/* Duration Status Feedback */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duration:</span>
                </div>
                <div>
                  {draftDurationDays > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {draftDurationDays} {draftDurationDays === 1 ? "day" : "days"}
                    </span>
                  ) : (
                    <span className="text-xs text-rose-500 font-medium">
                      Invalid range
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setDraftStart(thirtyDaysAgoYMD);
                setDraftEnd(todayYMD);
                setDateRange("30d");
                setIsOpen(false);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 transition"
            >
              Reset to 30D
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCustom}
                disabled={!isDraftValid}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Range</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;
