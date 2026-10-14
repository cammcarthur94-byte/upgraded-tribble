"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Share2,
  TrendingUp,
  ExternalLink,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Copy,
  Check,
  Star,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  DollarSign,
  Plus,
} from "lucide-react";
import { BrandFavicon, EngineFavicon, Favicon } from "@/components/ui/favicon";

export function ProductTourTabs() {
  const [activeTab, setActiveTab] = useState<
    "citations" | "shopping" | "models" | "playbooks"
  >("citations");

  // State for interactive micro-actions inside tabs
  const [prTaskCreated, setPrTaskCreated] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [task1Checked, setTask1Checked] = useState(false);
  const [task2Checked, setTask2Checked] = useState(true);

  const tabs = [
    {
      id: "citations" as const,
      name: "Citations & Referring Domains",
      badge: "Where AI Learns",
      icon: Search,
      subtitle: "Uncover which third-party websites feed AI engine recommendation models",
    },
    {
      id: "shopping" as const,
      name: "AI Shopping & Carousel Shelf",
      badge: "Commercial Tiles",
      icon: ShoppingBag,
      subtitle: "Track commercial product appearances inside ChatGPT & Perplexity shopping carousels",
    },
    {
      id: "models" as const,
      name: "AI Model Insights",
      badge: "LLM Benchmarking",
      icon: Share2,
      subtitle: "Head-to-head win-rate and omission audits across ChatGPT, Perplexity, Gemini, and Claude",
    },
    {
      id: "playbooks" as const,
      name: "Growth Playbooks & Lift",
      badge: "Verified ROI",
      icon: TrendingUp,
      subtitle: "Turn generative engine visibility gaps into automated PR and Schema.org execution tasks",
    },
  ];

  const jsonLdSnippet = `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Gymshark Vital Seamless 2.0 Leggings",
  "brand": {
    "@type": "Brand",
    "name": "Gymshark"
  },
  "offers": {
    "@type": "Offer",
    "price": "54.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "506"
  }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(jsonLdSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden" id="citations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Platform Deep Dive</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-sans">
            Explore the Complete GEO & AIO Operating System
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Every generative engine uses different grounding algorithms. Click through
            the 4 core modules of Recomnd v1.0 to see how top brands measure and conquer AI search.
          </p>
        </div>

        {/* Tab Navigation Switcher (Styled identically to SaaS in-app tabs) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
          <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-1.5 shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200/90"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-emerald-600" : "text-slate-400"
                    }`}
                  />
                  <span>{tab.name}</span>
                  <span
                    className={`hidden lg:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono uppercase tracking-wider ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold"
                        : "bg-slate-200/70 text-slate-500 font-medium"
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Interactive Browser Window Showcase */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {/* SCREEN 1: Citations & Referring Domains */}
            {activeTab === "citations" && (
              <motion.div
                key="citations"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.03),0_20px_48px_-12px_rgba(15,23,42,0.10)] overflow-hidden"
              >
                {/* Browser Toolbar */}
                <div className="bg-white/95 border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-md text-xs font-mono text-slate-600 max-w-md truncate">
                    app.recomnd.ai/reports/citations &bull; Gymshark
                  </div>
                  <Link
                    href="/reports/citations"
                    className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1"
                  >
                    Open Live Citations <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Citations Content View */}
                <div className="p-6 space-y-6">
                  {/* Top Bar: Authority Distribution + Summary Metric */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Distribution Summary Card */}
                    <div className="md:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">
                            Domain Authority Distribution
                          </h4>
                          <p className="text-xs text-slate-400">
                            Where LLMs crawl grounding proof about your catalog
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                          51 Total Sources
                        </span>
                      </div>

                      {/* Stacked Percentage Bar */}
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex mb-3">
                        <div
                          style={{ width: "35%" }}
                          className="bg-indigo-500 h-full"
                          title="35% UGC & Forums"
                        />
                        <div
                          style={{ width: "27%" }}
                          className="bg-emerald-500 h-full"
                          title="27% Editorial Press"
                        />
                        <div
                          style={{ width: "27%" }}
                          className="bg-blue-500 h-full"
                          title="27% Brand Owned"
                        />
                        <div
                          style={{ width: "11%" }}
                          className="bg-amber-500 h-full"
                          title="11% Affiliate & Reviews"
                        />
                      </div>

                      {/* Legend */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          <span className="text-slate-600">35% UGC / Forums</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span className="text-slate-600">27% Editorial Press</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <span className="text-slate-600">27% Brand Owned</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <span className="text-slate-600">11% Affiliate</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Insight Card */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Top Citation Driver
                      </span>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 font-sans">
                          reddit.com
                        </div>
                        <p className="text-xs text-emerald-600 font-medium mt-1">
                          +18% inclusion rate in ChatGPT Search
                        </p>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        r/fitness and r/xxfitness threads drive 62% of all organic fitness citations.
                      </div>
                    </div>
                  </div>

                  {/* Domain Explorer Table Replica */}
                  <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Domain Explorer & Citation Footprint
                      </h4>
                      <span className="text-xs text-slate-400">
                        Showing verified citation sources
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="px-5 py-3">Domain</th>
                            <th className="px-4 py-3">Classification</th>
                            <th className="px-4 py-3">Sentiment</th>
                            <th className="px-4 py-3">Citations</th>
                            <th className="px-4 py-3">Engine Footprint</th>
                            <th className="px-5 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {/* Row 1: reddit.com */}
                          <tr className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-slate-900 flex items-center gap-2.5">
                              <Favicon domain="reddit.com" size={20} />
                              <div>
                                <span className="font-semibold">reddit.com</span>
                                <span className="block text-[11px] text-slate-400">
                                  r/fitness &bull; r/xxfitness
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="px-2 py-0.5 rounded text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                                Third-Party UGC
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-emerald-600">
                              78% Positive
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="font-semibold text-slate-900 font-mono">
                                22 Citations
                              </span>
                              <span className="text-emerald-600 text-[11px] ml-1 font-mono">
                                +18%
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <EngineFavicon engine="perplexity" size={16} />
                                <EngineFavicon engine="chatgpt" size={16} />
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <Link
                                href="/reports/citations"
                                className="text-emerald-600 hover:text-emerald-700 font-semibold"
                              >
                                Inspect &rarr;
                              </Link>
                            </td>
                          </tr>

                          {/* Row 2: gymshark.com */}
                          <tr className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-slate-900 flex items-center gap-2.5">
                              <Favicon domain="gymshark.com" size={20} />
                              <div>
                                <span className="font-semibold">gymshark.com</span>
                                <span className="block text-[11px] text-slate-400">
                                  Official DTC Store
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700 border border-blue-200/70">
                                Brand Owned
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-emerald-600">
                              94% Positive
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="font-semibold text-slate-900 font-mono">
                                16 Citations
                              </span>
                              <span className="text-emerald-600 text-[11px] ml-1 font-mono">
                                +12%
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <EngineFavicon engine="perplexity" size={16} />
                                <EngineFavicon engine="chatgpt" size={16} />
                                <EngineFavicon engine="gemini" size={16} />
                                <EngineFavicon engine="claude" size={16} />
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <Link
                                href="/reports/citations"
                                className="text-emerald-600 hover:text-emerald-700 font-semibold"
                              >
                                Inspect &rarr;
                              </Link>
                            </td>
                          </tr>

                          {/* Row 3: womenshealthmag.com */}
                          <tr className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-slate-900 flex items-center gap-2.5">
                              <Favicon domain="womenshealthmag.com" size={20} />
                              <div>
                                <span className="font-semibold">womenshealthmag.com</span>
                                <span className="block text-[11px] text-slate-400">
                                  Editorial Review
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                                Third-Party Press
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-emerald-600">
                              89% Positive
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="font-semibold text-slate-900 font-mono">
                                9 Citations
                              </span>
                              <span className="text-emerald-600 text-[11px] ml-1 font-mono">
                                +25%
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <EngineFavicon engine="perplexity" size={16} />
                                <EngineFavicon engine="gemini" size={16} />
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <Link
                                href="/reports/citations"
                                className="text-emerald-600 hover:text-emerald-700 font-semibold"
                              >
                                Inspect &rarr;
                              </Link>
                            </td>
                          </tr>

                          {/* Row 4: Highlighted Competitor Gap Row vogue.com */}
                          <tr className="bg-rose-50/40 border-l-4 border-l-rose-500 hover:bg-rose-50/60 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-slate-900 flex items-center gap-2.5">
                              <Favicon domain="vogue.com" size={20} />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900">vogue.com</span>
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                    <Flame className="w-2.5 h-2.5" />
                                    Competitor Gap
                                  </span>
                                </div>
                                <span className="block text-[11px] text-rose-600 font-medium">
                                  Cites Lululemon & Alo Yoga 18x &bull; Gymshark 0x
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="px-2 py-0.5 rounded text-[11px] bg-rose-100 text-rose-800 border border-rose-200 font-medium">
                                Editorial Gap
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-slate-400">
                              0% Mention
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="font-semibold text-rose-700 font-mono">
                                0 Citations
                              </span>
                              <span className="text-slate-400 text-[11px] ml-1">
                                (Lost Opp)
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5 opacity-60">
                                <EngineFavicon engine="chatgpt" size={16} />
                                <EngineFavicon engine="claude" size={16} />
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={() => setPrTaskCreated(true)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                                  prTaskCreated
                                    ? "bg-emerald-600 text-white"
                                    : "bg-rose-600 hover:bg-rose-700 text-white"
                                }`}
                              >
                                {prTaskCreated ? "✓ Task Created!" : "+ Create PR Task"}
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCREEN 2: AI Shopping & Carousel Shelf */}
            {activeTab === "shopping" && (
              <motion.div
                key="shopping"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.03),0_20px_48px_-12px_rgba(15,23,42,0.10)] overflow-hidden"
              >
                {/* Browser Toolbar */}
                <div className="bg-white/95 border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-md text-xs font-mono text-slate-600 max-w-md truncate">
                    app.recomnd.ai/reports/shopping &bull; Commercial Carousels
                  </div>
                  <Link
                    href="/reports/shopping"
                    className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1"
                  >
                    Open Live AI Shopping <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* AI Shopping Content */}
                <div className="p-6 space-y-6">
                  {/* Shelf Share Header */}
                  <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900">
                          AI Shopping Carousel Share of Shelf
                        </h4>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Live Commercial Feed &bull; Real-time
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Product visibility across ChatGPT Search Product Carousel & Perplexity Shopping
                      </p>
                    </div>

                    {/* Competitor Shelf Share Pill Stack */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                        Gymshark: 40.5% (Rank #1)
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
                        Nike: 3.9%
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
                        Lululemon: 3.1%
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
                        Alo Yoga: 2.9%
                      </div>
                    </div>
                  </div>

                  {/* 4 Side-by-Side Product Visibility Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Gymshark Vital Seamless */}
                    <div className="bg-white border-2 border-emerald-500 rounded-xl p-4 shadow-xs relative flex flex-col justify-between">
                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                          YOU
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-white">
                          #1
                        </span>
                      </div>

                      <div>
                        {/* Simulated Apparel Image Frame */}
                        <div className="w-full h-36 rounded-lg bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950 flex flex-col items-center justify-center p-3 text-white mb-3">
                          <ShoppingBag className="w-8 h-8 text-emerald-400 mb-1" />
                          <span className="text-[11px] font-mono font-medium text-emerald-300">
                            Vital Seamless 2.0
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                          <EngineFavicon engine="chatgpt" size={14} />
                          <span>ChatGPT &bull; Leggings</span>
                        </div>
                        <h5 className="font-bold text-sm text-slate-900 leading-snug">
                          Vital Seamless 2.0 Leggings
                        </h5>
                        <div className="text-xs text-slate-500 mt-1">Gymshark</div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>4.7</span>
                          <span className="text-slate-400 font-normal font-sans">
                            (506 hits)
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          $54.00
                        </span>
                      </div>
                    </div>

                    {/* Card 2: Lululemon Align */}
                    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs relative flex flex-col justify-between">
                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
                          COMPETITOR
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                          #1
                        </span>
                      </div>

                      <div>
                        <div className="w-full h-36 rounded-lg bg-gradient-to-tr from-rose-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-3 text-white mb-3">
                          <ShoppingBag className="w-8 h-8 text-rose-300 mb-1" />
                          <span className="text-[11px] font-mono font-medium text-rose-200">
                            Align High-Rise Pant
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                          <EngineFavicon engine="chatgpt" size={14} />
                          <span>ChatGPT &bull; Yoga</span>
                        </div>
                        <h5 className="font-bold text-sm text-slate-900 leading-snug">
                          Align High-Rise Pant 28&quot;
                        </h5>
                        <div className="text-xs text-slate-500 mt-1">Lululemon</div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>4.7</span>
                          <span className="text-slate-400 font-normal font-sans">
                            (466 hits)
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          $98.00
                        </span>
                      </div>
                    </div>

                    {/* Card 3: Gymshark Adapt Camo */}
                    <div className="bg-white border-2 border-emerald-500 rounded-xl p-4 shadow-xs relative flex flex-col justify-between">
                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                          YOU
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-white">
                          #1
                        </span>
                      </div>

                      <div>
                        <div className="w-full h-36 rounded-lg bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-950 flex flex-col items-center justify-center p-3 text-white mb-3">
                          <ShoppingBag className="w-8 h-8 text-teal-300 mb-1" />
                          <span className="text-[11px] font-mono font-medium text-teal-200">
                            Adapt Camo Seamless
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                          <EngineFavicon engine="gemini" size={14} />
                          <span>Gemini &bull; Lifting</span>
                        </div>
                        <h5 className="font-bold text-sm text-slate-900 leading-snug">
                          Adapt Camo Seamless Leggings
                        </h5>
                        <div className="text-xs text-slate-500 mt-1">Gymshark</div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>4.5</span>
                          <span className="text-slate-400 font-normal font-sans">
                            (312 hits)
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          $60.00
                        </span>
                      </div>
                    </div>

                    {/* Card 4: Nike One Dri-FIT */}
                    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs relative flex flex-col justify-between">
                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
                          COMPETITOR
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                          #1
                        </span>
                      </div>

                      <div>
                        <div className="w-full h-36 rounded-lg bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-3 text-white mb-3">
                          <ShoppingBag className="w-8 h-8 text-indigo-300 mb-1" />
                          <span className="text-[11px] font-mono font-medium text-indigo-200">
                            Nike One Dri-FIT
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                          <EngineFavicon engine="chatgpt" size={14} />
                          <span>ChatGPT &bull; Training</span>
                        </div>
                        <h5 className="font-bold text-sm text-slate-900 leading-snug">
                          One Dri-FIT Mid-Rise Leggings
                        </h5>
                        <div className="text-xs text-slate-500 mt-1">Nike</div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>4.4</span>
                          <span className="text-slate-400 font-normal font-sans">
                            (289 hits)
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          $65.00
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCREEN 3: AI Model Insights */}
            {activeTab === "models" && (
              <motion.div
                key="models"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.03),0_20px_48px_-12px_rgba(15,23,42,0.10)] overflow-hidden"
              >
                {/* Browser Toolbar */}
                <div className="bg-white/95 border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-md text-xs font-mono text-slate-600 max-w-md truncate">
                    app.recomnd.ai/reports/models &bull; Head-to-Head Benchmarks
                  </div>
                  <Link
                    href="/reports/models"
                    className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1"
                  >
                    Open Live Model Insights <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Model Insights Content */}
                <div className="p-6 space-y-6">
                  {/* Top 4 Model Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <EngineFavicon engine="perplexity" size={20} />
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Top Pick
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 font-sans">
                        88%
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">
                        Perplexity AI
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Strongest technical citation depth
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <EngineFavicon engine="chatgpt" size={20} />
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          High Share
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 font-sans">
                        80%
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">
                        OpenAI ChatGPT
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        High consumer commercial intent
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <EngineFavicon engine="gemini" size={20} />
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Needs Focus
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 font-sans">
                        64%
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">
                        Google Gemini
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Under-indexing in luxury pilates queries
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <EngineFavicon engine="claude" size={20} />
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Balanced
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 font-sans">
                        68%
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">
                        Anthropic Claude
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Favorable sentiment on durability
                      </div>
                    </div>
                  </div>

                  {/* Expanded Head-to-Head Comparison Drawer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Column 1: Top Favorable Recommendations */}
                    <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-2xs space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-bold">
                          👍
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                            Top Favorable Recommendations
                          </h5>
                          <span className="text-[11px] text-emerald-700">
                            Queries where Gymshark holds Rank #1 Top Pick
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">
                              &quot;What are the highest-rated activewear sets for high-intensity training?&quot;
                            </span>
                            <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              Rank #1
                            </span>
                          </div>
                          <p className="text-slate-600 italic">
                            All 4 models unanimously recommend Gymshark Vital Seamless for sweat-wicking durability.
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">
                              &quot;Best squat-proof gym wear for powerlifting and heavy squats&quot;
                            </span>
                            <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              Rank #1
                            </span>
                          </div>
                          <p className="text-slate-600 italic">
                            Cited across 14 reddit.com threads with 92% favorable sentiment.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Competitor-Dominated Gaps */}
                    <div className="bg-white rounded-xl border border-rose-200 p-5 shadow-2xs space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-rose-100 flex items-center justify-center text-rose-800 text-xs font-bold">
                          ⚠️
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                            Competitor-Dominated Gaps
                          </h5>
                          <span className="text-[11px] text-rose-700">
                            High-value prompts where your brand was omitted
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">
                              &quot;Best luxury activewear for pilates and studio workouts&quot;
                            </span>
                            <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                              Brand Omitted
                            </span>
                          </div>
                          <p className="text-slate-600 italic">
                            ChatGPT & Gemini exclusively cite <strong>Lululemon</strong> & <strong>Alo Yoga</strong> via Vogue editorial links.
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">
                              &quot;Eco-friendly sustainable gym apparel brands 2026&quot;
                            </span>
                            <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                              Brand Omitted
                            </span>
                          </div>
                          <p className="text-slate-600 italic">
                            Missing JSON-LD sustainability claims prevents Google Gemini from extracting brand credentials.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCREEN 4: Growth Playbooks & Verified Lift */}
            {activeTab === "playbooks" && (
              <motion.div
                key="playbooks"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.03),0_20px_48px_-12px_rgba(15,23,42,0.10)] overflow-hidden"
              >
                {/* Browser Toolbar */}
                <div className="bg-white/95 border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-md text-xs font-mono text-slate-600 max-w-md truncate">
                    app.recomnd.ai/tools/growth &bull; Automated Playbooks
                  </div>
                  <Link
                    href="/tools/growth"
                    className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1"
                  >
                    Open Live Playbooks <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Growth Playbooks Content */}
                <div className="p-6 space-y-6">
                  {/* Verified Lift Banner */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-950">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                        ⚡
                      </span>
                      <div>
                        <span className="font-bold text-sm">
                          +16.5% Avg. Generative Visibility Lift Verified
                        </span>
                        <p className="text-emerald-800 text-[11px]">
                          Brands that execute Recomnd Playbooks see measurable citation increases within 14 days.
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block font-mono font-bold bg-white text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200">
                      8 Tasks Ready
                    </span>
                  </div>

                  {/* Task List on Left + Slide-Over Execution Drawer on Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Task Tracker */}
                    <div className="lg:col-span-6 space-y-3">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Prescriptive Optimization Tasks
                      </h4>

                      {/* Task 1 */}
                      <div
                        onClick={() => setTask1Checked(!task1Checked)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          task1Checked
                            ? "bg-emerald-50/50 border-emerald-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={task1Checked}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-slate-900">
                                Engage in r/fitness AMA on Seamless Fabric Opacity
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
                                +16 pts
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Reddit discussions are indexed by Perplexity within 3 hours. Answering squat-proof questions closes your gap.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Task 2 */}
                      <div
                        onClick={() => setTask2Checked(!task2Checked)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          task2Checked
                            ? "bg-emerald-50/50 border-emerald-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={task2Checked}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-xs text-slate-900">
                                  Inject Product & AggregateRating JSON-LD Schema
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                  ✨ Live Lift
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
                                +11 pts
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Enables Google Gemini & ChatGPT Shopping carousels to extract verified pricing ($54.00) and review counts.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Code Execution Drawer Replica */}
                    <div className="lg:col-span-6 bg-slate-900 rounded-xl p-4 sm:p-5 text-white flex flex-col justify-between shadow-md">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            <span className="text-xs font-mono font-semibold text-slate-200">
                              schema.org/Product.jsonld
                            </span>
                          </div>
                          <button
                            onClick={handleCopyCode}
                            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            {copiedCode ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Snippet</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Syntax-Highlighted Code Block */}
                        <pre className="text-[11px] font-mono text-emerald-300/90 overflow-x-auto leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                          <code>{jsonLdSnippet}</code>
                        </pre>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 mt-3">
                        <span>Status: Ready for Shopify / Webflow deploy</span>
                        <span className="text-emerald-400 font-medium">Valid Schema 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
