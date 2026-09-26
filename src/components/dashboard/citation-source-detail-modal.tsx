"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { DomainCitationItem } from "@/lib/types";
import { Favicon } from "@/components/ui/favicon";
import {
  X,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Info,
  Lightbulb,
} from "lucide-react";

interface CitationSourceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: DomainCitationItem | null;
  totalCitations?: number;
  brandName?: string;
}

export function CitationSourceDetailModal({
  isOpen,
  onClose,
  source,
  totalCitations,
  brandName = "Gymshark",
}: CitationSourceDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !source) return null;

  const categoryConfigs: Record<
    string,
    { label: string; badgeClasses: string; barColor: string; whyItMatters: string; opportunity: string }
  > = {
    Owned: {
      label: "Brand Owned",
      badgeClasses: "bg-emerald-50 text-emerald-700 border-emerald-200",
      barColor: "bg-emerald-500",
      whyItMatters: `AI engines cite ${source.domain} as the primary first-party authority for official specs, sizing charts, pricing, and direct product catalog ground truth.`,
      opportunity: `Enhance structured schema markup (JSON-LD Product, FAQPage) and descriptive comparison content on ${source.domain} to maximize engine retrieval precision.`,
    },
    "Community / UGC": {
      label: "Community / UGC",
      badgeClasses: "bg-purple-50 text-purple-700 border-purple-200",
      barColor: "bg-purple-500",
      whyItMatters: "Conversational engines heavily ground sentiment, authentic fit reviews, and real-world durability questions in consumer discussions from this forum.",
      opportunity: `Monitor key discussion threads and seed authoritative sizing, fabric details, and community engagement to ensure positive AI summarization for ${brandName}.`,
    },
    "Editorial Press": {
      label: "Editorial Press",
      badgeClasses: "bg-blue-50 text-blue-700 border-blue-200",
      barColor: "bg-blue-500",
      whyItMatters: "Mainstream editorial fitness publications carry high PageRank and domain trust that AI engines favor when answering 'best of' buying guide queries.",
      opportunity: "Pitch new seasonal product launches and targeted gift-guide inclusions to editorial desks covering high-intent fitness apparel queries.",
    },
    "Affiliate Review": {
      label: "Affiliate Review",
      badgeClasses: "bg-amber-50 text-amber-700 border-amber-200",
      barColor: "bg-amber-500",
      whyItMatters: "Deep-dive hands-on reviews and benchmark comparison testing are frequently synthesized by LLMs when comparing specific product lines.",
      opportunity: "Equip leading review partners with complete product testing samples and spec sheets to secure top placement in AI recommendation answers.",
    },
    "Industry Authority": {
      label: "Industry Authority",
      badgeClasses: "bg-slate-100 text-slate-700 border-slate-200",
      barColor: "bg-slate-500",
      whyItMatters: "Industry analysis portals and trade indexes provide high-trust validation for broad market standing and commercial queries.",
      opportunity: "Maintain active PR distribution and verify that brand identity and product attributes are consistently documented across key directories.",
    },
  };

  const cat = source.isBrandOwned ? "Owned" : source.category || "Editorial Press";
  const config = categoryConfigs[cat] || categoryConfigs["Industry Authority"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <Favicon domain={source.domain} size={20} className="rounded-xs shrink-0" />
            <div className="min-w-0">
              <h3 id="modal-title" className="text-base font-bold text-slate-900 truncate">
                {source.domain}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${config.badgeClasses}`}
                >
                  {source.isBrandOwned && <ShieldCheck className="w-2.5 h-2.5" />}
                  {config.label}
                </span>
                <span className="text-[11px] text-slate-400">
                  {source.isBrandOwned ? "Primary First-Party Authority" : "Third-Party Citation Source"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs text-slate-600">
          {/* Metrics Spotlight Block */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Total Citations
              </span>
              <div className="flex items-baseline gap-1 mt-0.5 font-mono">
                <span className="text-2xl font-black text-slate-900 tabular-nums">
                  {source.count}
                </span>
                <span className="text-[11px] text-slate-400">citations</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Share of AI Citations
              </span>
              <div className="flex items-baseline gap-1 mt-0.5 font-mono">
                <span className="text-2xl font-black text-emerald-600 tabular-nums">
                  {source.percentage}%
                </span>
                {totalCitations && (
                  <span className="text-[11px] text-slate-400">of {totalCitations}</span>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar Representation */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Citation Volume Share</span>
              <span className="font-mono font-semibold text-slate-800">{source.percentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
                style={{ width: `${Math.min(100, Math.max(8, source.percentage))}%` }}
              />
            </div>
          </div>

          {/* WHY IT MATTERS Section */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>WHY IT MATTERS</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-5">
              {config.whyItMatters}
            </p>
          </div>

          {/* OPPORTUNITY Section */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>GEO OPPORTUNITY</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-5">
              {config.opportunity}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          <a
            href={`https://${source.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <Link
            href={`/reports/citations?domain=${encodeURIComponent(source.domain)}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Explore Citations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
