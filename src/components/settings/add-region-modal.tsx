"use client";

import React, { useState } from "react";
import { X, Globe, Check, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRegions: string[];
  onToggleRegion: (regionCode: string) => void;
}

const AVAILABLE_REGIONS = [
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    description: "Google AI Overviews (US-East / US-West), ChatGPT US, Perplexity US",
    includedInScale: true,
  },
  {
    code: "UK",
    name: "United Kingdom",
    flag: "🇬🇧",
    description: "London LLM endpoints, UK AI Shopping Carousels, Gymshark Home Market",
    includedInScale: true,
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    description: "Toronto & Montreal geo-targeted prompt scraping and localized currency",
    includedInScale: false,
    price: 99,
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    description: "Sydney region tracking, APAC AI Shopping shelves and seasonal search patterns",
    includedInScale: false,
    price: 99,
  },
  {
    code: "DE",
    name: "Germany (DACH)",
    flag: "🇩🇪",
    description: "German language LLM responses, local shopping queries, and EU regulatory index",
    includedInScale: false,
    price: 99,
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    description: "French AI Overviews, localized athleisure buyer intent and Paris market citations",
    includedInScale: false,
    price: 99,
  },
];

export function AddRegionModal({
  isOpen,
  onClose,
  activeRegions,
  onToggleRegion,
}: AddRegionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Global Geo-Location Tracking Pack
              </h3>
              <p className="text-xs text-slate-500">
                Monitor localized AI answers and regional shopping carousels
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

        {/* Region List */}
        <div className="p-6 space-y-3 overflow-y-auto max-h-[60vh]">
          {AVAILABLE_REGIONS.map((region) => {
            const isActive = activeRegions.includes(region.code);
            return (
              <div
                key={region.code}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  isActive
                    ? "border-emerald-300 bg-emerald-50/30 ring-1 ring-emerald-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 pr-3">
                  <span className="text-2xl shrink-0 mt-0.5">{region.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">
                        {region.name} ({region.code})
                      </span>
                      {region.includedInScale && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Included in Scale
                        </span>
                      )}
                      {!region.includedInScale && isActive && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          Active Add-On ($99/mo)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {region.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {region.includedInScale ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Active
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant={isActive ? "outline" : "default"}
                      onClick={() => onToggleRegion(region.code)}
                      className={`h-8 text-xs ${
                        isActive
                          ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Enabled
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Add (+$99/mo)
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <span>Active regions run daily alongside your baseline US/UK prompts</span>
          <Button size="sm" onClick={onClose} className="h-8 text-xs bg-slate-900 text-white">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
