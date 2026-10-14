"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandFavicon } from "@/components/ui/favicon";
import { ArrowRight, ExternalLink, Menu, X, Sparkles } from "lucide-react";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Geometric Logo + Recomnd Wordmark + Live Pill */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4 text-white"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">
                  Recomnd
                </span>
                <span className="text-xs font-semibold text-emerald-600 font-mono">
                  ai
                </span>
              </div>
            </Link>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 select-none shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>v1.0 Live</span>
            </div>
          </div>

          {/* Center Navigation Pills (Styled like in-app segmented controls) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60 shadow-2xs">
            <a
              href="#overview"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white transition-all shadow-2xs"
            >
              Overview
            </a>
            <a
              href="#citations"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all"
            >
              Citations
            </a>
            <a
              href="#shopping"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all"
            >
              AI Shopping
            </a>
            <a
              href="#playbooks"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all"
            >
              Playbooks
            </a>
            <a
              href="#pricing"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all"
            >
              Pricing
            </a>
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Open Gymshark Sandbox Workspace Switcher Pill */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 transition-all text-xs font-medium text-slate-700 shadow-2xs hover:shadow-xs group"
              title="Open full Gymshark Workspace Sandbox"
            >
              <BrandFavicon
                brandName="Gymshark"
                domain="gymshark.com"
                size={20}
              />
              <span className="font-semibold text-slate-800">
                Gymshark Sandbox
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </Link>

            <Link
              href="/dashboard"
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3.5 py-2 text-xs font-medium shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Audit Your Brand</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/dashboard"
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
            >
              Sandbox ↗
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700 pb-2 border-b border-slate-100">
            <a
              href="#overview"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded hover:bg-slate-50"
            >
              Overview
            </a>
            <a
              href="#citations"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded hover:bg-slate-50"
            >
              Citations
            </a>
            <a
              href="#shopping"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded hover:bg-slate-50"
            >
              AI Shopping
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded hover:bg-slate-50"
            >
              Pricing
            </a>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="w-full text-center py-2.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-xs"
            >
              Explore Live Gymshark Sandbox &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
