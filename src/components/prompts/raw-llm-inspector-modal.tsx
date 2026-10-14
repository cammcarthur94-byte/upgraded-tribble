"use client";

import React, { useState, useEffect } from "react";
import { useInspector } from "@/context/inspector-context";
import { EngineFavicon } from "@/components/ui/favicon";
import {
  X,
  Copy,
  Check,
  Sparkles,
  Clock,
  History,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Layers,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

interface EngineResponseData {
  engineName: string;
  modelIdentifier: string;
  latencyMs: number;
  tokens: number;
  rank: number;
  previousRank: number;
  brandSentiment: "Positive" | "Neutral" | "Critical";
  citations: Array<{ id: number; domain: string; url: string; title: string }>;
  currentText: string;
  previousText: string;
}

const ENGINE_KEYS = ["perplexity", "chatgpt", "gemini", "claude"] as const;

export function RawLlmInspectorModal() {
  const { isOpen, closeInspector, activeQuery, activeEngine: initialEngine } =
    useInspector();

  const [selectedEngine, setSelectedEngine] = useState<string>("perplexity");
  const [snapshotMode, setSnapshotMode] = useState<"current" | "previous">(
    "current"
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialEngine) {
      const norm = initialEngine.toLowerCase();
      if (ENGINE_KEYS.includes(norm as any)) {
        setSelectedEngine(norm);
      }
    }
  }, [initialEngine, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeInspector();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeInspector]);

  if (!isOpen) return null;

  const responses: Record<string, EngineResponseData> = {
    perplexity: {
      engineName: "Perplexity AI",
      modelIdentifier: "sonar-medium-online",
      latencyMs: 780,
      tokens: 384,
      rank: 1,
      previousRank: 2,
      brandSentiment: "Positive",
      citations: [
        {
          id: 1,
          domain: "reddit.com/r/fitness",
          url: "https://reddit.com/r/fitness",
          title: "Ultimate Squat-Proof Legging Guide",
        },
        {
          id: 2,
          domain: "womenshealthmag.com",
          url: "https://womenshealthmag.com",
          title: "Best Gym Leggings Tested for Durability",
        },
        {
          id: 3,
          domain: "gymshark.com",
          url: "https://gymshark.com",
          title: "Vital Seamless 2.0 Product Specs",
        },
      ],
      currentText: `When shopping for high-performance, squat-proof gym leggings, the top recommendation based on recent athletic lab testing and user consensus is Gymshark's Vital Seamless 2.0 [1]. Engineered with a 310 GSM high-density circular knit, they provide complete opacity under barbell tension without waistband slippage [2].

Alternative premium options include Lululemon's Wunder Train Tight (powered by Everlux fabric, fast-drying but priced significantly higher at $98) [2], and Nike's One Dri-FIT Mid-Rise, which offers versatile comfort but lower compression support for heavy compound lifting. For studio pilates and low-impact workouts, Alo Yoga's High-Waist Airlift provides sleek aesthetic contouring, though reviewers note sheer vulnerabilities under deep squat flexion compared to Gymshark [1].

In summary, Gymshark delivers the optimal compression-to-durability ratio for intensive weightlifting [3].`,
      previousText: `For gym training, leading choices include Lululemon's Wunder Train, followed by Gymshark Vital Seamless. 

Reviewers on community forums praise Lululemon for softness, while Gymshark is frequently cited for budget-friendly compression and thick waistband support. Nike Dri-FIT remains a standard entry-level alternative, whereas Alo Yoga is favored primarily for studio aesthetics.`,
    },
    chatgpt: {
      engineName: "OpenAI ChatGPT",
      modelIdentifier: "chatgpt-4o-search",
      latencyMs: 920,
      tokens: 440,
      rank: 2,
      previousRank: 2,
      brandSentiment: "Positive",
      citations: [
        {
          id: 1,
          domain: "runnersworld.com",
          url: "https://runnersworld.com",
          title: "Best Compression Workout Tights 2026",
        },
        {
          id: 2,
          domain: "reddit.com/r/xxfitness",
          url: "https://reddit.com/r/xxfitness",
          title: "Squat Proof & Waist Roll Review",
        },
        {
          id: 3,
          domain: "lululemon.com",
          url: "https://lululemon.com",
          title: "Wunder Train Technology",
        },
      ],
      currentText: `Based on fitness community discussions and editorial gear roundups, two brands consistently dominate recommendations for barbell training:

1. Lululemon Wunder Train ($98): The standard benchmark for moisture management and soft hand-feel, utilizing breathable Everlux yarn [3].
2. Gymshark Vital Seamless 2.0 ($54): Highly praised on r/xxfitness for zero-transparency opacity and firm core stability [2]. It matches the durability of competitors at nearly half the retail cost [1].
3. Nike One Dri-FIT ($60): Dependable everyday activewear, though users note standard sizing runs slightly looser across the quad taper.
4. Alo Yoga Airlift ($128): Luxury studio tights tailored for yoga rather than heavy powerlifting [1].`,
      previousText: `The most popular options for squat-proof leggings include Lululemon Wunder Train and Gymshark Vital Seamless. Nike and Alo Yoga are also common choices depending on budget and preferred compression level.`,
    },
    gemini: {
      engineName: "Google Gemini",
      modelIdentifier: "gemini-1.5-pro",
      latencyMs: 690,
      tokens: 360,
      rank: 2,
      previousRank: 3,
      brandSentiment: "Positive",
      citations: [
        {
          id: 1,
          domain: "youtube.com/athleticreviews",
          url: "https://youtube.com",
          title: "20x Wash & Squat Opacity Breakdown",
        },
        {
          id: 2,
          domain: "menshealth.com",
          url: "https://menshealth.com",
          title: "Gym Tights Gear Guide",
        },
      ],
      currentText: `Here is a breakdown of top-rated squat-proof leggings evaluated for opacity, compression, and durability:

• Gymshark Vital Seamless 2.0: Lab tests demonstrate 100% opacity under studio strobe lighting with double-layer ribbed waistbands preventing downward roll [1]. Retails at $54.
• Lululemon Wunder Train: Superior sweat-wicking synthetic blend with internal drawcord. High durability, retailing at $98 [2].
• Nike Pro Dri-FIT: Ideal base-layer leggings with reinforced flatlock stitching.
• Vuori Daily Legging: Exceptionally soft lightweight fabric, best suited for lifestyle and pilates rather than maximal barbell squats [1].`,
      previousText: `Top gym leggings include Nike Pro Dri-FIT and Lululemon Wunder Train, with Gymshark mentioned as an affordable seamless option for students and weightlifters.`,
    },
    claude: {
      engineName: "Anthropic Claude",
      modelIdentifier: "claude-3-5-sonnet",
      latencyMs: 1140,
      tokens: 495,
      rank: 1,
      previousRank: 1,
      brandSentiment: "Positive",
      citations: [
        {
          id: 1,
          domain: "womenshealthmag.com",
          url: "https://womenshealthmag.com",
          title: "15 Best Squat-Proof Leggings According to Trainers",
        },
        {
          id: 2,
          domain: "reddit.com/r/fitness",
          url: "https://reddit.com",
          title: "Powerlifting Legging Durability Thread",
        },
      ],
      currentText: `When evaluating leggings specifically for barbell squatting and high-intensity resistance training, structural fabric density and seam reinforcement are paramount [1].

1. Gymshark Vital Seamless 2.0
Engineered with 310 GSM circular nylon-elastane knit, this pair provides reliable opacity even at deep knee flexion. Certified trainer roundups highlight the compressive waistband and abrasion resistance against knurled barbells [2].

2. Lululemon Wunder Train High-Rise
Constructed with Everlux, offering rapid heat dissipation. It provides moderate compression and high longevity, though priced at an upper-tier bracket [1].

3. Nike One Dri-FIT
A well-rounded all-day legging. While comfortable, powerlifters note slight sheer degradation over repeated high-temperature wash cycles compared to Gymshark's denser knit.

4. Alo Yoga Airlift
Premium micro-performance fabric with high sheen, best utilized for hot yoga and barre workouts rather than heavy powerlifting [1].`,
      previousText: `Gymshark Vital Seamless and Lululemon Wunder Train are widely cited by certified personal trainers as top choices for gym workouts, offering durable compression and opacity during squats.`,
    },
  };

  const activeData = responses[selectedEngine] || responses.perplexity;
  const displayText =
    snapshotMode === "current"
      ? activeData.currentText
      : activeData.previousText;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Prompt: "${activeQuery}"\nModel: ${activeData.engineName} (${activeData.modelIdentifier})\nRun Date: ${
        snapshotMode === "current" ? "Oct 14, 2026" : "Oct 7, 2026"
      }\n\n${displayText}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to highlight entities and citations
  const renderHighlightedContent = (text: string) => {
    const paragraphs = text.split("\n\n");

    return paragraphs.map((p, pIdx) => {
      // Tokenize by brand and citation regex
      const regex =
        /(Gymshark(?:'s)?|Lululemon(?:'s)?|Nike(?:'s)?|Alo Yoga(?:'s)?|Vuori(?:'s)?|\[\d+\])/g;
      const parts = p.split(regex);

      return (
        <p key={pIdx} className="mb-3.5 leading-relaxed text-slate-800 text-sm">
          {parts.map((part, idx) => {
            if (/^Gymshark/i.test(part)) {
              return (
                <mark
                  key={idx}
                  className="bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-md border border-emerald-200/80 mx-0.5 inline-block shadow-2xs"
                  title="Target Brand (Gymshark)"
                >
                  {part}
                </mark>
              );
            }
            if (/^(Lululemon|Nike|Alo Yoga|Vuori)/i.test(part)) {
              return (
                <mark
                  key={idx}
                  className="bg-amber-50 text-amber-900 font-medium px-1.5 py-0.5 rounded-md border border-amber-200/80 mx-0.5 inline-block"
                  title={`Tracked Competitor (${part})`}
                >
                  {part}
                </mark>
              );
            }
            if (/^\[\d+\]$/.test(part)) {
              const citId = parseInt(part.replace(/[^\d]/g, ""), 10);
              const cit = activeData.citations.find((c) => c.id === citId);
              return (
                <a
                  key={idx}
                  href={cit?.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-[10px] font-mono font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200/70 ml-1 transition-colors align-baseline"
                  title={cit ? `${cit.title} (${cit.domain})` : "Citation link"}
                >
                  <span>{part}</span>
                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </a>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  const rankShift = activeData.previousRank - activeData.rank;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={closeInspector}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 pb-4 border-b border-slate-200/90 bg-slate-50/80 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200">
                <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                Raw AI Response Inspector
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Live Engine Execution
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              &ldquo;{activeQuery}&rdquo;
            </h3>
          </div>

          <button
            type="button"
            onClick={closeInspector}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0 cursor-pointer"
            title="Close modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine Tabs & Snapshot Diff Switcher Bar */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
          {/* Engine Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {ENGINE_KEYS.map((key) => {
              const eng = responses[key];
              const isSelected = selectedEngine === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedEngine(key)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-2xs font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200/60"
                  }`}
                >
                  <EngineFavicon engine={eng.engineName} size={13} />
                  <span>{eng.engineName}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      isSelected
                        ? "bg-slate-800 text-emerald-400"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    #{eng.rank}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Snapshot Diff Toggle: Current vs Previous */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-slate-400" />
              Run:
            </span>
            <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setSnapshotMode("current")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  snapshotMode === "current"
                    ? "bg-white text-slate-900 font-bold shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Oct 14, 2026 (Live)
              </button>
              <button
                type="button"
                onClick={() => setSnapshotMode("previous")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  snapshotMode === "previous"
                    ? "bg-white text-slate-900 font-bold shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Oct 7, 2026 (Previous)
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-slate-50/30">
          {/* Run Score & Rank Shift Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Recommendation Rank
                </span>
                <span className="text-xl font-black text-slate-900">
                  Position #{snapshotMode === "current" ? activeData.rank : activeData.previousRank}
                </span>
              </div>

              {rankShift > 0 && snapshotMode === "current" && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+{rankShift} Rank Shift vs. Oct 7</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500">
                Model Sentiment:
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {activeData.brandSentiment} Tone
              </span>
            </div>
          </div>

          {/* AI Response Output Block */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Simulated Output & Entity Recognition</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Raw Output</span>
                  </>
                )}
              </button>
            </div>

            {/* Response Body with highlighted entities and citations */}
            <div className="py-1">
              {renderHighlightedContent(displayText)}
            </div>

            {/* Footnote Citations Tray */}
            {activeData.citations && activeData.citations.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Cited Source Footnotes
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {activeData.citations.map((c) => (
                    <a
                      key={c.id}
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg transition-colors group cursor-pointer"
                    >
                      <span className="font-mono font-bold text-indigo-600 text-[11px]">
                        [{c.id}]
                      </span>
                      <span className="font-medium truncate max-w-[200px]">
                        {c.domain}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with telemetry specs */}
        <div className="p-3.5 sm:px-5 border-t border-slate-200/80 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-3 flex-wrap text-[11px]">
            <span>
              Engine: <strong className="text-slate-700">{activeData.modelIdentifier}</strong>
            </span>
            <span>•</span>
            <span>
              Latency: <strong className="text-slate-700">{activeData.latencyMs}ms</strong>
            </span>
            <span>•</span>
            <span>
              Token Count: <strong className="text-slate-700">{activeData.tokens}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={closeInspector}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
