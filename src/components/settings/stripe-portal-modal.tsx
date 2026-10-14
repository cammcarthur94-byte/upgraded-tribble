"use client";

import React, { useState } from "react";
import { X, ExternalLink, CreditCard, Shield, Check, ArrowRight, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StripePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName?: string;
  billingEmail?: string;
  onShowToast: (msg: string) => void;
}

export function StripePortalModal({
  isOpen,
  onClose,
  brandName = "Gymshark",
  billingEmail = "cam@recomnd.ai",
  onShowToast,
}: StripePortalModalProps) {
  const [taxId, setTaxId] = useState("GB 294 8472 90");
  const [isUpdatingTax, setIsUpdatingTax] = useState(false);

  if (!isOpen) return null;

  const handleOpenStripeDirect = () => {
    window.open("https://billing.stripe.com/p/session/test_recomnd_portal", "_blank");
    onShowToast("Redirecting to Stripe Customer Portal...");
    onClose();
  };

  const handleSaveTax = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingTax(true);
    setTimeout(() => {
      setIsUpdatingTax(false);
      onShowToast("Tax ID and billing address successfully updated in Stripe.");
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Stripe Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center text-white font-black text-sm shadow-2xs">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Stripe Customer Portal
                </h3>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                  cus_98xLaP02194
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Self-service billing, VAT management, and invoice history
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Active Plan Card inside Stripe */}
          <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-900">
                  Scale (Commerce) Plan
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                $699.00 / month • Renews on Nov 14, 2026
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-900">
                Auto-Renew ON
              </span>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Default Payment Method
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold tracking-wider">
                  VISA
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Visa ending in 4242
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Expires 12/2028 • Billing email: {billingEmail}
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
          </div>

          {/* Tax ID & Billing Information */}
          <form onSubmit={handleSaveTax} className="space-y-3">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Tax ID & Billing Entity
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  defaultValue={`${brandName} Ltd.`}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-indigo-500 text-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">
                  VAT / Tax ID
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-indigo-500 text-slate-800"
                />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={isUpdatingTax}
                className="text-xs h-8"
              >
                {isUpdatingTax ? "Saving..." : "Update Tax Details"}
              </Button>
            </div>
          </form>

          {/* Direct Stripe Redirect Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Full PCI-DSS compliance hosted by Stripe Inc.</span>
            </div>
            <Button
              onClick={handleOpenStripeDirect}
              size="sm"
              className="h-8 gap-1 text-xs bg-[#635BFF] hover:bg-[#5349e4] text-white font-medium"
            >
              Open Full Stripe Portal
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
