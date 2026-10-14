"use client";

import React, { useState } from "react";
import {
  Bell,
  TrendingDown,
  AlertTriangle,
  Mail,
  FileText,
  Sparkles,
  Check,
  ShieldAlert,
  Send,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationsTabProps {
  onShowToast: (msg: string) => void;
  brandName?: string;
}

export function NotificationsTab({
  onShowToast,
  brandName = "Gymshark",
}: NotificationsTabProps) {
  // Alert toggles state
  const [alerts, setAlerts] = useState({
    volatility: true,
    rankSteal: true,
    weeklyDigest: true,
    quotaSafeguards: true,
    engineUpdates: false,
  });

  // Channel toggles state
  const [channels, setChannels] = useState({
    email: true,
    slack: true,
    inApp: true,
  });

  const toggleAlert = (key: keyof typeof alerts, label: string) => {
    setAlerts((prev) => {
      const nextVal = !prev[key];
      onShowToast(`${label} ${nextVal ? "enabled" : "disabled"}`);
      return { ...prev, [key]: nextVal };
    });
  };

  const toggleChannel = (key: keyof typeof channels, label: string) => {
    setChannels((prev) => {
      const nextVal = !prev[key];
      onShowToast(`${label} notification channel ${nextVal ? "enabled" : "disabled"}`);
      return { ...prev, [key]: nextVal };
    });
  };

  const handleSendTestNotification = () => {
    onShowToast("Test notification sent to Slack (#geo-visibility-alerts) and cam@recomnd.ai!");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Channel Preferences */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                Notification Channels & Routing
              </h2>
              <p className="text-xs text-slate-500">
                Choose where real-time AEO alerts and weekly executive perception digests are delivered.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 flex-wrap text-xs">
            {/* Email Channel */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={channels.email}
                onChange={() => toggleChannel("email", "Email")}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-800">
                Email (cam@recomnd.ai, s.jenkins@gymshark.com)
              </span>
            </label>

            {/* Slack Channel */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={channels.slack}
                onChange={() => toggleChannel("slack", "Slack")}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-800">
                Slack (#geo-visibility-alerts)
              </span>
            </label>

            {/* In-App Channel */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={channels.inApp}
                onChange={() => toggleChannel("inApp", "In-App Banner")}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-800">In-App Alerts</span>
            </label>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSendTestNotification}
          className="h-9 px-3 text-xs border-slate-200 hover:bg-slate-50 text-slate-800 shrink-0 gap-1.5"
        >
          <Send className="w-3.5 h-3.5 text-slate-500" />
          Send Test Notification
        </Button>
      </div>

      {/* Alert Triggers List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Trigger Rules & Automated Safeguards
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Event-driven triggers that monitor model hallucinations, citation shifts, and competitor maneuvers.
          </p>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {/* Rule 1: Volatility */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  Algorithm Volatility & Sentiment Drop Alert
                </div>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Triggers when {brandName}&apos;s generative share of voice drops &gt;5% across any AI engine within a 24-hour cycle, or when brand sentiment flips negative.
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Routing: Slack + Email</span>
                  <span>•</span>
                  <span>Threshold: &gt;5.0% shift</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleAlert("volatility", "Algorithm Volatility Alert")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                alerts.volatility ? "bg-emerald-500" : "bg-slate-200"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  alerts.volatility ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Rule 2: Competitor Steals #1 Pick */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  Competitor Steals #1 Generative Pick
                </div>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Instant notification when Nike, Lululemon, Alo Yoga, or Vuori replaces {brandName} in the top-ranked recommendation slot for high-intent buyer prompts.
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Routing: Slack #geo-visibility-alerts</span>
                  <span>•</span>
                  <span>Real-time dispatch</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleAlert("rankSteal", "Competitor #1 Theft Alert")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                alerts.rankSteal ? "bg-emerald-500" : "bg-slate-200"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  alerts.rankSteal ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Rule 3: Weekly Executive Digest */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  Weekly Executive Generative Perception Digest
                </div>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Automated PDF briefing summarizing AEO scores, AI shopping shelf dominance, new competitor domain citations, and growth task progress.
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Schedule: Every Monday at 08:00 AM UTC</span>
                  <span>•</span>
                  <span>Format: PDF + Executive Email</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleAlert("weeklyDigest", "Weekly Executive Digest")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                alerts.weeklyDigest ? "bg-emerald-500" : "bg-slate-200"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  alerts.weeklyDigest ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Rule 4: Quota Safeguards */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  Monthly Quota & Engine Run Threshold Warnings
                </div>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Notifies workspace admins when monthly prompt runs cross 80% (28,800 runs) and 95% (34,200 runs) to ensure uninterrupted daily tracking.
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Routing: Billing email + Account Admins</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleAlert("quotaSafeguards", "Monthly Quota Warnings")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                alerts.quotaSafeguards ? "bg-emerald-500" : "bg-slate-200"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  alerts.quotaSafeguards ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Rule 5: New Engine Rollouts */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  New AI Engine & Model Architecture Announcements
                </div>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Be notified as soon as new search engines or models (e.g. Apple Intelligence, SearchGPT v2, Claude 3.7) are available for tracking in Recomnd.
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Routing: Email + In-App</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleAlert("engineUpdates", "New Engine Rollouts")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                alerts.engineUpdates ? "bg-emerald-500" : "bg-slate-200"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  alerts.engineUpdates ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
