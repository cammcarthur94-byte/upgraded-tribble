"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Check,
  X as XIcon,
  Sparkles,
  Zap,
  Globe,
  Layers,
  Download,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Favicon } from "@/components/ui/favicon";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/context/plan-context";
import { BillingCycle, PlanId, PricingPlan, InvoiceItem } from "./types";

const REGION_NAMES: Record<string, string> = {
  US: "United States",
  UK: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
};

interface BillingPlansTabProps {
  billingCycle: BillingCycle;
  onBillingCycleChange: (cycle: BillingCycle) => void;
  activePlanId: PlanId;
  onSelectPlan: (plan: PricingPlan) => void;
  cardInfo: {
    brand: string;
    last4: string;
    expiry: string;
    billingEmail: string;
  };
  onOpenPaymentModal: () => void;
  onOpenAddRegionModal: () => void;
  onOpenAddWorkspaceModal: () => void;
  onOpenInvoiceModal: (invoice: InvoiceItem) => void;
  activeRegions: string[];
  extraPromptPacks: number;
  onTogglePromptPack: () => void;
  extraWorkspaces: number;
  onShowToast: (msg: string) => void;
}

export function BillingPlansTab({
  billingCycle,
  onBillingCycleChange,
  activePlanId,
  onSelectPlan,
  cardInfo,
  onOpenPaymentModal,
  onOpenAddRegionModal,
  onOpenAddWorkspaceModal,
  onOpenInvoiceModal,
  activeRegions,
  extraPromptPacks,
  onTogglePromptPack,
  extraWorkspaces,
  onShowToast,
}: BillingPlansTabProps) {
  const pricingGridRef = useRef<HTMLDivElement>(null);
  const [isHighlightingTiers, setIsHighlightingTiers] = useState(false);
  const [isBurstModeActive, setIsBurstModeActive] = useState(false);
  const [overageProtection, setOverageProtection] = useState(true);
  const [quotaAlert, setQuotaAlert] = useState(true);

  const scrollToPricing = () => {
    if (pricingGridRef.current) {
      pricingGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsHighlightingTiers(true);
      setTimeout(() => {
        setIsHighlightingTiers(false);
      }, 2500);
    }
  };

  const handleToggleBurstMode = () => {
    setIsBurstModeActive((prev) => {
      const next = !prev;
      onShowToast(
        next
          ? "Launch & Drop Hourly Monitoring enabled (+$149/mo). Burst mode active for high-priority product launches!"
          : "Hourly burst monitoring disabled."
      );
      return next;
    });
  };

  const handleToggleOverageProtection = () => {
    setOverageProtection((prev) => {
      const next = !prev;
      onShowToast(
        next
          ? "Overage Protection enabled: Auto-provisioning +25 prompt pack ($49) if monthly quota hits 100%."
          : "Overage Protection paused."
      );
      return next;
    });
  };

  const handleToggleQuotaAlert = () => {
    setQuotaAlert((prev) => {
      const next = !prev;
      onShowToast(
        next
          ? "Quota Threshold Alert enabled: Dispatches email & Slack alert when consumption exceeds 80%."
          : "Quota Threshold Alert paused."
      );
      return next;
    });
  };

  const isAnnual = billingCycle === "annual";

  // 4 Pricing Tiers
  const pricingPlans: PricingPlan[] = [
    {
      id: "starter",
      name: "Starter (Growth)",
      monthlyPrice: 99,
      annualPrice: 79,
      description: "Essential visibility tracking for emerging DTC brands and solo SEO leads.",
      isCurrent: activePlanId === "starter",
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
      isCurrent: activePlanId === "pro",
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
      isCurrent: activePlanId === "scale",
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
      isCurrent: activePlanId === "enterprise",
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

  // Invoices Seed Data
  const invoices: InvoiceItem[] = [
    {
      id: "inv-10",
      number: "INV-2026-010",
      date: "Oct 14, 2026",
      description: "Scale (Commerce) Plan — Monthly",
      amount: 699.0,
      status: "paid",
    },
    {
      id: "inv-9",
      number: "INV-2026-009",
      date: "Sep 14, 2026",
      description: "Scale (Commerce) Plan — Monthly",
      amount: 699.0,
      status: "paid",
    },
    {
      id: "inv-8",
      number: "INV-2026-008",
      date: "Aug 14, 2026",
      description: "Pro (Brand) Plan — Monthly",
      amount: 299.0,
      status: "paid",
    },
  ];

  const { limits, effectiveLimits } = usePlan();

  // Current plan details
  const activePlan = pricingPlans.find((p) => p.id === activePlanId) || pricingPlans[2];
  const activePlanPrice = isAnnual ? activePlan.annualPrice : activePlan.monthlyPrice;

  // Dynamic plan highlights
  const planHighlights: Record<PlanId, string[]> = {
    starter: [
      "2 AI Engines (ChatGPT & Perplexity)",
      "25 Tracked Prompts (Weekly Runs)",
      "Top 20 Referring Domains",
      "Up to 3 Competitors",
    ],
    pro: [
      "All 4 AI Engines (Daily & Weekly Runs)",
      "100 Tracked Prompts (25 Daily + 75 Weekly)",
      "AI Shopping Summary View (Top 10 Products)",
      "Full Task Tracker & AI Schema Generator",
    ],
    scale: [
      "All 4 AI Engines (100% Daily Execution)",
      "Full AI Shopping Suite (Unlimited SKUs)",
      "Verified Lift Tracking & Attribution",
      "Multi-Region Geo Tracking (2 Regions: US + UK)",
    ],
    enterprise: [
      "All AI Engines + Custom LLM Endpoint Testing",
      "1,000+ Real-Time & Hourly Prompts",
      "Unlimited Competitors & Global Geo Regions",
      "SSO / SAML & Dedicated GEO Strategist",
    ],
  };

  const currentHighlights = planHighlights[activePlanId] || planHighlights.scale;

  // Dynamic telemetry calculations
  const maxPrompts = effectiveLimits.maxPrompts;
  const promptsUsed = Math.min(25, maxPrompts);
  const promptsPercent = ((promptsUsed / maxPrompts) * 100).toFixed(1);
  const promptsRemaining = Math.max(0, maxPrompts - promptsUsed);
  const promptsScheduleText =
    activePlanId === "starter"
      ? "Scheduled: Weekly execution only"
      : activePlanId === "pro"
      ? "Scheduled: 25 Daily + 75 Weekly execution"
      : activePlanId === "enterprise"
      ? "Scheduled: Real-Time & Hourly execution"
      : "Scheduled: 100% Daily execution";

  const runsConfig = {
    starter: {
      used: 175,
      max: 500,
      pct: "35.0%",
      sub: "100 scheduled weekly runs + 75 discovery scans • Resets Nov 1, 2026",
      status: "Healthy pacing",
    },
    pro: {
      used: 1820,
      max: 6000,
      pct: "30.3%",
      sub: "700 scheduled daily/weekly runs + 1,120 discovery scans • Resets Nov 1, 2026",
      status: "Healthy pacing",
    },
    scale: {
      used: 3750,
      max: 36000,
      pct: "10.4%",
      sub: "1,400 scheduled daily runs + 2,350 on-demand & discovery scans • Resets Nov 1, 2026",
      status: "Healthy pacing",
    },
    enterprise: {
      used: 18400,
      max: 120000,
      pct: "15.3%",
      sub: "8,400 high-frequency runs + 10,000 burst scans • Resets Nov 1, 2026",
      status: "Enterprise burst",
    },
  }[activePlanId] || {
    used: 3750,
    max: 36000,
    pct: "10.4%",
    sub: "1,400 scheduled daily runs + 2,350 on-demand & discovery scans • Resets Nov 1, 2026",
    status: "Healthy pacing",
  };

  const maxCompetitors = limits.maxCompetitors;
  const competitorsUsed = 4;
  const isCompetitorsOverLimit = competitorsUsed > maxCompetitors;
  const compPercent = Math.min(100, Math.round((competitorsUsed / maxCompetitors) * 100));
  const compSlotsAvailable = Math.max(0, maxCompetitors - competitorsUsed);

  const maxWorkspaces = effectiveLimits.maxWorkspaces;
  const workspacesUsed = 1 + extraWorkspaces;
  const wsPercent = Math.min(100, Math.round((workspacesUsed / maxWorkspaces) * 100));
  const wsSlotsAvailable = Math.max(0, maxWorkspaces - workspacesUsed);

  return (
    <div className="space-y-8">
      {/* SECTION 1: Current Plan & Live Usage Telemetry (Top Row - 2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card — Current Subscription Summary */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-100/40 via-transparent to-transparent pointer-events-none rounded-tr-2xl" />

          <div>
            {/* Badge & Renewal Info */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 ring-1 ring-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                ACTIVE PLAN
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Renews Nov 1, 2026
              </span>
            </div>

            {/* Plan Title & Dynamic Price */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {activePlan.name.includes("Plan") ? activePlan.name : `${activePlan.name} Plan`}
              </h2>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  ${activePlanPrice}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / month {isAnnual ? "(Billed annually)" : "(Monthly billing)"}
                </span>
              </div>
            </div>

            {/* Payment Method & Billing Email */}
            <div className="mt-5 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <CreditCard className="w-4 h-4 text-slate-600" />
                  <span>
                    {cardInfo.brand} ending in {cardInfo.last4}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Exp {cardInfo.expiry}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Billing email: {cardInfo.billingEmail}</span>
                <button
                  onClick={onOpenPaymentModal}
                  className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline text-[11px]"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Included Highlights */}
            <div className="mt-5 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Included Plan Highlights
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {currentHighlights.map((hl, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
            <Button
              onClick={scrollToPricing}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-9 px-4 rounded-xl shadow-xs font-medium cursor-pointer"
            >
              Change Plan
            </Button>
            <button
              onClick={onOpenPaymentModal}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:underline px-2 py-1.5 cursor-pointer"
            >
              Update Payment Method
            </button>
          </div>
        </div>

        {/* Right Card — Monthly Quota & Credit Consumption (Progress Bars) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Monthly Quota & Credit Consumption
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live telemetry synchronized with current billing period (Oct 1 – Oct 30, 2026)
                </p>
              </div>
              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                Cycle: Day 14 of 30 (Oct 1 – Oct 30, 2026)
              </span>
            </div>

            {/* 4 Usage Meters */}
            <div className="space-y-4">
              {/* 1. Tracked Prompts */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">Tracked Prompts</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {promptsUsed} / {maxPrompts} Prompts Used
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold font-mono text-emerald-600">
                      {promptsPercent}%
                    </span>
                    <Link
                      href="/tools/prompts"
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-0.5"
                    >
                      + Add Prompts
                    </Link>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${promptsPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>
                    {promptsRemaining > 0
                      ? `${promptsRemaining} prompts remaining in active monthly tier`
                      : "0 prompts remaining — monthly tier quota full"}
                  </span>
                  <span className="text-slate-500">{promptsScheduleText}</span>
                </div>
              </div>

              {/* 2. Monthly Engine Executions (Runs) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      Monthly Engine Executions (Runs)
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {runsConfig.used.toLocaleString()} / {runsConfig.max.toLocaleString()} Runs
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold font-mono text-indigo-600">
                      {runsConfig.pct}
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.5 rounded">
                      {runsConfig.status}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: runsConfig.pct }}
                  />
                </div>
                <div className="text-[11px] text-slate-500">
                  {runsConfig.sub}
                </div>
              </div>

              {/* 3. Tracked Competitors */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">Tracked Competitors</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {competitorsUsed} / {maxCompetitors} Competitors
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold font-mono ${isCompetitorsOverLimit ? "text-rose-600" : "text-slate-700"}`}>
                      {compPercent}%
                    </span>
                    {isCompetitorsOverLimit && (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                        Over quota (max {maxCompetitors})
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isCompetitorsOverLimit ? "bg-rose-500" : "bg-slate-700"}`}
                    style={{ width: `${compPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/70 px-1.5 py-0.5 rounded">
                      <Favicon domain="nike.com" size={12} />
                      Nike
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/70 px-1.5 py-0.5 rounded">
                      <Favicon domain="lululemon.com" size={12} />
                      Lululemon
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/70 px-1.5 py-0.5 rounded">
                      <Favicon domain="aloyoga.com" size={12} />
                      Alo Yoga
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/70 px-1.5 py-0.5 rounded">
                      <Favicon domain="vuoriclothing.com" size={12} />
                      Vuori
                    </span>
                  </div>
                  <span className={isCompetitorsOverLimit ? "text-rose-600 font-medium" : "text-slate-400"}>
                    {isCompetitorsOverLimit
                      ? `Plan limit exceeded (${maxCompetitors} max)`
                      : `${compSlotsAvailable} slots available`}
                  </span>
                </div>
              </div>

              {/* 4. Brand Workspaces */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">Brand Workspaces</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {workspacesUsed} / {maxWorkspaces} Workspaces
                    </span>
                  </div>
                  <span className="text-xs font-semibold font-mono text-slate-700">
                    {wsPercent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${wsPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    gymshark.com (Primary)
                  </span>
                  {wsSlotsAvailable > 0 ? (
                    <button
                      onClick={onOpenAddWorkspaceModal}
                      className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium text-[11px] cursor-pointer"
                    >
                      + Provision Sister Brand ({wsSlotsAvailable} left)
                    </button>
                  ) : (
                    <span className="text-slate-400">
                      Tier limit reached ({maxWorkspaces} max)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Interactive 4-Tier Pricing Comparison Grid */}
      <div
        ref={pricingGridRef}
        className={`space-y-5 pt-2 transition-all duration-500 rounded-2xl ${
          isHighlightingTiers
            ? "ring-2 ring-indigo-500/80 bg-indigo-50/20 p-4 -m-4 shadow-lg shadow-indigo-500/10"
            : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Subscription Tiers
              </h2>
              {isHighlightingTiers && (
                <span className="animate-pulse inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Select a tier below
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the right plan to expand generative engine visibility, shopping shelf dominance, and brand intelligence.
            </p>
          </div>

          {/* Segmented Billing Toggle */}
          <div className="inline-flex items-center p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl self-start sm:self-auto shadow-2xs">
            <button
              onClick={() => onBillingCycleChange("monthly")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                !isAnnual
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => onBillingCycleChange("annual")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                isAnnual
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 4 Responsive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {pricingPlans.map((plan) => {
            const isCurrent = plan.id === activePlanId;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 flex flex-col justify-between transition-all relative ${
                  isCurrent
                    ? "ring-2 ring-emerald-500/80 bg-emerald-50/10 border-2 border-emerald-500/80 shadow-md shadow-emerald-500/5"
                    : plan.isPopular
                    ? "border border-indigo-200/90 bg-white shadow-xs hover:border-indigo-300"
                    : "border border-slate-200/80 bg-white shadow-xs hover:border-slate-300"
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between min-h-[24px] mb-2">
                  {isCurrent ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-600 text-white shadow-2xs">
                      CURRENT PLAN
                    </span>
                  ) : plan.badge ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {plan.badge}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400">
                      {plan.id === "enterprise" ? "Global Scale" : "Entry Level"}
                    </span>
                  )}

                  {isAnnual && plan.id !== "enterprise" && (
                    <span className="text-[10px] text-slate-400 line-through font-mono">
                      ${plan.monthlyPrice}/mo
                    </span>
                  )}
                </div>

                {/* Plan Title & Price */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {plan.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    {plan.id === "enterprise" ? (
                      <div>
                        <span className="text-2xl font-extrabold text-slate-900">Custom</span>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          Starting at $1,500 / mo
                        </p>
                      </div>
                    ) : (
                      <>
                        <span className="text-2xl font-extrabold text-slate-900 font-mono">
                          ${price}
                        </span>
                        <span className="text-xs text-slate-500">/ mo</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 min-h-[34px] leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Quotas & Features */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex-1 space-y-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Plan Specifications & Quotas
                  </div>
                  <ul className="space-y-2 text-xs">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2 ${
                          feature.included
                            ? "text-slate-700"
                            : "text-slate-400 line-through"
                        }`}
                      >
                        {feature.included ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XIcon className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-tight">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  {isCurrent ? (
                    <Button
                      disabled
                      className="w-full h-9 rounded-xl text-xs font-semibold bg-emerald-600 text-white cursor-default opacity-100 shadow-2xs"
                    >
                      Active Plan ✓
                    </Button>
                  ) : plan.id === "enterprise" ? (
                    <Button
                      onClick={() => onSelectPlan(plan)}
                      className="w-full h-9 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                    >
                      Contact Enterprise Sales -&gt;
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => onSelectPlan(plan)}
                      className="w-full h-9 rounded-xl text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-800 hover:border-slate-300 shadow-2xs"
                    >
                      {plan.ctaText}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Modular Power-Up Add-Ons (Self-Serve Expansion) */}
      <div className="space-y-4 pt-2">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Modular Power-Up Add-Ons
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Self-serve quota expansion packs for scaling brand requirements without switching tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Add-on 1: Extra Daily Prompt Pack */}
          <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
                  <Zap className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-slate-900 font-mono">
                  +$49 / mo
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-3">
                Extra Daily Prompt Pack
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                +25 Daily Tracked Prompts across all 4 engines (3,000 extra monthly runs).
              </p>
              {extraPromptPacks > 0 && (
                <div className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                  {extraPromptPacks} Active Pack (+{extraPromptPacks * 25} prompts)
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Instant quota sync</span>
              <Button
                variant="outline"
                size="sm"
                onClick={onTogglePromptPack}
                className={`h-8 text-xs font-semibold rounded-lg transition-all shadow-2xs cursor-pointer ${
                  extraPromptPacks > 0
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    : "border-slate-200 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-800"
                }`}
              >
                {extraPromptPacks > 0 ? "Manage Pack (+25)" : "+ Add Pack"}
              </Button>
            </div>
          </div>

          {/* Add-on 2: Global Geo-Location Pack */}
          <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
                  <Globe className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-slate-900 font-mono">
                  +$99 / mo per region
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-3">
                Global Geo-Location Pack
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Track regional LLM answers & shopping carousels in the UK, Canada, Australia, Germany, or France.
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                {activeRegions.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100/90 border border-slate-200/80 text-xs text-slate-800 font-medium shadow-2xs"
                  >
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 leading-none">
                      {r}
                    </span>
                    <span>{REGION_NAMES[r] || r}</span>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={onOpenAddRegionModal}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-dashed border-slate-300 text-xs text-indigo-600 hover:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors font-medium cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Region</span>
                </button>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {activeRegions.length} regions active
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenAddRegionModal}
                className="h-8 text-xs font-semibold rounded-lg border-slate-200 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-800 transition-all shadow-2xs cursor-pointer"
              >
                + Add Region
              </Button>
            </div>
          </div>

          {/* Add-on 3: Launch & Drop Hourly Monitoring */}
          <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600">
                  <Clock className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-slate-900 font-mono">
                  +$149 / mo
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-3">
                Launch & Drop Hourly Monitoring
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Upgrade selected high-priority prompts from Daily to Hourly execution during major product launches or seasonal sales.
              </p>
              <div className="mt-2.5 text-[11px] font-medium">
                {isBurstModeActive ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Active: 24× Hourly Burst Tracking
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Ideal for Black Friday, product drops & press releases
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">On-demand burst mode</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleBurstMode}
                className={`h-8 text-xs font-semibold rounded-lg transition-all shadow-2xs cursor-pointer ${
                  isBurstModeActive
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    : "border-slate-200 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-800"
                }`}
              >
                {isBurstModeActive ? "Burst Mode Active ✓" : "+ Enable Burst Mode"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Spend Guardrails & Overage Protection Bar */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 shadow-2xs">
        {/* Toggle 1: Overage Protection */}
        <div className="flex items-center justify-between sm:justify-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-slate-900">
                Overage Protection
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                  overageProtection
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {overageProtection ? "Active" : "Paused"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Auto-provision +25 Prompt Pack ($49) if monthly run quota hits 100% so tracking never pauses.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={overageProtection}
            onClick={handleToggleOverageProtection}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer ${
              overageProtection ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                overageProtection ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="hidden md:block w-px h-10 bg-slate-200/80" />

        {/* Toggle 2: Quota Threshold Alert */}
        <div className="flex items-center justify-between sm:justify-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-slate-900">
                Quota Threshold Alert
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                  quotaAlert
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {quotaAlert ? "Active" : "Paused"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Send email & Slack alert when monthly credit consumption exceeds 80%.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={quotaAlert}
            onClick={handleToggleQuotaAlert}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer ${
              quotaAlert ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                quotaAlert ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* SECTION 4: Billing History & Invoices Table */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Billing History & Invoices
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Download tax invoices and official Stripe receipts for accounting & expense reports.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
            Auto-billed to Visa •••• 4242
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                    {inv.date}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {inv.number}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {inv.description}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                    ${inv.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Paid
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onOpenInvoiceModal(inv)}
                      className="h-8 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50 gap-1 font-medium"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
