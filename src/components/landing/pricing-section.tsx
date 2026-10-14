"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Zap,
  Globe,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  HelpCircle,
  Calculator,
  Sliders,
} from "lucide-react";
import { EngineFavicon } from "@/components/ui/favicon";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const isAnnual = billingCycle === "annual";

  // Interactive ROI Calculator State
  const [trackedPrompts, setTrackedPrompts] = useState(100);
  const [selectedEnginesCount, setSelectedEnginesCount] = useState(4);

  // Derivations for calculator
  const monthlyRuns = trackedPrompts * 30 * selectedEnginesCount;
  const recommendedTier =
    trackedPrompts <= 25 && selectedEnginesCount <= 2
      ? "starter"
      : trackedPrompts <= 100
      ? "pro"
      : trackedPrompts <= 300
      ? "scale"
      : "enterprise";

  const pricingPlans = [
    {
      id: "starter",
      name: "Starter (Growth)",
      badge: "ENTRY LEVEL",
      monthlyPrice: 99,
      annualPrice: 79,
      description: "Essential visibility tracking for emerging DTC brands and solo SEO leads.",
      highlight: false,
      isCurrent: false,
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
      ctaText: "Start with Starter",
      ctaHref: "/dashboard",
    },
    {
      id: "pro",
      name: "Pro (Brand)",
      badge: "MOST POPULAR",
      monthlyPrice: 299,
      annualPrice: 249,
      description: "Full multi-engine intelligence and automated optimization playbooks for growing brands.",
      highlight: false,
      isCurrent: false,
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
      ctaText: "Start 7-Day Free Trial",
      ctaHref: "/dashboard",
    },
    {
      id: "scale",
      name: "Scale (Commerce)",
      badge: "RECOMMENDED FOR DTC",
      monthlyPrice: 699,
      annualPrice: 579,
      description: "Complete AI shopping shelf dominance, daily volatility tracking, and revenue attribution.",
      highlight: true,
      isCurrent: false,
      features: [
        { text: "Up to 3 Brand Workspaces (10 Team Seats)", included: true },
        { text: "300 Tracked Prompts (100% Daily Execution)", included: true },
        { text: "All 4 AI Engines + Multi-Region Geo ([US] + [UK])", included: true },
        { text: "Up to 10 Competitors", included: true },
        { text: "Full AI Shopping Suite (Unlimited SKU & Carousel Tracking)", included: true },
        { text: "Verified Live Lift Tracking & PR Outreach Templates", included: true },
        { text: "GA4 & Shopify AI Traffic Attribution", included: true },
        { text: "12-Month Retention + Priority API Access", included: true },
      ],
      ctaText: "Start Scale Trial",
      ctaHref: "/dashboard",
    },
    {
      id: "enterprise",
      name: "Enterprise / Agency",
      badge: "GLOBAL SCALE",
      monthlyPrice: 1500,
      annualPrice: 1200,
      description: "Tailored for global retail portfolios and agencies managing multi-client GEO at scale.",
      highlight: false,
      isCurrent: false,
      features: [
        { text: "10+ Brand Workspaces + White-Label Reporting", included: true },
        { text: "1,000+ Custom Prompts (Real-Time / Hourly Runs)", included: true },
        { text: "All Engines + Custom LLM Endpoint Testing", included: true },
        { text: "Unlimited Competitors & Global Geo Regions", included: true },
        { text: "Full Merchant Feed Sync & Snowflake/BigQuery Export", included: true },
        { text: "SSO / SAML & Dedicated GEO Strategist", included: true },
        { text: "Custom SLA & 24/7 Priority Support", included: true },
        { text: "Dedicated Generative Optimization Engineer", included: true },
      ],
      ctaText: "Contact Enterprise Sales",
      ctaHref: "/dashboard",
    },
  ];

  const powerUps = [
    {
      icon: Zap,
      title: "Extra Daily Prompt Pack",
      price: "+$49 / mo",
      description: "Add 25 daily recurring tracked prompts across all active engines. Stackable up to 500 prompts.",
      tag: "+25 Prompts / mo",
    },
    {
      icon: Globe,
      title: "Global Geo-Location Pack",
      price: "+$99 / mo per region",
      description: "Simulate and track regional AI answers and localized shopping carousels in international retail markets.",
      badges: ["[US]", "[UK]", "[CA]", "[AU]", "[DE]"],
    },
    {
      icon: Clock,
      title: "Launch & Drop Hourly Monitoring",
      price: "+$149 / mo",
      description: "Burst Mode: Polls Perplexity and ChatGPT Search every 60 minutes during product drops and PR events.",
      tag: "Burst Telemetry",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-white border-t border-slate-200/80" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="text-[11px] font-semibold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full uppercase">
            Predictable Enterprise Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-sans">
            Transparent Pricing Built for Every Growth Stage
          </h2>
          <p className="text-base text-slate-600">
            From single-category challengers to multi-brand global retail conglomerates.
            Cancel or change plans at any time with zero long-term lock-in.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  !isAnnual
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isAnnual
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
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
        </div>

        {/* Interactive Prompt Run ROI Calculator Card */}
        <div className="max-w-4xl mx-auto mb-16 bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Interactive Prompt Run & Volume Estimator
                </h4>
                <p className="text-xs text-slate-500">
                  Estimate your brand&apos;s monthly generative monitoring throughput
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <span className="text-xs text-slate-500">Recommended Tier:</span>
              <span className="text-xs font-bold font-mono text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {recommendedTier}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {/* Slider 1: Tracked Prompts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-700">Tracked Commercial Prompts</span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {trackedPrompts} Prompts
                </span>
              </div>
              <input
                type="range"
                min="25"
                max="500"
                step="25"
                value={trackedPrompts}
                onChange={(e) => setTrackedPrompts(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>25 (Niche)</span>
                <span>100 (Category Leader)</span>
                <span>500+ (Enterprise)</span>
              </div>
            </div>

            {/* Slider 2: Engines Monitored */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-700">AI Engines Monitored</span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {selectedEnginesCount} Engines
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="4"
                step="1"
                value={selectedEnginesCount}
                onChange={(e) => setSelectedEnginesCount(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>2 (ChatGPT + Perplexity)</span>
                <span>4 (All Major Models)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white rounded-xl border border-slate-200/70">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Monthly AI Queries
              </span>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {monthlyRuns.toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/70">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Audit Frequency
              </span>
              <div className="text-lg font-bold text-emerald-600 font-mono mt-0.5">
                Daily Telemetry
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
              <span className="text-[10px] text-emerald-800 uppercase font-semibold">
                Expected Share Lift
              </span>
              <div className="text-lg font-bold text-emerald-900 font-mono mt-0.5">
                +14% to +28%
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pricing Cards Grid (Exact Design Parity with Settings & Billing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isScale = plan.id === "scale";

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                  isScale
                    ? "ring-2 ring-emerald-500 bg-white border-2 border-emerald-500 shadow-xl shadow-emerald-500/10"
                    : "border border-slate-200/90 bg-white shadow-xs hover:border-slate-300"
                }`}
              >
                {/* Header Badge */}
                <div>
                  <div className="flex items-center justify-between min-h-[26px] mb-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                        isScale
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : plan.badge === "MOST POPULAR"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {plan.badge}
                    </span>

                    {isAnnual && plan.id !== "enterprise" && (
                      <span className="text-xs text-slate-400 line-through font-mono">
                        ${plan.monthlyPrice}/mo
                      </span>
                    )}
                  </div>

                  {/* Plan Name & Price */}
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    {plan.id === "enterprise" ? (
                      <div>
                        <span className="text-3xl font-extrabold text-slate-900">Custom</span>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Starting at $1,500 / mo
                        </p>
                      </div>
                    ) : (
                      <>
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                          ${price}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">/ month</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-2.5 min-h-[36px] leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Features List */}
                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Included Capabilities
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            feat.included
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-300"
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                        <span
                          className={`${
                            feat.included
                              ? "text-slate-700 font-medium"
                              : "text-slate-400 line-through"
                          }`}
                        >
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    href={plan.ctaHref}
                    className={`w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      isScale
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : plan.id === "pro"
                        ? "bg-slate-900 hover:bg-slate-800 text-white"
                        : "bg-white hover:bg-slate-50 text-slate-900 border border-slate-200"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Modular Power-Up Add-On Cards */}
        <div className="mt-16">
          <div className="mb-6 text-left">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Modular Infrastructure Power-Ups
            </h3>
            <p className="text-xs text-slate-500">
              Stack specialized capabilities onto any plan to match your operational roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {powerUps.map((pu, idx) => {
              const Icon = pu.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold font-mono text-slate-900">
                        {pu.price}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{pu.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {pu.description}
                    </p>

                    {pu.badges && (
                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                        {pu.badges.map((b) => (
                          <span
                            key={b}
                            className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    )}

                    {pu.tag && (
                      <span className="inline-block mt-3 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {pu.tag}
                      </span>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Add to subscription</span>
                    <Link
                      href="/dashboard"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Configure &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
