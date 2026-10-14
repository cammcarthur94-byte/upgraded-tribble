"use client";

import React, { useState } from "react";
import { X, Key, Copy, Check, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiKeyItem } from "./types";

interface GenerateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newKey: ApiKeyItem) => void;
}

export function GenerateApiKeyModal({
  isOpen,
  onClose,
  onCreated,
}: GenerateApiKeyModalProps) {
  const [name, setName] = useState("");
  const [scope, setScope] = useState<"Read/Write" | "Read-Only" | "Admin">("Read/Write");
  const [createdKey, setCreatedKey] = useState<ApiKeyItem | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Generate random mock key
    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const fullKey = `rcmnd_live_${randomHex}`;
    const keyPrefix = `${fullKey.slice(0, 15)}...${fullKey.slice(-4)}`;

    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: name.trim(),
      keyPrefix,
      fullKey,
      createdAt: "Just now",
      lastUsedAt: "Never",
      scope,
      environment: "production",
    };

    setCreatedKey(newKey);
    onCreated(newKey);
  };

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey.fullKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setCreatedKey(null);
    setName("");
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {createdKey ? "Secret API Key Generated" : "Generate Secret API Key"}
              </h3>
              <p className="text-xs text-slate-500">
                {createdKey
                  ? "Make sure to copy your key now. You won't be able to see it again."
                  : "Programmatic access to citations, model metrics, and shopping feeds"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {createdKey ? (
          <div className="p-6 space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Save this key in a secure location.</strong> For security purposes, this full
                token will never be displayed in plain text again.
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Generated Key Token ({createdKey.name})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdKey.fullKey}
                  className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 select-all"
                />
                <Button
                  size="sm"
                  onClick={handleCopy}
                  className="h-9 px-3 gap-1.5 shrink-0 bg-slate-900 text-white hover:bg-slate-800 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                size="sm"
                onClick={handleClose}
                className="h-9 text-xs bg-slate-900 text-white"
              >
                I Have Stored the Key Securely
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Key Label / Description
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CI/CD Pipeline, Zapier Integration, Contentful Webhook"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Permissions & Scope
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Read/Write", "Read-Only", "Admin"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScope(s)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      scope === s
                        ? "border-indigo-400 bg-indigo-50/40 text-indigo-900 ring-1 ring-indigo-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="font-semibold text-xs">{s}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {s === "Read/Write"
                        ? "Query & add prompts"
                        : s === "Read-Only"
                        ? "Telemetry exports"
                        : "Full management"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-9 text-xs bg-slate-900 hover:bg-slate-800 text-white"
              >
                Create API Key
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
