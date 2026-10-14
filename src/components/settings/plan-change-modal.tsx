"use client";

import React, { useState } from "react";
import { X, Check, AlertTriangle, ArrowRight, Sparkles, Shield, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingPlan } from "./types";

interface PlanChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlan: PricingPlan | null;
  currentPlanName: string;
  isAnnual: boolean;
  onConfirm: (planId: string) => void;
}

export function PlanChangeModal({
  isOpen,
  onClose,
  targetPlan,
  currentPlanName,
  isAnnual,
  onConfirm,
}: PlanChangeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [enterpriseNote, setEnterpriseNote] = useState("");

  if (!isOpen || !targetPlan) return null;

  const isEnterprise = targetPlan.id === "enterprise";
  const isDowngrade = targetPlan.id === "starter" || targetPlan.id === "pro";
  const price = isAnnual ? targetPlan.annualPrice : targetPlan.monthlyPrice;

  const handleAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirm(targetPlan.id);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isEnterprise
                  ? "bg-slate-900 text-white"
                  : isDowngrade
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {isEnterprise ? (
                <Building2 className="w-4 h-4" />
              ) : isDowngrade ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {isEnterprise
                  ? "Contact Enterprise Solutions"
                  : isDowngrade
                  ? `Switch to ${targetPlan.name}`
                  : `Upgrade to ${targetPlan.name}`}
              </h3>
              <p className="text-xs text-slate-500">
                Current Plan: <span className="font-medium text-slate-800">{currentPlanName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isEnterprise ? (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Recomnd Enterprise is tailored for global multi-brand groups, retail conglomerates,
                and agencies needing real-time prompt runs, custom LLM fine-tuning, and dedicated
                engineering support.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="font-semibold text-slate-800">
                  Included in Custom Enterprise:
                </div>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    10+ Isolated Brand Workspaces + White-Label PDF Reports
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Hourly Prompt Runs & Custom LLM API Endpoints
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Direct Snowflake / BigQuery Live Sync
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Dedicated Generative Strategist & SLA Guarantee
                  </li>
                </ul>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Tell us about your requirements
                </label>
                <textarea
                  rows={3}
                  value={enterpriseNote}
                  onChange={(e) => setEnterpriseNote(e.target.value)}
                  placeholder="e.g. Need 5 regional brand workspaces (US, UK, DE, FR, JP) and 2,000 daily tracked queries..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    {targetPlan.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    Billed {isAnnual ? "Annually" : "Monthly"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono text-slate-900">
                    ${price}
                    <span className="text-xs font-normal text-slate-500">/mo</span>
                  </div>
                  {isAnnual && (
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Save 20%
                    </span>
                  )}
                </div>
              </div>

              {isDowngrade ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Notice regarding downgrades
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Your current Scale (Commerce) features will remain active until the end of the billing period
                    on Nov 14, 2026. On renewal, prompt quota will adjust to {targetPlan.quotas.prompts} and
                    AI Shopping SKU tracking will be reduced.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-emerald-900 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Instant Plan Activation
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    New prompt quotas and model runs will be unlocked immediately. Your card on file
                    (Visa ending in 4242) will be billed a prorated difference.
                  </p>
                </div>
              )}

              <div className="space-y-1.5 pt-1">
                <div className="font-semibold text-slate-700">Included Quotas:</div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                  <div>• {targetPlan.quotas.workspaces}</div>
                  <div>• {targetPlan.quotas.prompts}</div>
                  <div>• {targetPlan.quotas.engines}</div>
                  <div>• {targetPlan.quotas.competitors}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isProcessing}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAction}
              disabled={isProcessing}
              className={`h-9 text-xs text-white ${
                isEnterprise
                  ? "bg-slate-900 hover:bg-slate-800"
                  : isDowngrade
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isProcessing
                ? "Processing..."
                : isEnterprise
                ? "Send Enterprise Request"
                : isDowngrade
                ? `Confirm Change to ${targetPlan.name}`
                : `Activate ${targetPlan.name}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
