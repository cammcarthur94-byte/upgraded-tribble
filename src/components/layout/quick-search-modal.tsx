"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  Share2,
  TrendingUp,
  Pencil,
  SlidersHorizontal,
  Settings,
  HelpCircle,
  ExternalLink,
  Command,
  ArrowRight,
} from "lucide-react";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelp?: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: "Reports" | "Optimization" | "Admin" | "Support";
  href?: string;
  icon: React.ElementType;
  description: string;
  action?: () => void;
}

export function QuickSearchModal({ isOpen, onClose, onOpenHelp }: QuickSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchItems: SearchItem[] = [
    {
      id: "dashboard",
      title: "Dashboard Overview",
      category: "Reports",
      href: "/",
      icon: LayoutDashboard,
      description: "High-level summary of account health, share of voice, and citations",
    },
    {
      id: "citations",
      title: "Citations & Sources",
      category: "Reports",
      href: "/reports/citations",
      icon: Search,
      description: "Analyze web domains and sources cited by generative AI engines",
    },
    {
      id: "ai-shopping",
      title: "AI Shopping",
      category: "Reports",
      href: "/reports/shopping",
      icon: ShoppingBag,
      description: "Monitor AI product recommendations, shelves, and pricing",
    },
    {
      id: "model-insights",
      title: "AI Model Insights",
      category: "Reports",
      href: "/reports/models",
      icon: Share2,
      description: "Compare performance across ChatGPT, Gemini, Perplexity, and Claude",
    },
    {
      id: "growth-opportunities",
      title: "Growth Opportunities",
      category: "Optimization",
      href: "/tools/growth",
      icon: TrendingUp,
      description: "AI-identified opportunities to improve engine visibility and share",
    },
    {
      id: "prompt-management",
      title: "Prompt Management",
      category: "Optimization",
      href: "/tools/prompts",
      icon: Pencil,
      description: "Track, edit, and categorize benchmark buyer prompts",
    },
    {
      id: "brand-profile",
      title: "Brand Profile",
      category: "Admin",
      href: "/admin/brand-profile",
      icon: SlidersHorizontal,
      description: "Manage brand identity, competitors, and industry keywords",
    },
    {
      id: "settings-billing",
      title: "Settings & Billing",
      category: "Admin",
      href: "/settings",
      icon: Settings,
      description: "Workspace settings, team members, and billing subscription",
    },
    {
      id: "help-support",
      title: "Help & Support",
      category: "Support",
      icon: HelpCircle,
      description: "View documentation, FAQs, or contact our product specialists",
      action: () => {
        if (onOpenHelp) onOpenHelp();
      },
    },
  ];

  const filteredItems = searchItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search reports, tools, settings, or prompts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-50">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No results found for &ldquo;<span className="text-slate-600 font-medium">{query}</span>&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                    isSelected ? "bg-slate-100/90 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-white text-slate-900 shadow-xs" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-500 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded text-[10px]">↑</kbd>
              <kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded text-[10px] ml-1">↓</kbd> navigate
            </span>
            <span>
              <kbd className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">↵</kbd> select
            </span>
          </div>
          <span className="font-medium text-slate-500">Quick Jump</span>
        </div>
      </div>
    </div>
  );
}
