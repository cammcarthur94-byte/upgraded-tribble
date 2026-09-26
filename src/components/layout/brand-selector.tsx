"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Building2, Plus, Sparkles } from "lucide-react";
import { BrandData } from "@/lib/types";
import { BrandFavicon } from "@/components/ui/favicon";
import Link from "next/link";

interface BrandSelectorProps {
  brands: BrandData[];
  selectedBrand?: BrandData;
  onSelectBrand: (brand: BrandData) => void;
  isCollapsed?: boolean;
}

export function BrandSelector({
  brands,
  selectedBrand,
  onSelectBrand,
  isCollapsed = false,
}: BrandSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const brandName = selectedBrand?.brandName || "Select Brand";
  const brandDomain = selectedBrand?.domain || "";

  return (
    <div className="relative">
      {isCollapsed ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-2xs group"
          title={`${brandName} (${brandDomain})`}
          aria-expanded={isOpen}
        >
          <BrandFavicon
            brandName={brandName}
            domain={brandDomain}
            size={24}
          />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left shadow-2xs group"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3 min-w-0">
            <BrandFavicon
              brandName={brandName}
              domain={brandDomain}
              size={32}
            />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm text-slate-900 truncate">
                {brandName}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {brandDomain || "No domain"}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-1.5 ${
              isOpen ? "rotate-180 text-slate-700" : "group-hover:text-slate-600"
            }`}
          />
        </button>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute z-50 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 overflow-hidden animate-in fade-in ${
              isCollapsed
                ? "top-0 left-full ml-3 w-64 slide-in-from-left-1"
                : "top-full left-0 right-0 mt-1.5 slide-in-from-top-1"
            }`}
          >
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
              <span>Workspaces</span>
              <span className="font-mono text-[10px] text-slate-400 font-normal">
                {brands.length} {brands.length === 1 ? "Brand" : "Brands"}
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
              {brands.map((brand) => {
                const isSelected = selectedBrand && brand.id === selectedBrand.id;
                return (
                  <button
                    key={brand.id}
                    onClick={() => {
                      onSelectBrand(brand);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors ${
                      isSelected
                        ? "bg-slate-50/90 font-medium text-slate-900"
                        : "text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <BrandFavicon
                        brandName={brand.brandName}
                        domain={brand.domain}
                        size={24}
                      />
                      <div className="truncate">
                        <div className="truncate leading-none text-xs font-semibold text-slate-900">
                          {brand.brandName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 truncate">
                          {brand.domain}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom: Configure & Add Brand Links */}
            <div className="pt-1.5 mt-1 border-t border-slate-100 px-1.5 space-y-0.5">
              <Link
                href="/admin/brand-profile"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Manage Brand Profile</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
