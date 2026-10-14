"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { useBrand } from "@/context/brand-context";

export function AppShell({ children }: { children: ReactNode }) {
  const { currentBrand, setCurrentBrand, brands } = useBrand();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
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
    </div>
  );
}
