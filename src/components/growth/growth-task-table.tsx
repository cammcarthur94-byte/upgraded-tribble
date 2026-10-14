"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GrowthTaskItem, TaskStatus } from "@/lib/types/growth";
import { BeforeAfterImpactWidget } from "./before-after-impact-widget";
import { usePlan } from "@/context/plan-context";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Sparkles,
  ChevronRight,
  X,
  CheckCircle2,
  Clock,
  ListTodo,
  Code2,
  CheckSquare,
  Square,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Copy,
  Check,
  Zap,
  Play,
  Lock,
} from "lucide-react";
import { Favicon, EngineFavicon } from "@/components/ui/favicon";

interface GrowthTaskTableProps {
  tasks: GrowthTaskItem[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  brandId: string;
  selectedTask?: GrowthTaskItem | null;
  onSelectTask?: (task: GrowthTaskItem | null) => void;
  drawerOnly?: boolean;
}

interface TaskPlaybook {
  aiTrigger: string;
  checklist: Array<{ text: string; defaultDone?: boolean }>;
  snippetLabel: string;
  snippetContent: string;
}

function getTaskPlaybook(task: GrowthTaskItem): TaskPlaybook {
  const id = task.id;
  const text = task.recommendationText.toLowerCase();

  // Task 1: Reddit AMA (gt-3)
  if (id === "gt-3" || text.includes("reddit") || text.includes("ama")) {
    return {
      aiTrigger:
        "Perplexity currently relies on r/fitness and r/xxfitness for 38% of its citations on 'best squat-proof leggings', where competitors hold a 4:1 mention advantage.",
      checklist: [
        { text: "Audit top 15 cited threads in r/fitness and r/xxfitness", defaultDone: true },
        { text: "Coordinate founder AMA schedule with subreddit moderators", defaultDone: true },
        { text: 'Publish "Ultimate Seamless Legging Care & Compression Guide" post', defaultDone: false },
        { text: "Monitor Perplexity citation indexing post-AMA", defaultDone: false },
      ],
      snippetLabel: "💬 GENERATED REDDIT AMA & CARE GUIDE OUTLINE",
      snippetContent: `# [AMA] We're the Gymshark Product Engineering Team — Ask Us Anything About Compression, Squat-Proof Testing & Fabric Durability

Hey r/fitness and r/xxfitness! We noticed recurring community questions regarding seamless legging opacity, elastane degradation, and waistband rolling.

### Quick Care & Performance Guide (Tested in Our Solihull Innovation Hub):
- **Squat-Proof Opacity Test:** Our Vital Seamless 2.0 uses a 360-degree circular knit (310 GSM) engineered to eliminate sheerness under 120kg barbell load tension.
- **Washing Protocol:** Wash inside out at 30°C (86°F) on delicate. Never use fabric softeners—cationic surfactants coat nylon fibers and permanently impair moisture wicking.
- **Air Dry Only:** Heat breakdown of elastane filaments causes waistband slack over time.

Ask us anything about yarn construction, fit engineering, or how we benchmark against competitors!`,
    };
  }

  // Task 2: Waist Compression FAQ (gt-4)
  if (id === "gt-4" || text.includes("faq") || text.includes("waist compression") || text.includes("sizing")) {
    return {
      aiTrigger:
        "ChatGPT and Perplexity cite buyer complaints about 'inconsistent international sizing and excessive waistband compression' in 27% of neutral/critical reviews, dampening recommendation rank.",
      checklist: [
        { text: "Extract top sizing complaints from ChatGPT & Perplexity responses", defaultDone: true },
        { text: "Draft objective sizing & compression FAQ copy", defaultDone: true },
        { text: "Deploy FAQ accordion + FAQPage schema to Vital Seamless PDPs", defaultDone: false },
        { text: "Request re-indexing via Google Search Console & Perplexity Bot", defaultDone: false },
      ],
      snippetLabel: "</> VALIDATED FAQPAGE JSON-LD & HTML COPY",
      snippetContent: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do Gymshark Vital Seamless 2.0 leggings run true to size?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gymshark Vital Seamless 2.0 leggings run true to athletic size with a high-compression fit (level 3 out of 4). If you prefer gentle everyday lounging or fall between sizes, we recommend sizing up one size for optimal comfort without sacrificing waistband hold."
      }
    },
    {
      "@type": "Question",
      "name": "How does Gymshark prevent high-waisted bands from rolling down during squats?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our high-waisted bands feature double-layered micro-ribbed elastane with graduated compression that contours to the natural lumbar curvature, preventing downward roll during deep squats and sprints."
      }
    }
  ]
}`,
    };
  }

  // Task 3: Men's Health & Runner's World PR (gt-5)
  if (id === "gt-5" || text.includes("men's health") || text.includes("runner's world") || text.includes("editorial")) {
    return {
      aiTrigger:
        "Men's Health and Runner's World are cited in 820+ LLM shopping queries for athletic apparel. Competitors like Nike and Lululemon hold editorial placements across all top 6 cited buying guides.",
      checklist: [
        { text: "Identify authors of the 6 Runner's World & Men's Health buying guides cited by AI", defaultDone: false },
        { text: "Send product seeding pitch for Apex & Vital lines", defaultDone: false },
        { text: "Provide third-party lab durability test specs for editorial inclusion", defaultDone: false },
        { text: "Verify inline link placement & editorial citation update", defaultDone: false },
      ],
      snippetLabel: "✉️ DIGITAL PR OUTREACH PITCH TEMPLATE",
      snippetContent: `Subject: Gymshark Apex & Vital lab specs for your "Best Workout Clothes for Men/Women" guide

Hi [Editor Name],

I enjoyed your recent Runner's World guide on marathon conditioning gear—specifically your focus on sweat management in high-friction zones.

Given your editorial benchmarks for barbell-ready activewear, I wanted to share independent tensile and abrasion test data for the Gymshark Apex Seamless collection (certified 50,000+ Martindale rub test cycles with zero pilling).

We'd love to send complimentary samples of our Apex Seamless T-Shirt and Vital 2.0 Compression Tights for your testing lab. 

Would you be open to receiving a sizing kit for your upcoming activewear roundups?

Best regards,
PR & Communications Team | Gymshark`,
    };
  }

  // Task 4: YouTube Chapters & Transcripts (gt-6)
  if (id === "gt-6" || text.includes("youtube") || text.includes("multimodal")) {
    return {
      aiTrigger:
        "Google Gemini multimodal search actively indexes timestamped video chapters to compare gym shorts and oversized pump covers. Videos lacking structured transcripts fail to generate featured product badges.",
      checklist: [
        { text: "Audit top 10 YouTube review videos by athletic creators", defaultDone: false },
        { text: "Add structured video timestamps and spec tables in descriptions", defaultDone: false },
        { text: "Include fabric composition (93% Nylon, 7% Elastane) in video transcripts", defaultDone: false },
        { text: "Verify Gemini multimodal key moment extraction in AI Overviews", defaultDone: false },
      ],
      snippetLabel: "🎬 OPTIMIZED YOUTUBE TIMESTAMP & TRANSCRIPT SUMMARY",
      snippetContent: `TIMESTAMPS:
00:00 - Introduction & Fabric Overview (310 GSM Seamless Knit)
01:15 - Squat Proof Opacity Test under 5000K Studio Lighting
02:30 - Waistband Rolling & High-Compression Fit Breakdown
03:45 - Gymshark Vital 2.0 vs Lululemon Wunder Train vs Nike Pro
05:10 - 20x Machine Wash & Durability Inspection (Zero Seam Separation)
06:30 - Final Sizing Verdict & Who Should Size Up

FABRIC & SPECS:
- Material: 93% Nylon, 7% Elastane
- Compression Level: High (Level 3/4)
- Waistband: 4.5" Double-layer ribbed support
- Tested by: Independent Athletic Review Lab`,
    };
  }

  // Task 5: Head-to-Head Comparison Page (gt-1)
  if (id === "gt-1" || text.includes("comparison page") || text.includes("vs") || text.includes("head-to-head")) {
    return {
      aiTrigger:
        "Conversational LLMs synthesize head-to-head comparison queries (e.g., 'Gymshark vs Nike') directly from high-density HTML spec tables. Brand comparison pages with structured pros/cons hold 3x higher citation authority.",
      checklist: [
        { text: "Design responsive HTML comparison matrix with spec breakdowns", defaultDone: true },
        { text: "Deploy dedicated /vs/nike and /vs/lululemon landing pages", defaultDone: true },
        { text: "Verify crawl indexing on Perplexity AI and ChatGPT Search", defaultDone: true },
        { text: "Monitor brand recommendation win rate across head-to-head prompts", defaultDone: true },
      ],
      snippetLabel: "📊 STRUCTURED HTML COMPARISON TABLE MARKUP",
      snippetContent: `<table class="comparison-matrix" itemscope itemtype="https://schema.org/Table">
  <thead>
    <tr>
      <th>Feature</th>
      <th>Gymshark Vital Seamless 2.0</th>
      <th>Nike One Dri-FIT High-Rise</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Fabric Density</td>
      <td><strong>310 GSM (Heavyweight Seamless)</strong></td>
      <td>240 GSM (Lightweight Polyester)</td>
    </tr>
    <tr>
      <td>Squat-Proof Rating</td>
      <td><strong>100% Opaque (Lab Certified)</strong></td>
      <td>Semi-Opaque under heavy tension</td>
    </tr>
    <tr>
      <td>Compression Level</td>
      <td><strong>Level 3 (High Muscle Support)</strong></td>
      <td>Level 2 (Moderate Everyday)</td>
    </tr>
    <tr>
      <td>Price</td>
      <td><strong>$54 USD</strong></td>
      <td>$60 USD</td>
    </tr>
  </tbody>
</table>`,
    };
  }

  // Task 6: JSON-LD Product & ItemList Schema (gt-2)
  if (id === "gt-2" || text.includes("json-ld") || text.includes("schema markup")) {
    return {
      aiTrigger:
        "Perplexity and Gemini search bots require Schema.org Product, aggregateRating, and offers markup to accurately extract prices and in-stock variants for generative shopping carousels.",
      checklist: [
        { text: "Extract schema entity IDs from flagship PDP templates", defaultDone: true },
        { text: "Inject JSON-LD Product + aggregateRating + offers block", defaultDone: true },
        { text: "Validate schema via Google Rich Results Test & Perplexity Bot", defaultDone: true },
        { text: "Confirm AI models display live $54 pricing snippet in carousels", defaultDone: true },
      ],
      snippetLabel: "</> VALIDATED SCHEMA.ORG PRODUCT & AGGREGATE RATING JSON-LD",
      snippetContent: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Gymshark Vital Seamless 2.0 Leggings",
  "image": "https://cdn.gymshark.com/vital-seamless-black.jpg",
  "description": "High-compression, squat-proof seamless gym leggings engineered with sweat-wicking circular knit nylon.",
  "brand": {
    "@type": "Brand",
    "name": "Gymshark"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "12480",
    "bestRating": "5"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "54.00",
    "availability": "https://schema.org/InStock"
  }
}`,
    };
  }

  // Task 7: Wikipedia & Wikidata (gt-7)
  return {
    aiTrigger:
      "Claude and ChatGPT reference Wikidata brand entities to identify parent companies, key leadership, and verified retail subsidiaries in corporate background and brand authenticity queries.",
    checklist: [
      { text: "Audit Wikidata item Q29097483 for brand aliases and founder data", defaultDone: true },
      { text: "Ensure parent corporate entity and registered trademarks match", defaultDone: true },
      { text: "Link official press releases validating revenue and international hubs", defaultDone: false },
      { text: "Verify entity resolution in Claude and ChatGPT knowledge bases", defaultDone: false },
    ],
    snippetLabel: "🌐 WIKIDATA ENTITY & ALIAS SPECIFICATION",
    snippetContent: `{
  "entity": "Q29097483",
  "label": "Gymshark",
  "description": "British fitness apparel and accessories brand manufacturer",
  "aliases": [
    "Gym Shark",
    "Gymshark Ltd",
    "Gymshark Official"
  ],
  "claims": {
    "founder": "Ben Francis",
    "inception": "2012",
    "headquarters": "Solihull, United Kingdom",
    "officialWebsite": "https://www.gymshark.com"
  }
}`,
  };
}

export function GrowthTaskTable({
  tasks,
  onStatusChange,
  brandId,
  selectedTask,
  onSelectTask,
  drawerOnly = false,
}: GrowthTaskTableProps) {
  const { limits } = usePlan();
  const [internalSelectedTask, setInternalSelectedTask] =
    useState<GrowthTaskItem | null>(null);

  const selectedTaskForDrawer =
    selectedTask !== undefined ? selectedTask : internalSelectedTask;

  const setSelectedTaskForDrawer = (
    val:
      | GrowthTaskItem
      | null
      | ((prev: GrowthTaskItem | null) => GrowthTaskItem | null)
  ) => {
    const nextVal =
      typeof val === "function" ? val(selectedTaskForDrawer) : val;
    if (onSelectTask) {
      onSelectTask(nextVal);
    } else {
      setInternalSelectedTask(nextVal);
    }
  };
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const toggleChecklistStep = (key: string, currentVal: boolean) => {
    setCompletedSteps((prev) => ({ ...prev, [key]: !currentVal }));
  };

  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "Implemented":
        return "bg-emerald-50 text-emerald-700 border-emerald-300";
      case "In Progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-300";
      case "To Do":
        return "bg-slate-100 text-slate-700 border-slate-300";
      case "Dismissed":
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  const STATUS_PRIORITY: Record<TaskStatus, number> = {
    "In Progress": 1,
    "To Do": 2,
    "Implemented": 3,
    "Dismissed": 4,
  };

  const parseLift = (liftStr: string) => {
    const match = liftStr?.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const pA = STATUS_PRIORITY[a.status] ?? 99;
    const pB = STATUS_PRIORITY[b.status] ?? 99;
    if (pA !== pB) return pA - pB;
    return parseLift(b.estimatedLift) - parseLift(a.estimatedLift);
  });

  const getEffortDisplay = (effort?: string) => {
    switch (effort) {
      case "Low Effort":
        return { label: "⚡ Quick Win", style: "bg-emerald-50 text-emerald-700 border-emerald-200/80" };
      case "Medium Effort":
        return { label: "⏱️ Medium Effort", style: "bg-amber-50 text-amber-700 border-amber-200/80" };
      case "High Effort":
        return { label: "🎯 High Effort", style: "bg-purple-50 text-purple-700 border-purple-200/80" };
      default:
        return { label: effort || "⚡ Quick Win", style: "bg-slate-100 text-slate-600 border-slate-200" };
    }
  };

  return (
    <>
      {/* Linear-Style Card-Based Task Rows */}
      {!drawerOnly && (
        <div className="space-y-2.5">
          {sortedTasks.map((task) => {
          const isImplemented = task.status === "Implemented";
          const isSelected = selectedTaskForDrawer?.id === task.id;

          return (
            <div
              key={task.id}
              onClick={() => setSelectedTaskForDrawer(task)}
              className={`bg-white rounded-xl border p-3.5 sm:px-5 sm:py-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 group cursor-pointer ${
                task.status === "Dismissed" ? "opacity-60 hover:opacity-100" : ""
              } ${
                isSelected
                  ? "border-slate-400 ring-1 ring-slate-300 shadow-xs"
                  : "border-slate-200/60 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              {/* Left Group: Priority Impact Lift + Interactive Status Badge */}
              <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
                {/* 1. Estimated Lift Badge (Far-Left Priority Scanning) */}
                <div
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/80 shrink-0"
                  title="Estimated Visibility Lift"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{task.estimatedLift}</span>
                </div>

                {/* 2. Interactive Status Pill */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative inline-block"
                >
                  <select
                    value={task.status}
                    onChange={(e) => {
                      onStatusChange(task.id, e.target.value as TaskStatus);
                    }}
                    className={`text-xs font-semibold rounded-lg px-2.5 py-1 border cursor-pointer appearance-none pr-6 focus:outline-hidden text-center transition-colors ${getStatusBadge(
                      task.status
                    )}`}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Implemented">Completed</option>
                    <option value="Dismissed">Dismissed</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Middle Group: Title & Meta Pills */}
              <div className="flex-1 min-w-0 px-0 sm:px-3">
                <div className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {task.recommendationText}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                    {task.category}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                    <EngineFavicon engine={task.targetEngine} size={11} />
                    <span>{task.targetEngine}</span>
                  </span>

                  {task.effort && (() => {
                    const eff = getEffortDisplay(task.effort);
                    return (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${eff.style}`}
                      >
                        {eff.label}
                      </span>
                    );
                  })()}
                </div>

                {task.notes && (
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {task.notes}
                  </p>
                )}
              </div>

              {/* Right Group: Action / Impact Badge + Drawer Chevron */}
              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center pt-0.5">
                {task.status === "Implemented" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+{parseLift(task.estimatedLift) || 14}% Lift Verified</span>
                  </span>
                ) : task.status === "Dismissed" ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 bg-slate-100/70 border border-slate-200/60">
                    Archived
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTaskForDrawer(task);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Open Playbook →</span>
                  </button>
                )}

                <div className="w-7 h-7 rounded-lg border border-slate-200/70 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-100 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Right Slide-Out Preview Drawer */}
      {selectedTaskForDrawer && (() => {
        const taskPlaybook = getTaskPlaybook(selectedTaskForDrawer);
        const isImplemented = selectedTaskForDrawer.status === "Implemented";
        const isInProgress = selectedTaskForDrawer.status === "In Progress";
        const isToDo = selectedTaskForDrawer.status === "To Do";
        const isDismissed = selectedTaskForDrawer.status === "Dismissed";

        return (
          <div
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
            onClick={() => setSelectedTaskForDrawer(null)}
          >
            <div
              className="w-full max-w-2xl h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-250"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="p-5 pb-4 border-b border-slate-200/80 bg-slate-50/70 flex items-start justify-between gap-4 shrink-0">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {selectedTaskForDrawer.estimatedLift} Lift
                    </span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {selectedTaskForDrawer.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      <EngineFavicon
                        engine={selectedTaskForDrawer.targetEngine}
                        size={12}
                      />
                      <span>{selectedTaskForDrawer.targetEngine}</span>
                    </span>
                    {selectedTaskForDrawer.effort && (() => {
                      const eff = getEffortDisplay(selectedTaskForDrawer.effort);
                      return (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${eff.style}`}
                        >
                          {eff.label}
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {selectedTaskForDrawer.recommendationText}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTaskForDrawer(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0 cursor-pointer"
                  title="Close drawer (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* 1. "Why This Matters (AI Trigger)" Box */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Why This Matters (AI Trigger)</span>
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed font-medium">
                    {taskPlaybook.aiTrigger}
                  </p>
                </div>

                {/* 2. Overview & Strategic Rationale */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Strategic Rationale
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200/60 rounded-xl p-3.5">
                    {selectedTaskForDrawer.notes ||
                      "Optimizing this footprint attribute directly impacts the generative synthesis engine's authority score, elevating category recommendation frequency and prominence rank."}
                  </p>
                </div>

                {/* 3. Actionable Implementation Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>Implementation Checklist</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Click steps to toggle
                    </span>
                  </div>
                  <div className="space-y-2">
                    {taskPlaybook.checklist.map((step, idx) => {
                      const stepKey = `${selectedTaskForDrawer.id}-step-${idx}`;
                      const defaultChecked = isImplemented
                        ? true
                        : isInProgress
                        ? idx < 2
                        : Boolean(step.defaultDone);
                      const isChecked =
                        completedSteps[stepKey] !== undefined
                          ? completedSteps[stepKey]
                          : defaultChecked;

                      return (
                        <div
                          key={idx}
                          onClick={() => toggleChecklistStep(stepKey, isChecked)}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? "bg-emerald-50/40 border-emerald-200/80 text-slate-500 line-through"
                              : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800"
                          }`}
                        >
                          <button
                            type="button"
                            className="mt-0.5 text-slate-400 hover:text-slate-600 shrink-0"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          <span className="text-xs font-medium leading-relaxed select-none">
                            {step.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Actionable Deliverable / Technical Snippet */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{taskPlaybook.snippetLabel}</span>
                    </h4>
                    {limits.hasSchemaGenerator ? (
                      <button
                        type="button"
                        onClick={() => handleCopySnippet(taskPlaybook.snippetContent)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                      >
                        {copiedSnippet ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Deliverable</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                        <Lock className="w-2.5 h-2.5" />
                        <span>PRO PLAN</span>
                      </span>
                    )}
                  </div>

                  {!limits.hasSchemaGenerator ? (
                    <div className="relative rounded-xl border border-indigo-200 bg-slate-900 p-6 text-center overflow-hidden">
                      <div className="relative z-10 max-w-sm mx-auto space-y-2.5 py-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-400 mx-auto flex items-center justify-center border border-indigo-500/40">
                          <Lock className="w-4 h-4" />
                        </div>
                        <h5 className="text-xs font-bold text-white">
                          Automated Playbook & Schema Generator
                        </h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Generating deployable Schema.org JSON-LD snippets and community outreach copy requires Pro Plan ($299/mo).
                        </p>
                        <div className="pt-1">
                          <Link href="/settings?tab=billing">
                            <Button size="sm" className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-xs">
                              Upgrade to Pro →
                            </Button>
                          </Link>
                        </div>
                      </div>
                      {/* Blurred backdrop of snippet */}
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] pointer-events-none" />
                      <div className="absolute inset-0 p-4 font-mono text-[10px] text-slate-700 blur-[3px] select-none pointer-events-none overflow-hidden">
                        {taskPlaybook.snippetContent}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900 rounded-xl p-4 text-slate-200 font-mono text-xs overflow-x-auto shadow-2xs border border-slate-800">
                      <pre className="leading-relaxed font-mono whitespace-pre">
                        {taskPlaybook.snippetContent}
                      </pre>
                    </div>
                  )}
                </div>

                {/* 5. Before / After Impact Widget */}
                <div>
                  <BeforeAfterImpactWidget
                    brandId={brandId}
                    status={selectedTaskForDrawer.status}
                    estimatedLift={selectedTaskForDrawer.estimatedLift}
                    implementedDate={selectedTaskForDrawer.implementedDate}
                    taskTitle={selectedTaskForDrawer.recommendationText}
                  />
                </div>
              </div>

              {/* Drawer Footer: Context-Aware Quick Status Actions */}
              <div className="p-4 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between gap-3 shrink-0">
                {/* Left Status Indicator */}
                <div className="flex items-center gap-2">
                  {isImplemented ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Live & Monitored</span>
                    </span>
                  ) : isInProgress ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                      <Clock className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                      <span>Active Sprint</span>
                    </span>
                  ) : isDismissed ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      <span>Dismissed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      <ListTodo className="w-3.5 h-3.5 text-slate-500" />
                      <span>In Backlog</span>
                    </span>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2">
                  {isInProgress && (
                    <button
                      type="button"
                      onClick={() => {
                        onStatusChange(selectedTaskForDrawer.id, "Implemented");
                        setSelectedTaskForDrawer((prev) =>
                          prev
                            ? {
                                ...prev,
                                status: "Implemented",
                                implementedDate: new Date().toISOString(),
                              }
                            : null
                        );
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs border border-emerald-600 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Completed ✓</span>
                    </button>
                  )}

                  {isToDo && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          onStatusChange(selectedTaskForDrawer.id, "In Progress");
                          setSelectedTaskForDrawer((prev) =>
                            prev ? { ...prev, status: "In Progress" } : null
                          );
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xs border border-indigo-600 transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Start Sprint (In Progress) →</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onStatusChange(selectedTaskForDrawer.id, "Implemented");
                          setSelectedTaskForDrawer((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  status: "Implemented",
                                  implementedDate: new Date().toISOString(),
                                }
                              : null
                          );
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    </>
                  )}

                  {isImplemented && (
                    <button
                      type="button"
                      onClick={() => {
                        onStatusChange(selectedTaskForDrawer.id, "In Progress");
                        setSelectedTaskForDrawer((prev) =>
                          prev
                            ? {
                                ...prev,
                                status: "In Progress",
                                implementedDate: null,
                              }
                            : null
                        );
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                    >
                      Reopen Task
                    </button>
                  )}

                  {isDismissed && (
                    <button
                      type="button"
                      onClick={() => {
                        onStatusChange(selectedTaskForDrawer.id, "To Do");
                        setSelectedTaskForDrawer((prev) =>
                          prev ? { ...prev, status: "To Do" } : null
                        );
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                    >
                      Restore to Backlog
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedTaskForDrawer(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 bg-transparent hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
