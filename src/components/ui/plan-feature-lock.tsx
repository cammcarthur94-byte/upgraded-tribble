"use client";

import React from "react";
import Link from "next/link";
import { Lock, Sparkles, ArrowRight, ShieldAlert, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/context/plan-context";
import { PlanId } from "@/components/settings/types";

interface PlanFeatureLockProps {
  requiredPlan: "pro" | "scale" | "enterprise";
  featureName: string;
  description: string;
  highlights?: string[];
  compact?: boolean;
}

export function PlanFeatureLock({
  requiredPlan,
  featureName,
  description,
  highlights = [],
  compact = false,
}: PlanFeatureLockProps) {
  const { activePlanId, setActivePlanId } = usePlan();

  const planDisplayName =
    requiredPlan === "pro"
      ? "Pro (Brand)"
      : requiredPlan === "scale"
      ? "Scale (Commerce)"
      : "Enterprise / Agency";

  const targetPlanPrice =
    requiredPlan === "pro" ? "$299 / mo" : requiredPlan === "scale" ? "$699 / mo" : "Custom";

  const handleInstantUpgrade = () => {
    setActivePlanId(requiredPlan);
  };

  if (compact) {
    return (
      <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 p-4 text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
          <Lock className="w-3 h-3" />
          <span>REQUIRES {planDisplayName.toUpperCase()}</span>
        </div>
        <p className="text-xs text-slate-600 max-w-md mx-auto">{description}</p>
        <div className="flex items-center justify-center gap-2">
          <Link href="/settings?tab=billing">
            <Button size="sm" className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-xs">
              Upgrade to {planDisplayName}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-indigo-100/80 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50/50 p-8 sm:p-12 text-center shadow-xs overflow-hidden">
      {/* Decorative background blur glow */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-12 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto space-y-4">
        {/* Lock Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-indigo-100 text-indigo-800 border border-indigo-200/80 shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-indigo-600" />
          <span>PLAN RESTRICTION • {planDisplayName.toUpperCase()}</span>
        </div>

        {/* Feature Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Unlock {featureName}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {description}
        </p>

        {/* Highlights Checklist */}
        {highlights.length > 0 && (
          <div className="pt-2 pb-2">
            <ul className="inline-flex flex-col gap-2 text-left text-xs text-slate-700 bg-white/80 p-4 rounded-xl border border-indigo-100 shadow-2xs">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/settings?tab=billing">
            <Button className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs gap-2 cursor-pointer">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Upgrade to {planDisplayName} ({targetPlanPrice})</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={handleInstantUpgrade}
            className="h-10 px-4 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl shadow-2xs cursor-pointer"
          >
            One-Click Preview Plan
          </Button>
        </div>

        <p className="text-[11px] text-slate-400 pt-1">
          Instant provisioning • No restart required • Pro-rated billing
        </p>
      </div>
    </div>
  );
}
