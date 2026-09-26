"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Loader2,
  Check,
  Bot,
  Layers,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  SupportedEngine,
  PromptItem,
  PromptType,
  BrandStatus,
  SearchIntent,
  PromptCategory,
} from "@/lib/types";
import { EngineBadge } from "./engine-badge";

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
  brandName: string;
  onSavePrompt: (promptData: {
    queryText: string;
    frequency: "daily" | "weekly";
    targetEngines: SupportedEngine[];
    promptType?: PromptType;
    brandedType?: BrandStatus;
    searchIntent?: SearchIntent;
    promptCategory?: PromptCategory;
  }) => Promise<void>;
  initialPrompt?: PromptItem | null;
}

const AVAILABLE_ENGINES: { id: SupportedEngine; name: string; desc: string }[] = [
  { id: "chatgpt", name: "OpenAI ChatGPT", desc: "GPT-4o & SearchGPT" },
  { id: "claude", name: "Anthropic Claude", desc: "Claude 3.5 Sonnet" },
  { id: "gemini", name: "Google Gemini", desc: "Gemini 1.5 Pro & Search" },
  { id: "perplexity", name: "Perplexity AI", desc: "Perplexity Pro Engine" },
];

const PROMPT_TYPES: PromptType[] = [
  "Recommendation",
  "Direct Query",
  "Comparison",
  "Buying Guide",
  "Troubleshooting",
  "General",
];

const SEARCH_INTENTS: { id: SearchIntent; label: string; desc: string }[] = [
  { id: "Commercial", label: "Commercial", desc: "Evaluating options & recommendations" },
  { id: "Transactional", label: "Transactional", desc: "High purchasing intent & pricing" },
  { id: "Informational", label: "Informational", desc: "Educational & understanding questions" },
  { id: "Navigational", label: "Navigational", desc: "Seeking specific brand/page" },
];

const PROMPT_CATEGORIES: PromptCategory[] = [
  "Product Comparison",
  "Top of Funnel Discovery",
  "Buying Guide",
  "Feature Reviews",
  "Competitor Alternatives",
];

export function AddPromptModal({
  isOpen,
  onClose,
  brandId,
  brandName,
  onSavePrompt,
  initialPrompt,
}: AddPromptModalProps) {
  const [queryText, setQueryText] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [targetEngines, setTargetEngines] = useState<SupportedEngine[]>([
    "chatgpt",
    "claude",
    "gemini",
    "perplexity",
  ]);

  // Classification state
  const [promptType, setPromptType] = useState<PromptType>("Recommendation");
  const [brandedType, setBrandedType] = useState<BrandStatus>("Unbranded");
  const [searchIntent, setSearchIntent] = useState<SearchIntent>("Commercial");
  const [promptCategory, setPromptCategory] = useState<PromptCategory>("Top of Funnel Discovery");
  const [isManualClassification, setIsManualClassification] = useState(false);

  // AI Assistant Drawer state
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [productCategory, setProductCategory] = useState("");
  const [targetPersona, setTargetPersona] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto classification heuristic when user types query
  const autoClassifyQuery = (text: string) => {
    if (!text) return;
    const lower = text.toLowerCase();
    const brandLower = (brandName || "").toLowerCase();

    // Branded vs Unbranded
    const isBrandMentioned = brandLower && lower.includes(brandLower);
    setBrandedType(isBrandMentioned ? "Branded" : "Unbranded");

    // Category & Type heuristics
    if (lower.includes("alternative") || lower.includes("substitute") || lower.includes("competitor")) {
      setPromptCategory("Competitor Alternatives");
      setPromptType("Comparison");
      setSearchIntent("Commercial");
    } else if (
      lower.includes(" vs ") ||
      lower.includes(" versus ") ||
      lower.includes("compare") ||
      lower.includes("difference between")
    ) {
      setPromptCategory("Product Comparison");
      setPromptType("Comparison");
      setSearchIntent("Commercial");
    } else if (
      lower.includes("guide") ||
      lower.includes("how to choose") ||
      lower.includes("what to look for") ||
      lower.includes("checklist")
    ) {
      setPromptCategory("Buying Guide");
      setPromptType("Buying Guide");
      setSearchIntent("Informational");
    } else if (
      lower.includes("review") ||
      lower.includes("worth it") ||
      lower.includes("quality") ||
      lower.includes("feature") ||
      lower.includes("material") ||
      lower.includes("squat-proof")
    ) {
      setPromptCategory("Feature Reviews");
      setPromptType("Direct Query");
      setSearchIntent("Commercial");
    } else {
      setPromptCategory("Top of Funnel Discovery");
      setPromptType("Recommendation");
      setSearchIntent(lower.includes("buy") || lower.includes("price") || lower.includes("cheap") || lower.includes("cost") ? "Transactional" : "Commercial");
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      setQueryText(initialPrompt.queryText);
      setFrequency(initialPrompt.frequency);
      setTargetEngines(initialPrompt.targetEngines);
      setPromptType(initialPrompt.promptType || "Recommendation");
      setBrandedType(initialPrompt.brandedType || "Unbranded");
      setSearchIntent(initialPrompt.searchIntent || "Commercial");
      setPromptCategory(initialPrompt.promptCategory || "Top of Funnel Discovery");
      setIsManualClassification(true);
    } else {
      setQueryText("");
      setFrequency("daily");
      setTargetEngines(["chatgpt", "claude", "gemini", "perplexity"]);
      setPromptType("Recommendation");
      setBrandedType("Unbranded");
      setSearchIntent("Commercial");
      setPromptCategory("Top of Funnel Discovery");
      setIsManualClassification(false);
      setShowAIAssistant(false);
      setGeneratedPrompts([]);
      setProductCategory("");
      setTargetPersona("");
      setErrorMsg(null);
    }
  }, [initialPrompt, isOpen]);

  if (!isOpen) return null;

  const toggleEngine = (engine: SupportedEngine) => {
    if (targetEngines.includes(engine)) {
      if (targetEngines.length === 1) return; // Must select at least one
      setTargetEngines(targetEngines.filter((e) => e !== engine));
    } else {
      setTargetEngines([...targetEngines, engine]);
    }
  };

  const handleGenerateAI = async () => {
    if (!productCategory.trim()) {
      setErrorMsg("Please enter a product or category for the AI generator.");
      return;
    }
    setErrorMsg(null);
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productCategory,
          targetPersona,
        }),
      });
      const data = await res.json();
      if (data.prompts && Array.isArray(data.prompts)) {
        setGeneratedPrompts(data.prompts);
      } else {
        setErrorMsg("Failed to generate queries. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error generating queries.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) {
      setErrorMsg("Query text is required.");
      return;
    }
    if (targetEngines.length === 0) {
      setErrorMsg("Please select at least one target AI engine.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onSavePrompt({
        queryText: queryText.trim(),
        frequency,
        targetEngines,
        promptType,
        brandedType,
        searchIntent,
        promptCategory,
      });
      onClose();
    } catch (err) {
      setErrorMsg("Failed to save prompt. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl z-50 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {initialPrompt ? "Edit Audit Prompt" : "Add New Audit Prompt"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeting brand: <span className="font-semibold text-slate-700">{brandName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* AI Generator Accordion Toggle */}
          <div className="rounded-xl border border-indigo-100 bg-linear-to-r from-indigo-50/60 via-purple-50/40 to-slate-50 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    AI Prompt Idea Assistant
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Generate high-intent buyer questions tailored to your niche
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg border border-indigo-200 transition-all shadow-2xs"
              >
                {showAIAssistant ? "Hide Assistant" : "✨ Generate with AI"}
              </button>
            </div>

            {/* AI Assistant Drawer Content */}
            {showAIAssistant && (
              <div className="mt-4 pt-3.5 border-t border-indigo-100/70 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Product / Category
                    </label>
                    <input
                      type="text"
                      placeholder='e.g. "Seamless compression gym leggings"'
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Target Persona
                    </label>
                    <input
                      type="text"
                      placeholder='e.g. "Female powerlifters & runners"'
                      value={targetPersona}
                      onChange={(e) => setTargetPersona(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={handleGenerateAI}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating 5 Intent Queries...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate 5 Queries</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Generated Prompt Chips */}
                {generatedPrompts.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[11px] font-medium text-slate-600 mb-2">
                      Click any generated query below to populate the prompt field:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {generatedPrompts.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setQueryText(p);
                            autoClassifyQuery(p);
                          }}
                          className="text-left text-xs bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-900 rounded-lg px-3 py-2 transition-all group flex items-start gap-2 shadow-2xs"
                        >
                          <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{p}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Query Input Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Prompt Query <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Natural conversational query asked by users
              </span>
            </div>
            <textarea
              required
              rows={3}
              placeholder="e.g. What are the best seamless leggings with high compression and squat-proof fabric?"
              value={queryText}
              onChange={(e) => {
                const val = e.target.value;
                setQueryText(val);
                if (!isManualClassification) {
                  autoClassifyQuery(val);
                }
              }}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 bg-white transition-all resize-y"
            />
          </div>

          {/* Classification & Search Intent Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Prompt Classification & Intent
              </span>
              <span className="text-[11px] text-slate-400">
                Auto-detected • Click to customize
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Type of Prompt */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Type of Prompt
                </label>
                <select
                  value={promptType}
                  onChange={(e) => {
                    setPromptType(e.target.value as PromptType);
                    setIsManualClassification(true);
                  }}
                  className="w-full text-xs font-medium py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {PROMPT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branded / Unbranded */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Branded / Unbranded
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setBrandedType("Branded");
                      setIsManualClassification(true);
                    }}
                    className={`py-1 px-3 text-xs font-semibold rounded-md transition-colors ${
                      brandedType === "Branded"
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : "text-slate-600 hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    Branded
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBrandedType("Unbranded");
                      setIsManualClassification(true);
                    }}
                    className={`py-1 px-3 text-xs font-semibold rounded-md transition-colors ${
                      brandedType === "Unbranded"
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    Unbranded
                  </button>
                </div>
              </div>

              {/* Search Intent */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Search Intent
                </label>
                <select
                  value={searchIntent}
                  onChange={(e) => {
                    setSearchIntent(e.target.value as SearchIntent);
                    setIsManualClassification(true);
                  }}
                  className="w-full text-xs font-medium py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {SEARCH_INTENTS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label} — {item.desc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prompt Category */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Prompt Category
                </label>
                <select
                  value={promptCategory}
                  onChange={(e) => {
                    setPromptCategory(e.target.value as PromptCategory);
                    setIsManualClassification(true);
                  }}
                  className="w-full text-xs font-medium py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {PROMPT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Target Engines Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Target AI Engines <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Select conversational engines to audit
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AVAILABLE_ENGINES.map((engine) => {
                const isSelected = targetEngines.includes(engine.id);
                return (
                  <div
                    key={engine.id}
                    onClick={() => toggleEngine(engine.id)}
                    className={`cursor-pointer flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "border-slate-800 bg-slate-900/5 shadow-2xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-900">
                          {engine.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {engine.desc}
                        </div>
                      </div>
                    </div>
                    <EngineBadge engine={engine.id} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Frequency Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Audit Frequency
              </label>
              <span className="text-[11px] text-slate-400">
                How frequently to run visibility tracking
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`cursor-pointer flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  frequency === "daily"
                    ? "border-slate-800 bg-slate-900/5 ring-1 ring-slate-800"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value="daily"
                  checked={frequency === "daily"}
                  onChange={() => setFrequency("daily")}
                  className="sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center">
                  {frequency === "daily" && (
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Daily
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Runs every 24 hours
                  </div>
                </div>
              </label>

              <label
                className={`cursor-pointer flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  frequency === "weekly"
                    ? "border-slate-800 bg-slate-900/5 ring-1 ring-slate-800"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value="weekly"
                  checked={frequency === "weekly"}
                  onChange={() => setFrequency("weekly")}
                  className="sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center">
                  {frequency === "weekly" && (
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Weekly
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Runs every Monday at 00:00 UTC
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{initialPrompt ? "Save Changes" : "Create Prompt"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
