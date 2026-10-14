"use client";

import React, { useState } from "react";
import { X, Check, RefreshCw, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IntegrationSource } from "./types";

interface ConfigureIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: IntegrationSource | null;
  onSave: (updated: IntegrationSource) => void;
  onShowToast: (msg: string) => void;
}

export function ConfigureIntegrationModal({
  isOpen,
  onClose,
  integration,
  onSave,
  onShowToast,
}: ConfigureIntegrationModalProps) {
  const [slackChannel, setSlackChannel] = useState("#geo-visibility-alerts");
  const [alertThreshold, setAlertThreshold] = useState("5");
  const [linearApiKey, setLinearApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !integration) return null;

  const handleConnectOrSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      if (integration.id === "linear") {
        onSave({
          ...integration,
          status: "connected",
          target: "Linear (Gymshark Growth Team)",
          details: "Syncing Growth Opportunities directly into bi-weekly sprints",
          badgeText: "Active",
        });
        onShowToast("Linear workspace connected successfully!");
      } else if (integration.id === "slack") {
        onSave({
          ...integration,
          target: slackChannel,
          details: `Sending instant alerts on >${alertThreshold}% Algorithm Volatility & Rank #1 Drops`,
        });
        onShowToast(`Slack notifications configured to ${slackChannel}!`);
      } else if (integration.id === "shopify") {
        onSave({
          ...integration,
          lastSynced: "Just now",
          badgeText: "Synced just now",
        });
        onShowToast("Shopify product catalog catalog sync started (7,456 SKUs).");
      } else {
        onShowToast(`${integration.name} settings updated.`);
      }
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {integration.status === "connected"
                ? `Configure ${integration.name}`
                : `Connect ${integration.name}`}
            </h3>
            <p className="text-xs text-slate-500">
              {integration.category.toUpperCase()} • {integration.target}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleConnectOrSave} className="p-6 space-y-4 text-xs">
          {integration.id === "slack" && (
            <>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Destination Slack Channel
                </label>
                <input
                  type="text"
                  value={slackChannel}
                  onChange={(e) => setSlackChannel(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Alert Sensitivity Threshold
                </label>
                <select
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900 bg-white"
                >
                  <option value="3">&gt;3% Drop (High Sensitivity)</option>
                  <option value="5">&gt;5% Drop (Recommended Standard)</option>
                  <option value="10">&gt;10% Drop (Major Algorithmic Shifts Only)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-600">
                Connected via Slack Bot App (Recomnd Visibility Bot). Test message will be sent upon saving.
              </div>
            </>
          )}

          {integration.id === "shopify" && (
            <>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                Connected to store: <strong>gymshark-us.myshopify.com</strong>
                <br />
                7,456 Active Products Synced for AI Shopping Shelves.
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Feed Sync Frequency
                </label>
                <select className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900 bg-white">
                  <option>Every 6 hours (Automatic)</option>
                  <option>Daily at Midnight UTC</option>
                  <option>Manual Sync Only</option>
                </select>
              </div>
            </>
          )}

          {integration.id === "ga4" && (
            <>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  GA4 Measurement Property ID
                </label>
                <input
                  type="text"
                  defaultValue="G-84729184"
                  readOnly
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-mono"
                />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-600">
                AI Traffic filter is actively attributing sessions from <code>chatgpt.com</code>,{" "}
                <code>perplexity.ai</code>, <code>claude.ai</code>, and Google AI Overviews.
              </div>
            </>
          )}

          {integration.id === "gsc" && (
            <>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Google Search Console Property
                </label>
                <input
                  type="text"
                  defaultValue="sc-domain:gymshark.com"
                  readOnly
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-mono"
                />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-600">
                Correlating Generative AI Overview appearance rates with Organic CTR and Impressions.
              </div>
            </>
          )}

          {integration.id === "linear" && (
            <>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Linear Personal Access Token / API Key
                </label>
                <input
                  type="password"
                  required
                  value={linearApiKey}
                  onChange={(e) => setLinearApiKey(e.target.value)}
                  placeholder="lin_api_..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Default Team / Project
                </label>
                <input
                  type="text"
                  defaultValue="GYM-GROWTH (SEO & AEO Sprints)"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
              {isSubmitting
                ? "Saving..."
                : integration.status === "connected"
                ? "Save Settings"
                : "Authorize & Connect"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
