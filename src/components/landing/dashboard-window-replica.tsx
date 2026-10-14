"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  ShoppingBag,
  Share2,
  TrendingUp,
  Pencil,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Lock,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { BrandFavicon, EngineFavicon } from "@/components/ui/favicon";

export function DashboardWindowReplica() {
  const [activeSnippetIdx, setActiveSnippetIdx] = useState(0);

  const snippets = [
    {
      engine: "perplexity",
      engineName: "Perplexity AI",
      timeAgo: "Audited 2m ago",
      text: "“Gymshark is widely cited as the gold standard for high-compression seamless leggings, with durable sweat-wicking materials and squat-proof opacity.”",
      sources: ["reddit.com", "womenshealthmag.com"],
      rank: "#1 Top Pick",
    },
    {
      engine: "chatgpt",
      engineName: "OpenAI ChatGPT Search",
      timeAgo: "Audited 6m ago",
      text: "“Top recommendation: Gymshark Vital Seamless 2.0 ($54). Rated #1 for athletic performance and cost-to-durability ratio against Lululemon Align.”",
      sources: ["gymshark.com", "runnerclick.com"],
      rank: "#1 Recommendation",
    },
    {
      engine: "gemini",
      engineName: "Google Gemini",
      timeAgo: "Audited 11m ago",
      text: "“Gymshark holds dominant category affinity for heavy lifting and community-led fitness apparel across UGC forums and TikTok fitness discussions.”",
      sources: ["barbend.com", "reddit.com"],
      rank: "Dominant Brand",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSnippetIdx((prev) => (prev + 1) % snippets.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [snippets.length]);

  const engines = [
    {
      id: "perplexity",
      name: "Perplexity AI",
      score: 88,
      delta: "+3",
      presence: 88,
      winRate: 78,
    },
    {
      id: "chatgpt",
      name: "OpenAI ChatGPT",
      score: 82,
      delta: "+2",
      presence: 82,
      winRate: 65,
    },
    {
      id: "gemini",
      name: "Google Gemini",
      score: 71,
      delta: "+2",
      presence: 71,
      winRate: 52,
    },
    {
      id: "claude",
      name: "Anthropic Claude",
      score: 67,
      delta: "+1",
      presence: 67,
      winRate: 48,
    },
  ];

  const heatmapRows = [
    {
      prompt: "affordable alternatives to alo yoga sets",
      days: [1, 1, 2, 2, 4, 4, 4],
      status: "Shake-up",
      statusStyle: "bg-rose-50 text-rose-700 border border-rose-200/80",
    },
    {
      prompt: "gymshark vs nike leggings durability",
      days: [1, 1, 1, 2, 3, 2, 2],
      status: "Fluctuating",
      statusStyle: "bg-amber-50 text-amber-700 border border-amber-200/80",
    },
    {
      prompt: "best gym wear for heavy lifting",
      days: [1, 1, 1, 1, 1, 1, 1],
      status: "Stable",
      statusStyle: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    },
    {
      prompt: "seamless workout leggings high...",
      days: [2, 2, 1, 1, 2, 1, 1],
      status: "Stable",
      statusStyle: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    },
    {
      prompt: "where to buy authentic gymshark sets",
      days: [1, 1, 1, 1, 1, 1, 1],
      status: "Stable",
      statusStyle: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    },
  ];

  return (
    <div id="hero-dashboard-showcase" className="relative max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
      {/* Elevated Browser Window Chrome Frame */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-slate-200/90 bg-[#F8FAFC] shadow-[0_1px_3px_rgba(15,23,42,0.03),0_20px_48px_-12px_rgba(15,23,42,0.12)] overflow-hidden relative"
      >
        {/* Browser Top Navigation Bar */}
        <div className="bg-white/95 border-b border-slate-200/80 px-4 py-3 flex items-center justify-between gap-4">
          {/* Window Traffic Lights */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400/90 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400/90 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/90 inline-block" />
          </div>

          {/* Centered URL Address Pill */}
          <div className="flex-1 max-w-lg mx-auto flex items-center justify-center">
            <div className="w-full bg-slate-100/90 border border-slate-200/80 rounded-lg px-3 py-1 flex items-center justify-between text-xs text-slate-500 font-mono shadow-2xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="text-slate-400">https://</span>
                <span className="text-slate-800 font-medium truncate">
                  app.recomnd.ai/workspace/gymshark/overview
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded font-sans font-semibold shrink-0 ml-2">
                Live Data
              </span>
            </div>
          </div>

          {/* Right Action: Launch Full App Sandbox */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 px-3 py-1.5 rounded-lg transition-all shadow-2xs"
            >
              <span>Launch Live App</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Browser Main Window Layout (Mini Sidebar + Live Dashboard Surface) */}
        <div className="flex min-h-[580px] bg-[#F8FAFC]">
          {/* Mini Left Sidebar Replica */}
          <div className="hidden md:flex w-56 bg-slate-50/70 border-r border-slate-200/70 p-3 flex-col justify-between select-none shrink-0">
            <div className="space-y-4">
              {/* Workspace Switcher */}
              <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <BrandFavicon
                    brandName="Gymshark"
                    domain="gymshark.com"
                    size={24}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      Gymshark
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      gymshark.com
                    </div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              </div>

              {/* Navigation Items */}
              <div className="space-y-1 text-xs">
                <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Core View
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-white font-semibold text-slate-900 border border-slate-200/80 shadow-2xs">
                  <LayoutDashboard className="w-3.5 h-3.5 text-slate-900" />
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-white/60">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Citations</span>
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-white/60">
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                  <span>AI Shopping</span>
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-white/60">
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>AI Model Insights</span>
                </div>

                <div className="pt-2 px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Optimization
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-white/60">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                  <span>Growth Opportunities</span>
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-white/60">
                  <Pencil className="w-3.5 h-3.5 text-slate-400" />
                  <span>Prompt Management</span>
                </div>
              </div>
            </div>

            {/* Sidebar Live Badge */}
            <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/60 text-[11px] text-slate-500 font-mono flex items-center justify-between">
              <span>Telemetry</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
          </div>

          {/* Main Dashboard Canvas */}
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-hidden">
            {/* Dashboard Sub-Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/60 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    Brand Insights Overview
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    Gymshark
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-engine generative benchmarking across Perplexity, ChatGPT, Gemini, and Claude
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs">
                  Last 30 Days
                </span>
              </div>
            </div>

            {/* In-Dashboard Volatility Alert Pill */}
            <div className="bg-amber-50/70 border border-amber-200/70 text-amber-900 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs shadow-2xs">
              <div className="flex items-center gap-2 truncate">
                <span className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
                  <AlertTriangle className="w-3 h-3" />
                </span>
                <span className="truncate">
                  <strong className="font-semibold text-amber-950">Algorithm Volatility Detected:</strong> Perplexity & ChatGPT model inclusion for <strong>Gymshark</strong> fluctuated +4.8% this week.
                </span>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-amber-900 underline ml-2 shrink-0"
              >
                Inspect
              </Link>
            </div>

            {/* Top 4 Animated KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* KPI 1: AEO Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">AEO Score</span>
                  <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <motion.path
                        initial={{ strokeDasharray: "0, 100" }}
                        animate={{ strokeDasharray: "70, 100" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                        className="text-emerald-500"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>
                </div>
                <div className="my-1.5 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
                    70
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 font-mono">
                    +3.2%
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">Overall Visibility Index</span>
              </motion.div>

              {/* KPI 2: Share of Voice */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Share of Voice</span>
                  <span className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </span>
                </div>
                <div className="my-1.5 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
                    42.5%
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 font-mono">
                    +4.2%
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">Multi-Engine Category Share</span>
              </motion.div>

              {/* KPI 3: AI Sentiment */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">AI Sentiment</span>
                  <span className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </span>
                </div>
                <div className="my-1.5 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
                    64%
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                    Positive
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">6,092 Favorable Mentions</span>
              </motion.div>

              {/* KPI 4: Websites Citing You */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Websites Citing You</span>
                  <span className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </span>
                </div>
                <div className="my-1.5 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
                    51
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 font-mono">
                    +14 this mo
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">Unique Referring Domains</span>
              </motion.div>
            </div>

            {/* 2-Column Lower Visualization Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Card: AI Engine Performance with Animated Horizontal Progress Bars */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-slate-900">
                      AI Engine Performance
                    </h3>
                    <Link
                      href="/dashboard"
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Visibility and win rate across AI search engines
                  </p>

                  <div className="space-y-3.5">
                    {engines.map((engine) => (
                      <div key={engine.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <EngineFavicon engine={engine.id} size={16} />
                            <span className="font-medium text-slate-800">
                              {engine.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="font-semibold text-slate-900">
                              {engine.score}{" "}
                              <span className="text-[11px] text-slate-400 font-normal">
                                /100
                              </span>
                            </span>
                            <span className="font-semibold text-emerald-600 text-xs">
                              {engine.delta}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar Track */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${engine.presence}%` }}
                            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
                            className="h-full bg-emerald-500 rounded-full"
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                          <span>
                            Presence:{" "}
                            <strong className="text-slate-800 font-mono">
                              {engine.presence}%
                            </strong>
                          </span>
                          <span>
                            Win Rate:{" "}
                            <strong className="text-slate-800 font-mono">
                              {engine.winRate}%
                            </strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Card: Prompt Volatility & 7-Day Heatmap Matrix */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Prompt Volatility & Rank Fluctuation
                      </h3>
                      <span className="text-[10px] font-normal bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        7-Day Heatmap
                      </span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      Audit &rarr;
                    </Link>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Day-to-day ranking shifts to instantly spot AI algorithm shake-ups
                  </p>

                  {/* 7-Day Header */}
                  <div className="grid grid-cols-12 gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100">
                    <div className="col-span-5 truncate">Tracked Prompt</div>
                    <div className="col-span-5 grid grid-cols-7 text-center">
                      <span>S</span>
                      <span>M</span>
                      <span>T</span>
                      <span>W</span>
                      <span>T</span>
                      <span>F</span>
                      <span className="text-slate-900 font-bold">TODAY</span>
                    </div>
                    <div className="col-span-2 text-right">Status</div>
                  </div>

                  {/* Heatmap Rows */}
                  <div className="space-y-1.5 pt-2">
                    {heatmapRows.map((row, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-1 items-center py-1 text-xs hover:bg-slate-50/80 rounded px-1 transition-colors"
                      >
                        <div
                          className="col-span-5 font-medium text-slate-700 truncate pr-1 text-xs"
                          title={row.prompt}
                        >
                          {row.prompt}
                        </div>
                        <div className="col-span-5 grid grid-cols-7 gap-0.5 text-center items-center">
                          {row.days.map((val, dIdx) => (
                            <span
                              key={dIdx}
                              className={`inline-flex items-center justify-center w-5 h-5 mx-auto rounded text-[10px] font-mono font-semibold ${
                                val === 1
                                  ? "bg-emerald-100/90 text-emerald-800"
                                  : val === 2
                                  ? "bg-blue-100/90 text-blue-800"
                                  : val === 3
                                  ? "bg-amber-100/90 text-amber-800"
                                  : "bg-rose-100/90 text-rose-800"
                              }`}
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                        <div className="col-span-2 text-right">
                          <span
                            className={`inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${row.statusStyle}`}
                          >
                            {row.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-rose-500 pt-3 border-t border-slate-100 mt-2">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold">
                    !
                  </span>
                  <span>1 Algorithm Shake-up Detected in last 48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating "Live AI Answer Synthesis" Overlay Card (Bottom-Right Corner) */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 max-w-sm sm:max-w-md w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSnippetIdx}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="backdrop-blur-md bg-white/95 border border-slate-200/90 shadow-[0_12px_32px_rgba(15,23,42,0.14)] rounded-2xl p-4 sm:p-5 relative"
            >
              {/* Card Header: Engine Icon, Name, Audited Tag, Live Pill */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <EngineFavicon
                    engine={snippets[activeSnippetIdx].engine}
                    size={20}
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 leading-none">
                      {snippets[activeSnippetIdx].engineName}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {snippets[activeSnippetIdx].timeAgo}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {snippets[activeSnippetIdx].rank}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
              </div>

              {/* Audited Text Snippet */}
              <p className="text-xs text-slate-700 italic font-serif leading-relaxed mb-3">
                {snippets[activeSnippetIdx].text}
              </p>

              {/* Source Attribution Grounding Links */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="text-slate-400">Cited via:</span>
                  {snippets[activeSnippetIdx].sources.map((s, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-emerald-700 bg-emerald-50/80 px-1.5 py-0.2 rounded border border-emerald-200/60 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Micro pagination dots */}
                <div className="flex items-center gap-1">
                  {snippets.map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === activeSnippetIdx ? "bg-emerald-600 w-3" : "bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
