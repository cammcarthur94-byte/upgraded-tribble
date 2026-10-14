"use client";

import React from "react";
import { X, Download, Printer, CheckCircle2, ShieldCheck, Building2 } from "lucide-react";
import { InvoiceItem } from "./types";
import { Button } from "@/components/ui/button";

interface InvoiceModalProps {
  invoice: InvoiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  brandName?: string;
  billingEmail?: string;
}

export function InvoiceModal({
  invoice,
  isOpen,
  onClose,
  brandName = "Gymshark",
  billingEmail = "cam@recomnd.ai",
}: InvoiceModalProps) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate a downloadable text/html blob simulating an official PDF
    const content = `
RECOMND AI INC. - OFFICIAL TAX INVOICE
Invoice #: ${invoice.number}
Date: ${invoice.date}
Status: ${invoice.status.toUpperCase()}
Customer: ${brandName} (${billingEmail})
Description: ${invoice.description}
Amount Paid: $${invoice.amount.toFixed(2)} USD
Payment Method: Visa ending in 4242
Thank you for powering your Generative Engine Optimization with Recomnd.ai
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.number}_Recomnd.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 font-bold text-xs">
              PDF
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Invoice {invoice.number}
              </h3>
              <p className="text-xs text-slate-500">
                Issued on {invoice.date} • {brandName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 h-8 text-xs text-slate-700 hidden sm:inline-flex"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="gap-1.5 h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </Button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 overflow-y-auto space-y-8 print:p-0">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg tracking-tight">
                <span className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                  R
                </span>
                Recomnd AI Inc.
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                548 Market St, Suite 34291
                <br />
                San Francisco, CA 94104
                <br />
                EIN: 93-8472910 • support@recomnd.ai
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                PAID
              </span>
              <div className="text-xl font-bold tracking-tight text-slate-900 mt-2 font-mono">
                {invoice.number}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Date: <span className="font-medium text-slate-800">{invoice.date}</span>
              </p>
            </div>
          </div>

          {/* Bill To / Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Billed To
              </div>
              <div className="font-semibold text-slate-900 text-sm">
                {brandName} Ltd.
              </div>
              <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Attn: Cameron M.
                <br />
                Email: {billingEmail}
                <br />
                VAT / Tax ID: GB 294 8472 90
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Payment Details
              </div>
              <div className="text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">Payment Method:</span>
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                    💳 Visa •••• 4242
                  </span>
                </div>
                <div>
                  <span className="font-medium text-slate-900">Paid Date:</span> {invoice.date}
                </div>
                <div>
                  <span className="font-medium text-slate-900">Transaction ID:</span>{" "}
                  <span className="font-mono text-[11px] text-slate-500">
                    ch_3O7g91K82lQ912
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-center">Period</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3">
                    <div className="font-medium text-slate-900">
                      {invoice.description}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      300 Prompts • Daily Executions • All 4 AI Engines • AI Shopping Suite
                    </div>
                  </td>
                  <td className="py-3 text-center text-slate-600">
                    1 Month
                  </td>
                  <td className="py-3 text-center text-slate-600">
                    1
                  </td>
                  <td className="py-3 text-right font-medium text-slate-900 font-mono">
                    ${invoice.amount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono text-slate-800">
                  ${invoice.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Tax (0.00%)</span>
                <span className="font-mono text-slate-800">$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid</span>
                <span className="font-mono text-emerald-700">
                  ${invoice.amount.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center text-[11px] text-slate-500">
            Processed securely via Stripe Billing. Questions? Email{" "}
            <a href="mailto:billing@recomnd.ai" className="text-indigo-600 hover:underline">
              billing@recomnd.ai
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
