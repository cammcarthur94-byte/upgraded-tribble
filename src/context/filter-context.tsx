"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { SupportedEngine, SearchIntent } from "@/lib/types";
import { useSearchParams } from "next/navigation";

export type DateRangeType = "7d" | "30d" | "90d" | "custom";

export const ALL_ENGINES: SupportedEngine[] = [
  "chatgpt",
  "claude",
  "gemini",
  "perplexity",
];

interface FilterContextType {
  dateRange: DateRangeType;
  dateRangeDays: number;
  customStartDate: string | null;
  customEndDate: string | null;
  setDateRange: (range: DateRangeType) => void;
  setCustomDateRange: (startDate: string, endDate: string) => void;
  selectedEngines: SupportedEngine[];
  toggleEngine: (engine: SupportedEngine) => void;
  selectAllEngines: () => void;
  clearEngines: () => void;
  searchIntent: SearchIntent | "all";
  setSearchIntent: (intent: SearchIntent | "all") => void;
  categoryFilter: string | "all";
  setCategoryFilter: (category: string | "all") => void;
  resetFilters: () => void;
  isEngineSelected: (engine: string) => boolean;
}

const defaultFilterContext: FilterContextType = {
  dateRange: "30d",
  dateRangeDays: 30,
  customStartDate: null,
  customEndDate: null,
  setDateRange: () => {},
  setCustomDateRange: () => {},
  selectedEngines: ALL_ENGINES,
  toggleEngine: () => {},
  selectAllEngines: () => {},
  clearEngines: () => {},
  searchIntent: "all",
  setSearchIntent: () => {},
  categoryFilter: "all",
  setCategoryFilter: () => {},
  resetFilters: () => {},
  isEngineSelected: () => true,
};

const FilterContext = createContext<FilterContextType>(defaultFilterContext);

function FilterStateConsumer({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();

  const [dateRange, setDateRangeState] = useState<DateRangeType>("30d");
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const [customEndDate, setCustomEndDate] = useState<string | null>(null);
  const [selectedEngines, setSelectedEnginesState] =
    useState<SupportedEngine[]>(ALL_ENGINES);
  const [searchIntent, setSearchIntentState] = useState<SearchIntent | "all">("all");
  const [categoryFilter, setCategoryFilterState] = useState<string | "all">("all");

  // Parse initial state from URL query params
  useEffect(() => {
    const rangeParam = searchParams.get("range");
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    if (rangeParam === "7d" || rangeParam === "30d" || rangeParam === "90d") {
      setDateRangeState(rangeParam);
    } else if (rangeParam === "custom" && fromParam && toParam) {
      setDateRangeState("custom");
      setCustomStartDate(fromParam);
      setCustomEndDate(toParam);
    }

    const enginesParam = searchParams.get("engines");
    if (enginesParam) {
      const parsed = enginesParam
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter((e): e is SupportedEngine =>
          ALL_ENGINES.includes(e as SupportedEngine)
        );
      if (parsed.length > 0) {
        setSelectedEnginesState(parsed);
      }
    }

    const intentParam = searchParams.get("intent");
    if (intentParam && ["Commercial", "Transactional", "Informational", "Navigational"].includes(intentParam)) {
      setSearchIntentState(intentParam as SearchIntent);
    }

    const catParam = searchParams.get("category");
    if (catParam) {
      setCategoryFilterState(catParam);
    }
  }, [searchParams]);

  // Sync state into URL params smoothly
  const syncToUrl = useCallback(
    (
      newRange: DateRangeType,
      newEngines: SupportedEngine[],
      customStart?: string | null,
      customEnd?: string | null,
      newIntent: SearchIntent | "all" = "all",
      newCategory: string | "all" = "all"
    ) => {
      if (typeof window !== "undefined") {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("range", newRange);

        if (newRange === "custom" && customStart && customEnd) {
          currentUrl.searchParams.set("from", customStart);
          currentUrl.searchParams.set("to", customEnd);
        } else {
          currentUrl.searchParams.delete("from");
          currentUrl.searchParams.delete("to");
        }

        if (newEngines.length === ALL_ENGINES.length) {
          currentUrl.searchParams.delete("engines");
        } else {
          currentUrl.searchParams.set("engines", newEngines.join(","));
        }

        if (newIntent !== "all") {
          currentUrl.searchParams.set("intent", newIntent);
        } else {
          currentUrl.searchParams.delete("intent");
        }

        if (newCategory !== "all") {
          currentUrl.searchParams.set("category", newCategory);
        } else {
          currentUrl.searchParams.delete("category");
        }

        window.history.replaceState(null, "", currentUrl.toString());
      }
    },
    []
  );

  const setDateRange = useCallback(
    (range: DateRangeType) => {
      setDateRangeState(range);
      syncToUrl(
        range,
        selectedEngines,
        range === "custom" ? customStartDate : null,
        range === "custom" ? customEndDate : null,
        searchIntent,
        categoryFilter
      );
    },
    [selectedEngines, customStartDate, customEndDate, searchIntent, categoryFilter, syncToUrl]
  );

  const setCustomDateRange = useCallback(
    (startDate: string, endDate: string) => {
      setCustomStartDate(startDate);
      setCustomEndDate(endDate);
      setDateRangeState("custom");
      syncToUrl("custom", selectedEngines, startDate, endDate, searchIntent, categoryFilter);
    },
    [selectedEngines, searchIntent, categoryFilter, syncToUrl]
  );

  const toggleEngine = useCallback(
    (engine: SupportedEngine) => {
      setSelectedEnginesState((prev) => {
        let next: SupportedEngine[];
        if (prev.includes(engine)) {
          if (prev.length === 1) return prev;
          next = prev.filter((e) => e !== engine);
        } else {
          next = [...prev, engine];
        }
        syncToUrl(dateRange, next, customStartDate, customEndDate, searchIntent, categoryFilter);
        return next;
      });
    },
    [dateRange, customStartDate, customEndDate, searchIntent, categoryFilter, syncToUrl]
  );

  const selectAllEngines = useCallback(() => {
    setSelectedEnginesState(ALL_ENGINES);
    syncToUrl(dateRange, ALL_ENGINES, customStartDate, customEndDate, searchIntent, categoryFilter);
  }, [dateRange, customStartDate, customEndDate, searchIntent, categoryFilter, syncToUrl]);

  const clearEngines = useCallback(() => {
    const fallback: SupportedEngine[] = ["chatgpt"];
    setSelectedEnginesState(fallback);
    syncToUrl(dateRange, fallback, customStartDate, customEndDate, searchIntent, categoryFilter);
  }, [dateRange, customStartDate, customEndDate, searchIntent, categoryFilter, syncToUrl]);

  const setSearchIntent = useCallback(
    (intent: SearchIntent | "all") => {
      setSearchIntentState(intent);
      syncToUrl(dateRange, selectedEngines, customStartDate, customEndDate, intent, categoryFilter);
    },
    [dateRange, selectedEngines, customStartDate, customEndDate, categoryFilter, syncToUrl]
  );

  const setCategoryFilter = useCallback(
    (category: string | "all") => {
      setCategoryFilterState(category);
      syncToUrl(dateRange, selectedEngines, customStartDate, customEndDate, searchIntent, category);
    },
    [dateRange, selectedEngines, customStartDate, customEndDate, searchIntent, syncToUrl]
  );

  const resetFilters = useCallback(() => {
    setDateRangeState("30d");
    setCustomStartDate(null);
    setCustomEndDate(null);
    setSelectedEnginesState(ALL_ENGINES);
    setSearchIntentState("all");
    setCategoryFilterState("all");
    syncToUrl("30d", ALL_ENGINES, null, null, "all", "all");
  }, [syncToUrl]);

  const isEngineSelected = useCallback(
    (engine: string) => {
      return selectedEngines.includes(engine.toLowerCase() as SupportedEngine);
    },
    [selectedEngines]
  );

  const dateRangeDays = useMemo(() => {
    if (dateRange === "7d") return 7;
    if (dateRange === "90d") return 90;
    if (dateRange === "custom" && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return Math.min(Math.max(diffDays, 1), 365);
      }
    }
    return 30;
  }, [dateRange, customStartDate, customEndDate]);

  return (
    <FilterContext.Provider
      value={{
        dateRange,
        dateRangeDays,
        customStartDate,
        customEndDate,
        setDateRange,
        setCustomDateRange,
        selectedEngines,
        toggleEngine,
        selectAllEngines,
        clearEngines,
        searchIntent,
        setSearchIntent,
        categoryFilter,
        setCategoryFilter,
        resetFilters,
        isEngineSelected,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function FilterProvider({ children }: { children: ReactNode }) {
  return (
    <React.Suspense fallback={<>{children}</>}>
      <FilterStateConsumer>{children}</FilterStateConsumer>
    </React.Suspense>
  );
}

export function useGlobalFilters() {
  const context = useContext(FilterContext);
  return context || defaultFilterContext;
}
