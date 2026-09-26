"use client";

import React, { useState } from "react";
import { Sparkles, X, Plus, Loader2, Bot, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MinePromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  defaultCompetitors: string[];
  onMine: (competitors: string[], catalogContext: string) => Promise<void>;
}

export function MinePromptsModal({
  isOpen,
  onClose,
  brandName,
  defaultCompetitors,
  onMine,
}: MinePromptsModalProps) {
  const [competitors, setCompetitors] = useState<string[]>(defaultCompetitors);
  const [newCompetitorInput, setNewCompetitorInput] = useState("");
  const [catalogContext, setCatalogContext] = useState(
    "High-waisted leggings, Seamless sports bras, Gym duffels, Oversized pump covers, Sweat-wicking shorts"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddCompetitor = () => {
    const trimmed = newCompetitorInput.trim();
    if (trimmed && !competitors.includes(trimmed)) {
      setCompetitors([...competitors, trimmed]);
      setNewCompetitorInput("");
    }
  };

  const handleRemoveCompetitor = (name: string) => {
    setCompetitors(competitors.filter((c) => c !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onMine(competitors, catalogContext);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-linear-to-r from-slate-50 via-white to-emerald-50/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Prompt Discovery Engine
              </h2>
              <p className="text-xs text-slate-500">
                Autonomous GEO prompt mining for <span className="font-semibold text-slate-700">{brandName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Analyst Role Banner */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
            <Bot className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Autonomous GEO Analyst:</span> AI search models will analyze consumer intent patterns to uncover 10–15 high-converting queries across Discovery, Consideration, and Commercial funnels.
            </div>
          </div>

          {/* Competitors List */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Benchmarked Competitors
              </label>
              <span className="text-[11px] text-slate-400">
                Used for comparative & consideration queries
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 min-h-[44px]">
              {competitors.map((comp) => (
                <span
                  key={comp}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs"
                >
                  {comp}
                  <button
                    type="button"
                    onClick={() => handleRemoveCompetitor(comp)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1 mt-0.5">
                <input
                  type="text"
                  placeholder="+ Add competitor"
                  value={newCompetitorInput}
                  onChange={(e) => setNewCompetitorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCompetitor();
                    }
                  }}
                  className="text-xs px-2 py-1 bg-transparent border-0 focus:outline-hidden text-slate-700 placeholder:text-slate-400"
                />
                {newCompetitorInput && (
                  <button
                    type="button"
                    onClick={handleAddCompetitor}
                    className="p-1 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product Catalog / Context */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Catalog Context & Product Categories
              </label>
              <span className="text-[11px] text-slate-400">
                e.g. Shopify collections or key lines
              </span>
            </div>
            <textarea
              rows={3}
              value={catalogContext}
              onChange={(e) => setCatalogContext(e.target.value)}
              placeholder="e.g. High-waisted leggings, seamless compression shorts, oversized gym hoodies..."
              className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
            />
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              The engine will cluster suggested prompts around these product domains.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-medium px-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  <span>Mining Prompts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-200" />
                  <span>Run Discovery Engine</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
