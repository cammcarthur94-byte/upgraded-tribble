"use client";

import React, { useEffect } from "react";
import { DomainIntelligenceItem, SupportedEngine } from "@/lib/types";
import { EngineBadge } from "@/components/prompts/engine-badge";
import { Favicon } from "@/components/ui/favicon";
import {
  X,
  ExternalLink,
  Globe,
  CheckCircle2,
  ShieldAlert,
  Copy,
  Check,
  Calendar,
  MessageSquareQuote,
} from "lucide-react";

interface CitationDetailsSheetProps {
  domainItem: DomainIntelligenceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CitationDetailsSheet({
  domainItem,
  isOpen,
  onClose,
}: CitationDetailsSheetProps) {
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

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

  if (!isOpen || !domainItem) return null;

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white border-l border-slate-200 text-slate-900 shadow-2xl flex flex-col transform transition-transform ease-in-out duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-white/95 backdrop-blur-md sticky top-0 z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                  <Favicon
                    domain={domainItem.domain}
                    size={24}
                    fallbackText={domainItem.domain}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    {domainItem.domain}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Domain Citation Deep Dive & Attribution
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {domainItem.isBrandOwned ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Brand-Owned Domain
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                    Third-Party Authority
                  </span>
                )}

                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {domainItem.citationCount} total citation{domainItem.citationCount !== 1 ? "s" : ""}
                </span>

                <div className="flex items-center gap-1">
                  {domainItem.referencingEngines.map((engine) => (
                    <EngineBadge key={engine} engine={engine} size="sm" />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Timeline & Metadata bar */}
          <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              <span className="text-slate-400">First observed: </span>
              <span className="font-medium text-slate-700">
                {new Date(domainItem.firstSeen).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Most recent citation: </span>
              <span className="font-medium text-slate-700">
                {new Date(domainItem.lastSeen).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Body: Citation Instances List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Referenced URLs & Contexts ({domainItem.instances.length})
              </h3>
            </div>

            {domainItem.instances.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No specific URL instance snapshots found for this domain.
              </div>
            ) : (
              domainItem.instances.map((instance, idx) => (
                <div
                  key={`${instance.url}-${idx}`}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-colors space-y-3"
                >
                  {/* URL row */}
                  <div className="flex items-start justify-between gap-3">
                    <a
                      href={instance.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-indigo-600 hover:text-indigo-700 break-all flex items-center gap-1.5 group"
                    >
                      <span>{instance.url}</span>
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </a>

                    <button
                      onClick={() => copyToClipboard(instance.url)}
                      title="Copy URL"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex-shrink-0 shadow-2xs"
                    >
                      {copiedUrl === instance.url ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Triggering prompt */}
                  <div className="bg-white rounded-lg p-3 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-500" />
                        Triggering Prompt
                      </span>
                      <EngineBadge engine={instance.engineName} size="sm" />
                    </div>
                    <p className="text-xs text-slate-800 font-medium italic">
                      &ldquo;{instance.promptQuery}&rdquo;
                    </p>
                  </div>

                  {/* Context snippet */}
                  {instance.contextSnippet && (
                    <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                      <span className="text-slate-400 font-medium block mb-1 text-[10px] uppercase tracking-wider">
                        Attributed Snippet
                      </span>
                      {instance.contextSnippet}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <Calendar className="w-3 h-3" />
                    <span>Captured on {formatDate(instance.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors shadow-xs"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
