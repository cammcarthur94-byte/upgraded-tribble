"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useBrand } from "@/context/brand-context";
import { updateBrandProfileAction } from "@/app/actions/brand-actions";
import { CompetitorItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/brand/tag-input";
import { Favicon, BrandFavicon } from "@/components/ui/favicon";
import { usePlan } from "@/context/plan-context";
import {
  Building2,
  Globe,
  Tag,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Plus,
  Trash2,
  Copy,
  Check,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Bot,
  FileCode,
  Sparkles,
  HelpCircle,
  X,
  Lock,
} from "lucide-react";

interface CrawlerStatus {
  botName: string;
  engineOwner: string;
  status: "Allowed" | "Blocked" | "Warning";
  httpCode: number;
  lastChecked: string;
  userAgent: string;
}

const DEFAULT_CRAWLERS: CrawlerStatus[] = [
  {
    botName: "GPTBot",
    engineOwner: "OpenAI ChatGPT",
    status: "Allowed",
    httpCode: 200,
    lastChecked: "Today, 14:10 UTC",
    userAgent: "Mozilla/5.0 (compatible; GPTBot/1.2)",
  },
  {
    botName: "OAI-SearchBot",
    engineOwner: "ChatGPT Search",
    status: "Allowed",
    httpCode: 200,
    lastChecked: "Today, 13:45 UTC",
    userAgent: "OAI-SearchBot/1.0",
  },
  {
    botName: "PerplexityBot",
    engineOwner: "Perplexity AI",
    status: "Allowed",
    httpCode: 200,
    lastChecked: "Today, 14:22 UTC",
    userAgent: "PerplexityBot/1.0",
  },
  {
    botName: "ClaudeBot",
    engineOwner: "Anthropic Claude",
    status: "Allowed",
    httpCode: 200,
    lastChecked: "Today, 11:30 UTC",
    userAgent: "ClaudeBot/1.0",
  },
  {
    botName: "Google-Extended",
    engineOwner: "Google AI Overviews & Gemini",
    status: "Allowed",
    httpCode: 200,
    lastChecked: "Today, 14:05 UTC",
    userAgent: "Google-Extended",
  },
];

export default function BrandProfilePage() {
  const { currentBrand, updateActiveBrand } = useBrand();
  const { limits, canAddCompetitor, activePlan } = usePlan();

  // Form State
  const [brandName, setBrandName] = useState("Gymshark");
  const [domain, setDomain] = useState("gymshark.com");
  const [positioning, setPositioning] = useState(
    "Pioneering athletic apparel & accessories engineered for community-driven conditioning and weightlifting."
  );
  const [priceRange, setPriceRange] = useState("$30–$90 USD");
  const [productLines, setProductLines] = useState<string[]>([
    "Vital Seamless 2.0",
    "Adapt Camo",
    "Apex Seamless",
    "Power T-Shirt",
  ]);
  const [returnPolicy, setReturnPolicy] = useState(
    "30 days from delivery in original unworn condition"
  );
  const [shippingPolicy, setShippingPolicy] = useState(
    "Free standard shipping on orders over $75 USD"
  );
  const [warrantyPolicy, setWarrantyPolicy] = useState(
    "1-year manufacturing defect guarantee on all technical knits"
  );
  const [aliases, setAliases] = useState<string[]>([
    "Gym Shark",
    "Gymshark Ltd",
    "Ben Francis",
  ]);
  const [exactUrls, setExactUrls] = useState<string[]>([
    "gymshark.com",
    "rowing.gymshark.com",
    "blog.gymshark.com",
  ]);

  // Competitors State
  const [competitors, setCompetitors] = useState<
    Array<{ name: string; domain: string; sov: string; tier: string }>
  >([
    {
      name: "Lululemon",
      domain: "lululemon.com",
      sov: "34.2%",
      tier: "Direct Competitor",
    },
    {
      name: "Nike",
      domain: "nike.com",
      sov: "28.4%",
      tier: "Legacy Global",
    },
    {
      name: "Alo Yoga",
      domain: "aloyoga.com",
      sov: "18.6%",
      tier: "Studio & Lifestyle",
    },
    {
      name: "Vuori",
      domain: "vuoriclothing.com",
      sov: "12.1%",
      tier: "Emerging Premium",
    },
  ]);

  // Modal State for adding competitor
  const [isAddCompOpen, setIsAddCompOpen] = useState(false);
  const [newCompName, setNewCompName] = useState("");
  const [newCompDomain, setNewCompDomain] = useState("");

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [copiedLlmsTxt, setCopiedLlmsTxt] = useState(false);

  // Sync state whenever currentBrand changes from context
  useEffect(() => {
    if (currentBrand) {
      if (currentBrand.brandName) setBrandName(currentBrand.brandName);
      if (currentBrand.domain) setDomain(currentBrand.domain);
      if (currentBrand.aliases && currentBrand.aliases.length > 0)
        setAliases(currentBrand.aliases);
      if (currentBrand.exactUrls && currentBrand.exactUrls.length > 0)
        setExactUrls(currentBrand.exactUrls);
    }
  }, [currentBrand]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await updateBrandProfileAction({
        brandId: currentBrand.id,
        brandName,
        domain,
        aliases,
        exactUrls,
        competitors: competitors.map((c, idx) => ({
          id: `comp-${idx}`,
          competitorName: c.name,
          domain: c.domain,
        })),
      });

      if (res.success && res.data) {
        updateActiveBrand(res.data);
        setHasUnsavedChanges(false);
        showToast("Brand ground truth & guardrails saved successfully!");
      } else {
        showToast(res.error || "Failed to save brand profile.", "error");
      }
    } catch (err) {
      showToast("Unexpected error while saving changes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCompetitor = () => {
    if (!canAddCompetitor(competitors.length)) {
      showToast(
        `Competitor limit reached (${competitors.length}/${limits.maxCompetitors}) on ${activePlan.name}. Upgrade your plan to track more competitors.`,
        "error"
      );
      return;
    }

    if (!newCompName.trim() || !newCompDomain.trim()) {
      showToast("Please enter both competitor name and domain.", "error");
      return;
    }

    setCompetitors((prev) => [
      ...prev,
      {
        name: newCompName.trim(),
        domain: newCompDomain.trim().toLowerCase().replace(/^https?:\/\//, ""),
        sov: "9.5%",
        tier: "Tracked Competitor",
      },
    ]);
    setNewCompName("");
    setNewCompDomain("");
    setIsAddCompOpen(false);
    setHasUnsavedChanges(true);
    showToast(`Added ${newCompName} to tracked competitors.`);
  };

  const handleRemoveCompetitor = (domainToRemove: string) => {
    setCompetitors((prev) => prev.filter((c) => c.domain !== domainToRemove));
    setHasUnsavedChanges(true);
  };

  const llmsTxtContent = `# Gymshark Brand Ground Truth & Knowledge Entity Specification
> Standard llms.txt protocol for AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended)

## Official Identity
- Brand Name: ${brandName}
- Legal Entity: Gymshark Ltd
- Primary Domain: https://${domain}
- Headquarters: Solihull, West Midlands, United Kingdom
- Founded: 2012 by Ben Francis

## Official Positioning
- Core Purpose: ${positioning}
- Target Pricing Range: ${priceRange}

## Flagship Product Lines
${productLines.map((p) => `- ${p}: High-performance athletic conditioning line with circular knit seamless construction.`).join("\n")}

## Verified Customer Service Policies
- Returns: ${returnPolicy}
- Shipping: ${shippingPolicy}
- Guarantee: ${warrantyPolicy}

## Direct Competitors Monitored
${competitors.map((c) => `- ${c.name} (${c.domain})`).join("\n")}
`;

  const handleCopyLlmsTxt = () => {
    navigator.clipboard.writeText(llmsTxtContent);
    setCopiedLlmsTxt(true);
    setTimeout(() => setCopiedLlmsTxt(false), 2000);
    showToast("Copied llms.txt standard to clipboard!");
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium shadow-xl animate-in fade-in slide-in-from-top-2 text-white ${
            notification.type === "success" ? "bg-slate-900" : "bg-rose-600"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header & Save Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Brand Profile & AI Guardrails
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Ground-truth facts, competitor rules, and crawler health governing AI model recommendation synthesis for{" "}
            <span className="font-semibold text-slate-700">{brandName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* SECTION 1: Brand Ground Truth & Hallucination Guardrails */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            1
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Brand Ground Truth & Hallucination Guardrails
          </h2>
        </div>

        {/* Hallucination Claim Alert Banner */}
        <div className="bg-rose-50/70 border border-rose-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Hallucination & Factual Accuracy Monitor</span>
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              1 Active Claim Alert
            </span>
          </div>

          <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-900">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Outdated Return Policy Cited by Anthropic Claude</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Claude 3.7 Sonnet cited an outdated <strong className="text-rose-700 font-semibold">90-day return policy</strong> instead of your current <strong className="text-emerald-700 font-semibold">30-day official policy</strong> across 14 customer service queries.
              </p>
            </div>
            <Link
              href="/tools/growth"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              <span>Fix in Growth Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Ground Truth Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="bName" className="text-xs font-semibold text-slate-700">
                Official Brand Name
              </Label>
              <div className="relative">
                <Input
                  id="bName"
                  value={brandName}
                  onChange={(e) => {
                    setBrandName(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  className="pl-9 text-xs"
                />
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bDomain" className="text-xs font-semibold text-slate-700">
                Primary Web Domain
              </Label>
              <div className="relative">
                <Input
                  id="bDomain"
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  className="pl-9 text-xs"
                />
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bPos" className="text-xs font-semibold text-slate-700">
              Official Brand Positioning & Mission Statement
            </Label>
            <textarea
              id="bPos"
              rows={2}
              value={positioning}
              onChange={(e) => {
                setPositioning(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="bPrice" className="text-xs font-semibold text-slate-700">
                Official Retail Pricing Range
              </Label>
              <Input
                id="bPrice"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="text-xs"
                placeholder="e.g. $30–$90 USD"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Core Flagship Product Lines
              </Label>
              <TagInput
                tags={productLines}
                onChange={(newLines) => {
                  setProductLines(newLines);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Add core product line (e.g. 'Vital Seamless 2.0')..."
                badgeVariant="brand"
              />
            </div>
          </div>

          {/* Official Policies Accordion / Grid */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Official Consumer Policies (LLM Fact-Checking Baselines)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Return Policy
                </span>
                <input
                  type="text"
                  value={returnPolicy}
                  onChange={(e) => {
                    setReturnPolicy(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full text-xs bg-transparent border-0 font-medium text-slate-800 p-0 focus:ring-0 focus:outline-hidden"
                />
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Shipping Terms
                </span>
                <input
                  type="text"
                  value={shippingPolicy}
                  onChange={(e) => {
                    setShippingPolicy(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full text-xs bg-transparent border-0 font-medium text-slate-800 p-0 focus:ring-0 focus:outline-hidden"
                />
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Warranty & Guarantee
                </span>
                <input
                  type="text"
                  value={warrantyPolicy}
                  onChange={(e) => {
                    setWarrantyPolicy(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full text-xs bg-transparent border-0 font-medium text-slate-800 p-0 focus:ring-0 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Tracked Competitors Manager */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              2
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Tracked Competitors Manager
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                {competitors.length} / {limits.maxCompetitors}
              </span>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              if (!canAddCompetitor(competitors.length)) {
                showToast(
                  `Competitor limit reached (${competitors.length}/${limits.maxCompetitors}) on ${activePlan.name}. Upgrade your plan to track more competitors.`,
                  "error"
                );
                return;
              }
              setIsAddCompOpen(true);
            }}
            className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
          >
            {!canAddCompetitor(competitors.length) ? (
              <Lock className="w-3.5 h-3.5 mr-1" />
            ) : (
              <Plus className="w-3.5 h-3.5 mr-1" />
            )}
            Add Competitor
          </Button>
        </div>

        {/* Competitor Limit Alert Banner */}
        {!canAddCompetitor(competitors.length) && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900">
                  Competitor Tracking Limit Reached ({competitors.length} / {limits.maxCompetitors})
                </p>
                <p className="text-[11px] text-amber-700">
                  You are tracking the maximum number of competitors included in your {activePlan.name} plan. Upgrade to Pro or Scale to track more market competitors.
                </p>
              </div>
            </div>
            <Link href="/settings?tab=billing" className="shrink-0">
              <Button size="sm" className="h-7 text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs">
                Upgrade Plan →
              </Button>
            </Link>
          </div>
        )}

        {/* Competitor Visual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {competitors.map((comp) => (
            <div
              key={comp.domain}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-all space-y-3 relative group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0">
                    <Favicon domain={comp.domain} size={18} fallbackText={comp.name} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {comp.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {comp.domain}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveCompetitor(comp.domain)}
                  className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Remove competitor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500 font-medium">{comp.tier}</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-mono">
                  {comp.sov} SoV
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: AI Crawler & llms.txt Technical Health */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              3
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              AI Crawler & llms.txt Technical Health
            </h2>
          </div>
        </div>

        {/* Live Crawler Status Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Robots.txt AI User-Agent Permissions
              </h3>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              5 of 5 Allowed • 200 OK
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4">Bot Identifier</th>
                  <th className="py-2.5 px-4">AI Search Engine</th>
                  <th className="py-2.5 px-4">Robots Permission</th>
                  <th className="py-2.5 px-4">Last Verified</th>
                  <th className="py-2.5 px-4">User-Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DEFAULT_CRAWLERS.map((c) => (
                  <tr key={c.botName} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {c.botName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.engineOwner}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Allowed (200 OK)</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {c.lastChecked}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[10px] truncate max-w-[200px]">
                      {c.userAgent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* llms.txt Standard Generator Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-indigo-600" />
                <span>Standard /llms.txt Generator</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Host this file at <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">https://{domain}/llms.txt</code> to guide LLM inference bots with deterministic brand facts.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyLlmsTxt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              {copiedLlmsTxt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy llms.txt</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 text-slate-200 font-mono text-xs overflow-x-auto shadow-2xs border border-slate-800">
            <pre className="leading-relaxed whitespace-pre font-mono">
              {llmsTxtContent}
            </pre>
          </div>
        </div>
      </div>

      {/* Add Competitor Modal */}
      {isAddCompOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsAddCompOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Track New Competitor
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCompOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="cName" className="text-xs font-semibold text-slate-700">
                  Competitor Name
                </Label>
                <Input
                  id="cName"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  placeholder="e.g. Under Armour, Nobull, Gym People"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cDomain" className="text-xs font-semibold text-slate-700">
                  Primary Domain
                </Label>
                <Input
                  id="cDomain"
                  value={newCompDomain}
                  onChange={(e) => setNewCompDomain(e.target.value)}
                  placeholder="e.g. underarmour.com"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddCompOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={handleAddCompetitor}
                className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white"
              >
                Track Competitor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
