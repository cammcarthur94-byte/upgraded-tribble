"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Search,
  ShoppingBag,
  Share2,
  Pencil,
  TrendingUp,
  SlidersHorizontal,
  Settings,
  LogOut,
  HelpCircle,
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  ExternalLink,
  Lock,
} from "lucide-react";
import { BrandSelector } from "./brand-selector";
import { QuickSearchModal } from "./quick-search-modal";
import { HelpSupportModal } from "./help-support-modal";
import { MOCK_BRANDS, MOCK_USER } from "@/lib/mock-data";
import { BrandData } from "@/lib/types";
import { usePlan } from "@/context/plan-context";

interface SidebarProps {
  currentBrand: BrandData;
  onBrandChange: (brand: BrandData) => void;
  brands?: BrandData[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  currentBrand,
  onBrandChange,
  brands,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { limits, activePlan } = usePlan();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K opens quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  // Top-level Dashboard / Overview
  const dashboardNav = {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    active: pathname === "/" || pathname === "/dashboard",
  };

  // Reports
  const reportsNav = [
    {
      title: "Citations",
      href: "/reports/citations",
      icon: Search,
      active:
        pathname.startsWith("/reports/citations") || pathname === "/citations",
    },
    {
      title: "AI Shopping",
      href: "/reports/shopping",
      icon: ShoppingBag,
      active: pathname.startsWith("/reports/shopping"),
    },
    {
      title: "AI Model Insights",
      href: "/reports/models",
      icon: Share2,
      active:
        pathname.startsWith("/reports/models") || pathname === "/model-insights",
    },
  ];

  // Consolidated Single-Item Categories into "OPTIMIZATION"
  const optimizationNav = [
    {
      title: "Growth Opportunities",
      href: "/tools/growth",
      icon: TrendingUp,
      active:
        pathname === "/tools/growth" || pathname === "/growth-opportunities",
    },
    {
      title: "Prompt Management",
      href: "/tools/prompts",
      icon: Pencil,
      active: pathname === "/tools/prompts",
    },
  ];

  // Admin & Workspace
  const adminNav = [
    {
      title: "Brand Profile",
      href: "/admin/brand-profile",
      icon: SlidersHorizontal,
      active:
        pathname === "/admin/brand-profile" || pathname === "/brand-profile",
    },
    {
      title: "Settings & Billing",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings" || pathname.startsWith("/settings"),
    },
  ];

  const handleSignOut = () => {
    setIsProfileOpen(false);
    if (typeof window !== "undefined") {
      alert("Sign out triggered (Supabase auth)");
    }
  };

  return (
    <>
      <aside
        className={`h-screen fixed top-0 left-0 bg-slate-50/70 backdrop-blur-md border-r border-slate-200/60 shadow-2xs flex flex-col z-30 select-none transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Top: Brand Selector + Integrated Collapse Button */}
        <div
          className={`border-b border-slate-200/60 transition-all ${
            isCollapsed
              ? "p-2.5 flex flex-col items-center gap-2"
              : "p-3 flex items-center justify-between gap-2"
          }`}
        >
          <div className={`${isCollapsed ? "w-full flex justify-center" : "flex-1 min-w-0"}`}>
            <BrandSelector
              brands={brands && brands.length > 0 ? brands : MOCK_BRANDS}
              selectedBrand={currentBrand}
              onSelectBrand={onBrandChange}
              isCollapsed={isCollapsed}
            />
          </div>

          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Global Search Bar (Cmd+K / Ctrl+K) */}
        <div className={`pt-3 ${isCollapsed ? "px-2 flex justify-center" : "px-3"}`}>
          {isCollapsed ? (
            <button
              onClick={() => setIsSearchOpen(true)}
              title="Quick search (⌘K)"
              aria-label="Quick search"
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all shadow-2xs group"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 hover:border-slate-300 rounded-xl transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
                <span className="text-slate-500 group-hover:text-slate-700 truncate">
                  Search or jump to...
                </span>
              </div>
              <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shrink-0">
                ⌘K
              </kbd>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden ${
            isCollapsed ? "px-2 py-3 space-y-4" : "px-3 py-3 space-y-5"
          }`}
        >
          {/* Top-Level: Dashboard / Overview */}
          <div>
            <Link
              href={dashboardNav.href}
              title={isCollapsed ? dashboardNav.title : undefined}
              className={`group flex items-center ${
                isCollapsed ? "justify-center p-2.5" : "px-3 py-2"
              } text-sm rounded-xl font-medium transition-all ${
                dashboardNav.active
                  ? "text-slate-900 bg-white shadow-2xs font-semibold border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent"
              }`}
            >
              <div
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "gap-3 min-w-0"
                }`}
              >
                <LayoutDashboard
                  className={`w-4 h-4 shrink-0 ${
                    dashboardNav.active
                      ? "text-slate-900"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                {!isCollapsed && <span className="truncate">{dashboardNav.title}</span>}
              </div>
            </Link>
          </div>

          {/* Section 1 - REPORTS */}
          <div>
            {!isCollapsed ? (
              <div className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Reports
              </div>
            ) : (
              <div className="my-1 border-t border-slate-200/60 mx-2" />
            )}
            <nav className="space-y-0.5">
              {reportsNav.map((item) => {
                const Icon = item.icon;
                const isLocked = item.title === "AI Shopping" && !limits.hasAiShopping;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    title={
                      isCollapsed
                        ? isLocked
                          ? `${item.title} (Pro Feature)`
                          : item.title
                        : undefined
                    }
                    className={`group flex items-center justify-between ${
                      isCollapsed ? "justify-center p-2.5" : "px-3 py-2"
                    } text-sm rounded-xl font-medium transition-all ${
                      item.active
                        ? "text-slate-900 bg-white shadow-2xs font-semibold border border-slate-200/80"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent"
                    }`}
                  >
                    <div
                      className={`flex items-center ${
                        isCollapsed ? "justify-center" : "gap-3 min-w-0"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          item.active
                            ? "text-slate-900"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </div>

                    {!isCollapsed && isLocked && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
                        <Lock className="w-2.5 h-2.5" />
                        PRO
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section 2 - OPTIMIZATION (Consolidated Prompts + Tools) */}
          <div>
            {!isCollapsed ? (
              <div className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Optimization
              </div>
            ) : (
              <div className="my-1 border-t border-slate-200/60 mx-2" />
            )}
            <nav className="space-y-0.5">
              {optimizationNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    title={isCollapsed ? item.title : undefined}
                    className={`group flex items-center ${
                      isCollapsed ? "justify-center p-2.5" : "px-3 py-2"
                    } text-sm rounded-xl font-medium transition-all ${
                      item.active
                        ? "text-slate-900 bg-white shadow-2xs font-semibold border border-slate-200/80"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent"
                    }`}
                  >
                    <div
                      className={`flex items-center ${
                        isCollapsed ? "justify-center" : "gap-3 min-w-0"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          item.active
                            ? "text-slate-900"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section 3 - ADMIN & WORKSPACE */}
          <div>
            {!isCollapsed ? (
              <div className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Admin
              </div>
            ) : (
              <div className="my-1 border-t border-slate-200/60 mx-2" />
            )}
            <nav className="space-y-0.5">
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    title={isCollapsed ? item.title : undefined}
                    className={`group flex items-center ${
                      isCollapsed ? "justify-center p-2.5" : "px-3 py-2"
                    } text-sm rounded-xl font-medium transition-all ${
                      item.active
                        ? "text-slate-900 bg-white shadow-2xs font-semibold border border-slate-200/80"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent"
                    }`}
                  >
                    <div
                      className={`flex items-center ${
                        isCollapsed ? "justify-center" : "gap-3 min-w-0"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          item.active
                            ? "text-slate-900"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </div>
                  </Link>
                );
              })}

              {/* Help & Support Button */}
              <button
                onClick={() => setIsHelpOpen(true)}
                title={isCollapsed ? "Help & Support" : undefined}
                className={`w-full group flex items-center ${
                  isCollapsed ? "justify-center p-2.5" : "px-3 py-2"
                } text-sm rounded-xl font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent`}
              >
                <div
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "gap-3 min-w-0"
                  }`}
                >
                  <HelpCircle className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-600" />
                  {!isCollapsed && <span className="truncate">Help & Support</span>}
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Section: Profile Card Popover Menu & Live App Status */}
        <div
          ref={profileMenuRef}
          className={`border-t border-slate-200/60 bg-transparent transition-all relative ${
            isCollapsed ? "p-2 space-y-2 flex flex-col items-center" : "p-3 space-y-2"
          }`}
        >
          {/* User Profile Popover Flyout Menu */}
          {isProfileOpen && (
            <div
              className={`absolute z-50 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 overflow-hidden animate-in fade-in ${
                isCollapsed
                  ? "bottom-12 left-full ml-3 w-60 slide-in-from-left-1"
                  : "bottom-full left-3 right-3 mb-2 slide-in-from-bottom-1"
              }`}
            >
              {/* Profile Menu Header */}
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/40">
                <div className="flex items-center justify-between gap-1.5">
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {MOCK_USER.fullName}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {activePlan.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {MOCK_USER.email}
                </div>
              </div>

              {/* Profile Menu Links */}
              <div className="p-1 space-y-0.5">
                <Link
                  href="/admin/brand-profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <span>Brand Profile</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Settings & Billing</span>
                </Link>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsHelpOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-left"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Help & Support</span>
                </button>
              </div>

              {/* Sign Out Action */}
              <div className="p-1 border-t border-slate-100">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* User Profile Card Button */}
          {!isCollapsed ? (
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-expanded={isProfileOpen}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all shadow-2xs group cursor-pointer ${
                isProfileOpen
                  ? "border-slate-300 bg-slate-100/70"
                  : "border-slate-200/90 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="text-xs font-semibold text-slate-900 truncate">
                  {MOCK_USER.fullName}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {MOCK_USER.email}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-purple-50 text-purple-700 border border-purple-200">
                  {MOCK_USER.role}
                </span>
                <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-expanded={isProfileOpen}
              className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer ${
                isProfileOpen
                  ? "border-purple-300 bg-purple-50 text-purple-800"
                  : "border-slate-200 bg-white text-purple-700 hover:bg-purple-50"
              }`}
              title={`${MOCK_USER.fullName} (${MOCK_USER.email}) • Click for menu`}
            >
              {MOCK_USER.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </button>
          )}

          {/* Live Status & App Branding */}
          {!isCollapsed ? (
            <div className="flex items-center justify-between px-2 pt-0.5 text-[11px] text-slate-400 font-mono">
              <span>Recomnd v1.0</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live
              </span>
            </div>
          ) : (
            <div className="flex justify-center pt-0.5" title="Recomnd v1.0 • Live">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Modals */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <HelpSupportModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </>
  );
}
