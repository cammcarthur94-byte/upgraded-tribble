"use client";

import React from "react";
import {
  HelpCircle,
  BookOpen,
  Mail,
  MessageCircle,
  ExternalLink,
  X,
  FileQuestion,
  LifeBuoy,
} from "lucide-react";

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpSupportModal({ isOpen, onClose }: HelpSupportModalProps) {
  if (!isOpen) return null;

  const faqs = [
    {
      q: "How often are AI citations and share of voice updated?",
      a: "Recomnd tracks queries continuously across ChatGPT, Gemini, Perplexity, and Claude, refreshing share-of-voice indices every 24 hours.",
    },
    {
      q: "How do I add custom buyer prompts to monitor?",
      a: "Navigate to Optimization > Prompt Management and click '+ Add Prompt' to track high-intent purchase searches in your niche.",
    },
    {
      q: "What does AI Shopping Share represent?",
      a: "It measures the percentage of multi-product generative recommendations that include your catalog items vs competitor brands.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Help & Support</h2>
              <p className="text-xs text-slate-500">Guides, FAQs, and platform assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Quick Support Channels */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="mailto:support@recomnd.io"
              className="flex flex-col p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <Mail className="w-4 h-4 text-emerald-600" />
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
              </div>
              <span className="text-xs font-semibold text-slate-800">Email Support</span>
              <span className="text-[11px] text-slate-400">Response within 2 hours</span>
            </a>

            <div className="flex flex-col p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">Docs</span>
              </div>
              <span className="text-xs font-semibold text-slate-800">Documentation</span>
              <span className="text-[11px] text-slate-400">Integration & metric guides</span>
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileQuestion className="w-3.5 h-3.5 text-slate-400" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-2.5">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-800">{faq.q}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Recomnd Platform v1.0</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
