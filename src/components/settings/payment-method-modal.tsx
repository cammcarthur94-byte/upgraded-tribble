"use client";

import React, { useState } from "react";
import { X, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCard: {
    brand: string;
    last4: string;
    expiry: string;
    billingEmail: string;
  };
  onSave: (newCard: { brand: string; last4: string; expiry: string; billingEmail: string }) => void;
}

export function PaymentMethodModal({
  isOpen,
  onClose,
  currentCard,
  onSave,
}: PaymentMethodModalProps) {
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• " + currentCard.last4);
  const [cardHolder, setCardHolder] = useState("Cameron M.");
  const [expiry, setExpiry] = useState(currentCard.expiry);
  const [cvc, setCvc] = useState("•••");
  const [billingEmail, setBillingEmail] = useState(currentCard.billingEmail);
  const [postalCode, setPostalCode] = useState("94104");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Clean last 4
      const digits = cardNumber.replace(/\D/g, "");
      const last4 = digits.length >= 4 ? digits.slice(-4) : currentCard.last4;
      onSave({
        brand: "Visa",
        last4,
        expiry,
        billingEmail,
      });
      onClose();
    }, 500);
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
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Update Payment Method
              </h3>
              <p className="text-xs text-slate-500">
                Securely encrypted and stored via Stripe
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Cardholder Full Name
            </label>
            <input
              type="text"
              required
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900"
              placeholder="e.g. Cameron M."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900 font-mono"
                placeholder="4242 •••• •••• 4242"
              />
              <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-400">
                VISA / MC
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Expires
              </label>
              <input
                type="text"
                required
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900 font-mono"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                CVC
              </label>
              <input
                type="text"
                required
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900 font-mono"
                placeholder="123"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Postal Code
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900 font-mono"
                placeholder="94104"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Billing Email (Invoices & Receipts)
            </label>
            <input
              type="email"
              required
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900"
              placeholder="billing@gymshark.com"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Transactions are 256-bit SSL encrypted. No full card numbers are stored on Recomnd servers.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-9 text-xs bg-slate-900 hover:bg-slate-800 text-white"
            >
              {isSubmitting ? "Saving Card..." : "Save Payment Method"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
