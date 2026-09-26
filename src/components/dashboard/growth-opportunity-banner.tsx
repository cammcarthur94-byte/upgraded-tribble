"use client";

import React from "react";
import Link from "next/link";
import { Lightbulb, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GrowthOpportunityBannerProps {
  copy?: string;
  tag?: string;
  taskId?: string;
  buttonText?: string;
  href?: string;
  onAction?: () => void;
}

export function GrowthOpportunityBanner({
  copy = "Reddit accounts for 35% of all AI citations for your brand, but your brand is only referenced in 1 of the 4 cited subreddits. Create an authoritative response guide to capture citations.",
  tag = "High-Priority Growth Opportunity",
  taskId,
  buttonText = "View Opportunity & Action Plan",
  href,
  onAction,
}: GrowthOpportunityBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white p-5 shadow-xs transition-all hover:border-indigo-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Side: Icon & Copy */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-indigo-100/80 text-indigo-800 border border-indigo-200/60">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                {tag}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed max-w-3xl">
              {copy}
            </p>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="shrink-0 flex items-center">
          {onAction ? (
            <Button
              onClick={onAction}
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 py-2 px-4 group transition-all cursor-pointer"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          ) : href ? (
            <Link href={href}>
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 py-2 px-4 group transition-all"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 py-2 px-4 group transition-all"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
