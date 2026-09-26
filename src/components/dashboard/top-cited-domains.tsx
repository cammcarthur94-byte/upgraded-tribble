"use client";

import React, { useState } from "react";
import { DomainCitationItem, DomainTypeBreakdown } from "@/lib/types";
import { Globe, ShieldCheck, ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Favicon } from "@/components/ui/favicon";
import { CitationSourceDetailModal } from "@/components/dashboard/citation-source-detail-modal";

interface TopCitedDomainsProps {
  domains: DomainCitationItem[];
  breakdown?: DomainTypeBreakdown;
  brandName?: string;
}

export function TopCitedDomains({
  domains = [],
  breakdown,
  brandName = "Gymshark",
}: TopCitedDomainsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSource, setSelectedSource] = useState<DomainCitationItem | null>(null);
  const pageSize = 5;

  if (!domains || domains.length === 0) {
    return (
      <div className="h-[240px] flex flex-col items-center justify-center text-center p-4">
        <Globe className="w-8 h-8 text-slate-200 mb-2 stroke-1" />
        <p className="text-xs text-slate-400">No authority citation sources indexed yet.</p>
      </div>
    );
  }

  // Harmonized category configurations matching Domain Authority Donut Chart:
  // - UGC / Forums: Purple
  // - Editorial Press: Green
  // - Brand Owned: Blue
  // - Affiliate Reviews: Amber
  const getCategoryTheme = (category?: string, isBrandOwned?: boolean) => {
    const norm = (category || "").toLowerCase();
    if (isBrandOwned || norm.includes("owned")) {
      return {
        label: "Owned",
        barColor: "bg-sky-500",
        badgeClasses: "bg-slate-100 text-slate-600",
      };
    }
    if (norm.includes("ugc") || norm.includes("community") || norm.includes("forum")) {
      return {
        label: "Community / UGC",
        barColor: "bg-purple-500",
        badgeClasses: "bg-slate-100 text-slate-600",
      };
    }
    if (norm.includes("press") || norm.includes("editorial")) {
      return {
        label: "Editorial Press",
        barColor: "bg-emerald-500",
        badgeClasses: "bg-slate-100 text-slate-600",
      };
    }
    if (norm.includes("affiliate") || norm.includes("review")) {
      return {
        label: "Affiliate Review",
        barColor: "bg-amber-500",
        badgeClasses: "bg-slate-100 text-slate-600",
      };
    }
    return {
      label: category || "Authority",
      barColor: "bg-slate-400",
      badgeClasses: "bg-slate-100 text-slate-600",
    };
  };

  // Dynamic calculations from existing data
  const totalCitations = domains.reduce((sum, d) => sum + d.count, 0);
  const ownedCitations = domains.filter((d) => d.isBrandOwned).reduce((sum, d) => sum + d.count, 0);
  const thirdPartyCitations = totalCitations - ownedCitations;
  const thirdPartyPct = totalCitations > 0 ? Math.round((thirdPartyCitations / totalCitations) * 100) : 0;
  const ownedPct = totalCitations > 0 ? Math.round((ownedCitations / totalCitations) * 100) : 0;

  const defaultMockDomains: DomainCitationItem[] = [
    {
      domain: "reddit.com",
      count: 18,
      percentage: 35,
      category: "Community / UGC",
      isBrandOwned: false,
    },
    {
      domain: "gymshark.com",
      count: 14,
      percentage: 28,
      category: "Owned",
      isBrandOwned: true,
    },
    {
      domain: "womenshealthmag.com",
      count: 8,
      percentage: 16,
      category: "Editorial Press",
      isBrandOwned: false,
    },
    {
      domain: "runnersworld.com",
      count: 6,
      percentage: 12,
      category: "Editorial Press",
      isBrandOwned: false,
    },
  ];

  const activeDomains = domains && domains.length > 0
    ? domains.slice(0, 4)
    : defaultMockDomains;

  return (
    <div className="flex flex-col justify-between h-full py-1">
      {/* 4 Streamlined Rows with Divide-y matching reference image */}
      <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-around">
        {activeDomains.map((site, idx) => {
          const rank = idx + 1;
          const theme = getCategoryTheme(site.category, site.isBrandOwned);

          return (
            <div
              key={site.domain}
              onClick={() => setSelectedSource(site)}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-slate-50/50 rounded-lg px-1 transition-colors cursor-pointer group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedSource(site);
                }
              }}
              aria-label={`View details for ${site.domain}: ${site.count} citations, ${site.percentage}% share`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-normal text-slate-400 w-3 font-mono shrink-0">
                  {rank}
                </span>
                <Favicon
                  domain={site.domain}
                  size={16}
                  fallbackText={site.domain}
                  className="rounded-xs shrink-0"
                />
                <div className="inline-flex flex-col justify-center min-w-0">
                  <span className="text-sm font-medium text-slate-900 whitespace-nowrap leading-tight">
                    {site.domain}
                  </span>
                  <span className={`h-[3px] w-full rounded-full ${theme.barColor} mt-1`} />
                </div>
                <span className={`text-[10px] font-normal px-2 py-0.5 rounded shrink-0 ${theme.badgeClasses}`}>
                  {theme.label}
                </span>
              </div>

              <div className="flex items-center gap-2 text-right shrink-0 font-mono">
                <span className="text-sm font-bold text-slate-900">{site.count}</span>
                <span className="text-xs text-slate-400">{site.percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Detail Modal for clicked source */}
      <CitationSourceDetailModal
        isOpen={Boolean(selectedSource)}
        onClose={() => setSelectedSource(null)}
        source={selectedSource}
        totalCitations={totalCitations}
        brandName={brandName}
      />
    </div>
  );
}
