"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { useBrand } from "@/context/brand-context";
import { InspectorProvider } from "@/context/inspector-context";
import { RawLlmInspectorModal } from "@/components/prompts/raw-llm-inspector-modal";
import { ArrowLeft, Sparkles } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { currentBrand, setCurrentBrand, brands } = useBrand();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isMarketingPage = pathname === "/" || pathname === "/landing";

  // Restore saved collapse preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recomnd_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch (e) {}
  }, []);

  // Keyboard shortcut: Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleToggleCollapse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("recomnd_sidebar_collapsed", String(next));
      } catch (e) {}
      return next;
    });
  };

  // On marketing landing pages, render full-bleed without the SaaS sidebar
  if (isMarketingPage) {
    return (
      <InspectorProvider>
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
          {children}
          <RawLlmInspectorModal />
        </div>
      </InspectorProvider>
    );
  }

  return (
    <InspectorProvider>
      <div className="min-h-screen bg-slate-50/50 flex relative">
        {/* Fixed Collapsible Sidebar */}
        <Sidebar
          currentBrand={currentBrand}
          onBrandChange={setCurrentBrand}
          brands={brands}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Main Content Area - Extends smoothly when sidebar is collapsed */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out min-h-screen min-w-0 w-full overflow-y-auto overflow-x-hidden ${
            isCollapsed ? "ml-[72px]" : "ml-64"
          }`}
        >
          <div
            className={`mx-auto px-4 sm:px-6 lg:px-10 pb-12 pt-4 sm:pt-5 w-full min-w-0 transition-all duration-300 ease-in-out ${
              isCollapsed ? "max-w-[1680px]" : "max-w-7xl"
            }`}
          >
            {children}
          </div>
        </main>

        {/* Floating Demo Pitch Pill: Quick Return to Marketing Landing Page */}
        <Link
          href="/"
          title="Return to Recomnd Marketing Site"
          className="fixed bottom-5 right-5 z-40 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.08)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.12)] text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all group hover:border-slate-300"
        >
          <span className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-3 h-3 text-slate-500 group-hover:text-emerald-600 transition-colors group-hover:-translate-x-0.5 transition-transform" />
          </span>
          <span className="tracking-tight">← Marketing Site</span>
          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            v1.0
          </span>
        </Link>

        {/* Global Raw LLM Response Inspector Modal */}
        <RawLlmInspectorModal />
      </div>
    </InspectorProvider>
  );
}
