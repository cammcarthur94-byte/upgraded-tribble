"use client";

import React, { useState } from "react";
import { X, Layers, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWorkspace: (brandName: string, domain: string) => void;
  workspacesUsed: number;
  workspacesMax: number;
}

export function AddWorkspaceModal({
  isOpen,
  onClose,
  onAddWorkspace,
  workspacesUsed,
  workspacesMax,
}: AddWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onAddWorkspace(name.trim(), domain.trim());
      setName("");
      setDomain("");
      onClose();
    }, 500);
  };

  const hasSlotAvailable = workspacesUsed < workspacesMax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Add Brand Workspace
              </h3>
              <p className="text-xs text-slate-500">
                {hasSlotAvailable
                  ? `${workspacesMax - workspacesUsed} plan slot(s) available`
                  : "Additional Workspace Add-On (+$149 / mo)"}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Brand / Company Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gymshark Lifting or Aybl"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Primary Web Domain
            </label>
            <input
              type="text"
              required
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. aybl.com"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900"
            />
          </div>

          {!hasSlotAvailable ? (
            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-indigo-900">
              You are currently utilizing all {workspacesMax} included plan slots. Adding this workspace
              will attach the <strong>+$149 / month</strong> Brand Workspace add-on to your current billing cycle.
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
              ✓ Included in your Scale (Commerce) plan. No extra charge will be billed.
            </div>
          )}

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
              {isSubmitting ? "Provisioning..." : hasSlotAvailable ? "Create Workspace" : "Add & Subscribe (+$149/mo)"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
