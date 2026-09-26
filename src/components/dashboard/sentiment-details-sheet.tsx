"use client";

import React, { useState, useEffect } from "react";
import { SentimentSnippetItem } from "@/lib/types";
import { EngineBadge } from "@/components/prompts/engine-badge";
import {
  X,
  Smile,
  Meh,
  Frown,
  Calendar,
  MessageSquareQuote,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

interface SentimentDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialSentiment?: "positive" | "neutral" | "negative" | "all";
  snippets: SentimentSnippetItem[];
  brandName?: string;
}

export function SentimentDetailsSheet({
  isOpen,
  onClose,
  initialSentiment = "all",
  snippets = [],
  brandName = "Gymshark",
}: SentimentDetailsSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "positive" | "neutral" | "negative"
  >(initialSentiment);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (initialSentiment) {
      setSelectedCategory(initialSentiment);
    }
  }, [initialSentiment]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSnippets = snippets.filter((s) => {
    if (selectedCategory === "all") return true;
    return s.sentiment === selectedCategory;
  });

  const sentimentConfigs = {
    positive: {
      label: "Positive",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      borderClass: "border-emerald-200/90 bg-emerald-50/20",
      icon: Smile,
    },
    neutral: {
      label: "Neutral",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
      borderClass: "border-slate-200 bg-slate-50/30",
      icon: Meh,
    },
    negative: {
      label: "Critical",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      borderClass: "border-rose-200/80 bg-rose-50/20",
      icon: Frown,
    },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white border-l border-slate-200 text-slate-900 shadow-2xl flex flex-col transform transition-transform ease-in-out duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-white/95 backdrop-blur-md sticky top-0 z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    AI Sentiment Citations & Context
                  </h2>
                  <p className="text-xs text-slate-400">
                    Exact prompts, tone classifications, and reasoning for {brandName}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sentiment Category Switcher Pills */}
          <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All ({snippets.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("positive")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === "positive"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                  : "text-slate-500 hover:text-emerald-700"
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>
                Positive (
                {snippets.filter((s) => s.sentiment === "positive").length}
                )
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("neutral")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === "neutral"
                  ? "bg-slate-200/70 text-slate-800 border border-slate-300 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Meh className="w-3.5 h-3.5" />
              <span>
                Neutral (
                {snippets.filter((s) => s.sentiment === "neutral").length}
                )
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("negative")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === "negative"
                  ? "bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs"
                  : "text-slate-500 hover:text-rose-700"
              }`}
            >
              <Frown className="w-3.5 h-3.5" />
              <span>
                Critical (
                {snippets.filter((s) => s.sentiment === "negative").length}
                )
              </span>
            </button>
          </div>

          {/* Snippets List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {filteredSnippets.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                No verified snippets recorded for this sentiment filter.
              </div>
            ) : (
              filteredSnippets.map((item) => {
                const config =
                  sentimentConfigs[item.sentiment] || sentimentConfigs.neutral;
                const Icon = config.icon;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border ${config.borderClass} space-y-3 transition-all hover:shadow-2xs`}
                  >
                    {/* Prompt Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <EngineBadge engine={item.engineName} size="sm" />
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.badgeClass}`}
                          >
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-1">
                          <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>&ldquo;{item.promptQuery}&rdquo;</span>
                        </h4>
                      </div>

                      <button
                        onClick={() => handleCopy(item.id, item.snippet)}
                        title="Copy snippet"
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs shrink-0"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* AI Response Snippet */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-sans shadow-2xs">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        Extracted AI Text Snippet
                      </span>
                      {item.snippet}
                    </div>

                    {/* Reasoning Footnote */}
                    {item.reasoning && (
                      <div className="text-[11px] text-slate-500 bg-slate-50/80 px-3 py-2 rounded-lg border border-slate-100 italic flex items-center gap-2">
                        <span className="font-semibold text-slate-700 not-italic shrink-0">
                          Detection Rationale:
                        </span>
                        <span>{item.reasoning}</span>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Audited on {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
