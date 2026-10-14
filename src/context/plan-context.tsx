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
import { SupportedEngine } from "@/lib/types";
import { PlanId, PricingPlan, BillingCycle } from "@/components/settings/types";

export interface PlanLimits {
  maxWorkspaces: number;
  maxTeamSeats: number;
  maxPrompts: number;
  maxCompetitors: number;
  maxReferringDomains: number; // 20 for starter, Infinity for pro/scale/enterprise
  maxRetentionDays: number; // 30 for starter, 90 for pro, 365 for scale, Infinity for enterprise
  allowedEngines: SupportedEngine[]; // starter: ['chatgpt', 'perplexity']
  allowedFrequencies: ("hourly" | "daily" | "weekly")[];
  hasAiShopping: boolean; // starter: false, pro: true (summary top 10), scale: true (full suite)
  hasFullAiShoppingSuite: boolean; // starter: false, pro: false, scale: true
  hasSchemaGenerator: boolean; // starter: false, pro: true, scale: true
  hasTrafficAttribution: boolean; // starter: false, pro: false, scale: true
  hasCsvExport: boolean; // starter: false, pro: true, scale: true
  hasPriorityApi: boolean; // starter: false, pro: false, scale: true
  includedRegions: string[]; // baseline regions without extra add-on
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  starter: {
    maxWorkspaces: 1,
    maxTeamSeats: 1,
    maxPrompts: 25,
    maxCompetitors: 3,
    maxReferringDomains: 20,
    maxRetentionDays: 30,
    allowedEngines: ["chatgpt", "perplexity"],
    allowedFrequencies: ["weekly"],
    hasAiShopping: false,
    hasFullAiShoppingSuite: false,
    hasSchemaGenerator: false,
    hasTrafficAttribution: false,
    hasCsvExport: false,
    hasPriorityApi: false,
    includedRegions: ["US"],
  },
  pro: {
    maxWorkspaces: 1,
    maxTeamSeats: 3,
    maxPrompts: 100,
    maxCompetitors: 5,
    maxReferringDomains: Infinity,
    maxRetentionDays: 90,
    allowedEngines: ["chatgpt", "perplexity", "gemini", "claude"],
    allowedFrequencies: ["daily", "weekly"],
    hasAiShopping: true,
    hasFullAiShoppingSuite: false,
    hasSchemaGenerator: true,
    hasTrafficAttribution: false,
    hasCsvExport: true,
    hasPriorityApi: false,
    includedRegions: ["US"],
  },
  scale: {
    maxWorkspaces: 3,
    maxTeamSeats: 10,
    maxPrompts: 300,
    maxCompetitors: 10,
    maxReferringDomains: Infinity,
    maxRetentionDays: 365,
    allowedEngines: ["chatgpt", "perplexity", "gemini", "claude"],
    allowedFrequencies: ["daily", "weekly"],
    hasAiShopping: true,
    hasFullAiShoppingSuite: true,
    hasSchemaGenerator: true,
    hasTrafficAttribution: true,
    hasCsvExport: true,
    hasPriorityApi: true,
    includedRegions: ["US", "UK"],
  },
  enterprise: {
    maxWorkspaces: 100,
    maxTeamSeats: 100,
    maxPrompts: 1000,
    maxCompetitors: 100,
    maxReferringDomains: Infinity,
    maxRetentionDays: Infinity,
    allowedEngines: ["chatgpt", "perplexity", "gemini", "claude"],
    allowedFrequencies: ["hourly", "daily", "weekly"],
    hasAiShopping: true,
    hasFullAiShoppingSuite: true,
    hasSchemaGenerator: true,
    hasTrafficAttribution: true,
    hasCsvExport: true,
    hasPriorityApi: true,
    includedRegions: ["US", "UK", "CA", "AU", "DE", "FR"],
  },
};

export const PRICING_PLANS_DATA: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter (Growth)",
    monthlyPrice: 99,
    annualPrice: 79,
    description: "Essential visibility tracking for emerging DTC brands and solo SEO leads.",
    quotas: {
      workspaces: "1 Brand Workspace",
      prompts: "25 Tracked Prompts (Weekly Runs)",
      engines: "2 AI Engines (ChatGPT & Perplexity)",
      competitors: "Up to 3 Competitors",
      referringDomains: "Top 20 Referring Domains",
      dataRetention: "30-Day Data Retention",
    },
    features: [
      { text: "1 Brand Workspace", included: true },
      { text: "25 Tracked Prompts (Weekly Runs)", included: true },
      { text: "2 AI Engines (ChatGPT & Perplexity)", included: true },
      { text: "Up to 3 Competitors", included: true },
      { text: "Top 20 Referring Domains", included: true },
      { text: "30-Day Data Retention", included: true },
      { text: "AI Shopping Carousel Suite", included: false },
      { text: "Automated Playbook & Schema Generator", included: false },
    ],
    ctaText: "Downgrade to Starter",
    ctaVariant: "outline",
  },
  {
    id: "pro",
    name: "Pro (Brand)",
    badge: "MOST POPULAR",
    isPopular: true,
    monthlyPrice: 299,
    annualPrice: 249,
    description: "Full multi-engine intelligence and automated optimization playbooks for growing brands.",
    quotas: {
      workspaces: "1 Brand Workspace (3 Team Seats)",
      prompts: "100 Tracked Prompts (25 Daily + 75 Weekly)",
      engines: "All 4 AI Engines (Perplexity, ChatGPT, Gemini, Claude)",
      competitors: "Up to 5 Competitors",
      referringDomains: "Full Domain Explorer + Competitor Citation Gaps",
      dataRetention: "90-Day Data Retention + CSV Exports",
    },
    features: [
      { text: "1 Brand Workspace (3 Team Seats)", included: true },
      { text: "100 Tracked Prompts (25 Daily + 75 Weekly)", included: true },
      { text: "All 4 AI Engines (Perplexity, ChatGPT, Gemini, Claude)", included: true },
      { text: "Up to 5 Competitors", included: true },
      { text: "Full Domain Explorer + Competitor Citation Gaps", included: true },
      { text: "AI Shopping Summary View (Top 10 Products)", included: true },
      { text: "Full Growth Task Tracker + AI Schema/FAQ Generator", included: true },
      { text: "90-Day Data Retention + CSV Exports", included: true },
    ],
    ctaText: "Switch to Pro",
    ctaVariant: "outline",
  },
  {
    id: "scale",
    name: "Scale (Commerce)",
    badge: "CURRENT PLAN",
    monthlyPrice: 699,
    annualPrice: 579,
    description: "Complete AI shopping shelf dominance, daily volatility tracking, and revenue attribution.",
    quotas: {
      workspaces: "Up to 3 Brand Workspaces (10 Team Seats)",
      prompts: "300 Tracked Prompts (100% Daily Execution)",
      engines: "All 4 AI Engines + Multi-Region Geo Tracking (2 Regions)",
      competitors: "Up to 10 Competitors",
      referringDomains: "GA4 & Shopify AI Traffic Attribution",
      dataRetention: "12-Month Retention + Priority API Access",
    },
    features: [
      { text: "Up to 3 Brand Workspaces (10 Team Seats)", included: true },
      { text: "300 Tracked Prompts (100% Daily Execution)", included: true },
      { text: "All 4 AI Engines + Multi-Region Geo Tracking (2 Regions)", included: true },
      { text: "Up to 10 Competitors", included: true },
      { text: "Full AI Shopping Suite (Unlimited SKU & Carousel Tracking)", included: true },
      { text: "Verified Live Lift Tracking & PR Outreach Templates", included: true },
      { text: "GA4 & Shopify AI Traffic Attribution", included: true },
      { text: "12-Month Retention + Priority API Access", included: true },
    ],
    ctaText: "Active Plan ✓",
    ctaVariant: "active",
  },
  {
    id: "enterprise",
    name: "Enterprise / Agency",
    monthlyPrice: 1500,
    annualPrice: 1200,
    description: "Tailored for global retail portfolios and agencies managing multi-client GEO at scale.",
    quotas: {
      workspaces: "10+ Brand Workspaces + White-Label Reporting",
      prompts: "1,000+ Custom Prompts (Real-Time / Hourly Runs)",
      engines: "All Engines + Custom LLM Endpoint Testing",
      competitors: "Unlimited Competitors & Global Geo Regions",
      referringDomains: "Full Merchant Feed Sync & Snowflake/BigQuery Export",
      dataRetention: "Unlimited Retention + Dedicated GEO Strategist",
    },
    features: [
      { text: "10+ Brand Workspaces + White-Label Reporting", included: true },
      { text: "1,000+ Custom Prompts (Real-Time / Hourly Runs)", included: true },
      { text: "All Engines + Custom LLM Endpoint Testing", included: true },
      { text: "Unlimited Competitors & Global Geo Regions", included: true },
      { text: "Full Merchant Feed Sync & Snowflake/BigQuery Export", included: true },
      { text: "SSO / SAML & Dedicated GEO Strategist", included: true },
    ],
    ctaText: "Contact Enterprise Sales ->",
    ctaVariant: "dark",
  },
];

interface PlanContextType {
  activePlanId: PlanId;
  setActivePlanId: (planId: PlanId) => void;
  activePlan: PricingPlan;
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;
  limits: PlanLimits;
  effectiveLimits: PlanLimits;
  extraPromptPacks: number;
  setExtraPromptPacks: React.Dispatch<React.SetStateAction<number>>;
  extraWorkspaces: number;
  setExtraWorkspaces: React.Dispatch<React.SetStateAction<number>>;
  activeRegions: string[];
  setActiveRegions: React.Dispatch<React.SetStateAction<string[]>>;
  isBurstModeActive: boolean;
  setIsBurstModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  overageProtection: boolean;
  setOverageProtection: React.Dispatch<React.SetStateAction<boolean>>;
  quotaAlert: boolean;
  setQuotaAlert: React.Dispatch<React.SetStateAction<boolean>>;
  isEngineAllowed: (engine: SupportedEngine | string) => boolean;
  isFrequencyAllowed: (frequency: "hourly" | "daily" | "weekly" | string) => boolean;
  isDateRangeAllowed: (days: number) => boolean;
  canAddPrompt: (currentCount: number) => boolean;
  canAddCompetitor: (currentCount: number) => boolean;
  canAddWorkspace: (currentCount: number) => boolean;
  canInviteMember: (currentCount: number) => boolean;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "recomnd_active_plan";
const LOCAL_STORAGE_CYCLE_KEY = "recomnd_billing_cycle";
const LOCAL_STORAGE_PROMPT_PACKS = "recomnd_extra_prompt_packs";
const LOCAL_STORAGE_WORKSPACES = "recomnd_extra_workspaces";
const LOCAL_STORAGE_REGIONS = "recomnd_active_regions";

export function PlanProvider({ children }: { children: ReactNode }) {
  const [activePlanId, setActivePlanIdState] = useState<PlanId>("scale");
  const [billingCycle, setBillingCycleState] = useState<BillingCycle>("monthly");
  const [extraPromptPacks, setExtraPromptPacks] = useState<number>(0);
  const [extraWorkspaces, setExtraWorkspaces] = useState<number>(0);
  const [activeRegions, setActiveRegions] = useState<string[]>(["US", "UK"]);
  const [isBurstModeActive, setIsBurstModeActive] = useState<boolean>(false);
  const [overageProtection, setOverageProtection] = useState<boolean>(true);
  const [quotaAlert, setQuotaAlert] = useState<boolean>(true);

  // Restore saved plan & preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem(LOCAL_STORAGE_KEY) as PlanId | null;
      if (savedPlan && ["starter", "pro", "scale", "enterprise"].includes(savedPlan)) {
        setActivePlanIdState(savedPlan);
      }

      const savedCycle = localStorage.getItem(LOCAL_STORAGE_CYCLE_KEY) as BillingCycle | null;
      if (savedCycle && (savedCycle === "monthly" || savedCycle === "annual")) {
        setBillingCycleState(savedCycle);
      }

      const savedPacks = localStorage.getItem(LOCAL_STORAGE_PROMPT_PACKS);
      if (savedPacks !== null) {
        setExtraPromptPacks(parseInt(savedPacks, 10) || 0);
      }

      const savedWs = localStorage.getItem(LOCAL_STORAGE_WORKSPACES);
      if (savedWs !== null) {
        setExtraWorkspaces(parseInt(savedWs, 10) || 0);
      }

      const savedRegions = localStorage.getItem(LOCAL_STORAGE_REGIONS);
      if (savedRegions) {
        const parsed = JSON.parse(savedRegions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActiveRegions(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load plan settings from localStorage:", e);
    }
  }, []);

  const setActivePlanId = useCallback((planId: PlanId) => {
    setActivePlanIdState(planId);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, planId);
    } catch (e) {}

    // Adjust baseline regions if necessary
    if (planId === "starter" || planId === "pro") {
      setActiveRegions((prev) => (prev.includes("US") ? ["US"] : ["US"]));
    } else if (planId === "scale") {
      setActiveRegions((prev) => Array.from(new Set([...prev, "US", "UK"])));
    }
  }, []);

  const setBillingCycle = useCallback((cycle: BillingCycle) => {
    setBillingCycleState(cycle);
    try {
      localStorage.setItem(LOCAL_STORAGE_CYCLE_KEY, cycle);
    } catch (e) {}
  }, []);

  // Update localStorage when add-ons change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROMPT_PACKS, String(extraPromptPacks));
    } catch (e) {}
  }, [extraPromptPacks]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WORKSPACES, String(extraWorkspaces));
    } catch (e) {}
  }, [extraWorkspaces]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_REGIONS, JSON.stringify(activeRegions));
    } catch (e) {}
  }, [activeRegions]);

  const baseLimits = useMemo(() => PLAN_LIMITS[activePlanId] || PLAN_LIMITS.scale, [activePlanId]);

  // Effective limits include power-up add-ons
  const effectiveLimits = useMemo<PlanLimits>(() => {
    return {
      ...baseLimits,
      maxPrompts: baseLimits.maxPrompts + extraPromptPacks * 25,
      maxWorkspaces: baseLimits.maxWorkspaces + extraWorkspaces,
      allowedFrequencies: isBurstModeActive
        ? Array.from(new Set([...baseLimits.allowedFrequencies, "hourly" as const]))
        : baseLimits.allowedFrequencies,
    };
  }, [baseLimits, extraPromptPacks, extraWorkspaces, isBurstModeActive]);

  const activePlan = useMemo(() => {
    const p = PRICING_PLANS_DATA.find((plan) => plan.id === activePlanId) || PRICING_PLANS_DATA[2];
    return {
      ...p,
      isCurrent: true,
    };
  }, [activePlanId]);

  const isEngineAllowed = useCallback(
    (engine: SupportedEngine | string): boolean => {
      const normalized = engine.toLowerCase() as SupportedEngine;
      return baseLimits.allowedEngines.includes(normalized);
    },
    [baseLimits.allowedEngines]
  );

  const isFrequencyAllowed = useCallback(
    (frequency: "hourly" | "daily" | "weekly" | string): boolean => {
      const normalized = frequency.toLowerCase() as "hourly" | "daily" | "weekly";
      return effectiveLimits.allowedFrequencies.includes(normalized);
    },
    [effectiveLimits.allowedFrequencies]
  );

  const isDateRangeAllowed = useCallback(
    (days: number): boolean => {
      return days <= baseLimits.maxRetentionDays;
    },
    [baseLimits.maxRetentionDays]
  );

  const canAddPrompt = useCallback(
    (currentCount: number): boolean => {
      return currentCount < effectiveLimits.maxPrompts;
    },
    [effectiveLimits.maxPrompts]
  );

  const canAddCompetitor = useCallback(
    (currentCount: number): boolean => {
      return currentCount < baseLimits.maxCompetitors;
    },
    [baseLimits.maxCompetitors]
  );

  const canAddWorkspace = useCallback(
    (currentCount: number): boolean => {
      return currentCount < effectiveLimits.maxWorkspaces;
    },
    [effectiveLimits.maxWorkspaces]
  );

  const canInviteMember = useCallback(
    (currentCount: number): boolean => {
      return currentCount < baseLimits.maxTeamSeats;
    },
    [baseLimits.maxTeamSeats]
  );

  return (
    <PlanContext.Provider
      value={{
        activePlanId,
        setActivePlanId,
        activePlan,
        billingCycle,
        setBillingCycle,
        limits: baseLimits,
        effectiveLimits,
        extraPromptPacks,
        setExtraPromptPacks,
        extraWorkspaces,
        setExtraWorkspaces,
        activeRegions,
        setActiveRegions,
        isBurstModeActive,
        setIsBurstModeActive,
        overageProtection,
        setOverageProtection,
        quotaAlert,
        setQuotaAlert,
        isEngineAllowed,
        isFrequencyAllowed,
        isDateRangeAllowed,
        canAddPrompt,
        canAddCompetitor,
        canAddWorkspace,
        canInviteMember,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
