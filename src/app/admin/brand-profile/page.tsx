"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/context/brand-context";
import { updateBrandProfileAction } from "@/app/actions/brand-actions";
import { CompetitorItem, BrandData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TagInput } from "@/components/brand/tag-input";
import { CompetitorListEditor } from "@/components/brand/competitor-list-editor";
import { Favicon, BrandFavicon } from "@/components/ui/favicon";
import {
  Building2,
  Globe,
  Tag,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  Layers,
} from "lucide-react";

export default function BrandProfilePage() {
  const { currentBrand, updateActiveBrand } = useBrand();

  // Form State
  const [brandName, setBrandName] = useState("");
  const [domain, setDomain] = useState("");
  const [aliases, setAliases] = useState<string[]>([]);
  const [exactUrls, setExactUrls] = useState<string[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorItem[]>([]);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync state whenever currentBrand changes from context
  useEffect(() => {
    if (currentBrand) {
      setBrandName(currentBrand.brandName || "");
      setDomain(currentBrand.domain || "");
      setAliases(currentBrand.aliases || []);
      setExactUrls(
        currentBrand.exactUrls && currentBrand.exactUrls.length > 0
          ? currentBrand.exactUrls
          : [currentBrand.domain || ""]
      );

      // Populate competitor records if present, or generate from competitors string array
      if (
        currentBrand.competitorRecords &&
        currentBrand.competitorRecords.length > 0
      ) {
        setCompetitors(currentBrand.competitorRecords);
      } else if (
        currentBrand.competitors &&
        currentBrand.competitors.length > 0
      ) {
        setCompetitors(
          currentBrand.competitors.map((name, idx) => ({
            id: `comp-temp-${idx}`,
            brandId: currentBrand.id,
            competitorName: name,
            domain: `${name.toLowerCase().replace(/\s+/g, "")}.com`,
          }))
        );
      } else {
        setCompetitors([]);
      }
      setHasUnsavedChanges(false);
    }
  }, [currentBrand]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSaveChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!brandName.trim()) {
      showToast("Primary Brand Name cannot be empty.", "error");
      return;
    }

    if (!domain.trim()) {
      showToast("Primary Domain cannot be empty.", "error");
      return;
    }

    setIsSaving(true);

    try {
      const res = await updateBrandProfileAction({
        brandId: currentBrand.id,
        brandName,
        domain,
        aliases,
        exactUrls,
        competitors: competitors.map((c) => ({
          id: c.id,
          competitorName: c.competitorName,
          domain: c.domain,
        })),
      });

      if (res.success && res.data) {
        // Propagate update directly into global context
        updateActiveBrand(res.data);
        setHasUnsavedChanges(false);
        showToast("Brand profile & competitor rules saved successfully!");
      } else {
        showToast(res.error || "Failed to save brand profile.", "error");
      }
    } catch (err) {
      showToast("Unexpected error while saving changes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetForm = () => {
    if (currentBrand) {
      setBrandName(currentBrand.brandName || "");
      setDomain(currentBrand.domain || "");
      setAliases(currentBrand.aliases || []);
      setExactUrls(currentBrand.exactUrls || [currentBrand.domain]);
      setCompetitors(currentBrand.competitorRecords || []);
      setHasUnsavedChanges(false);
      showToast("Unsaved changes discarded.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Floating / Top Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium shadow-xl animate-in fade-in slide-in-from-top-2 text-white ${
            notification.type === "success" ? "bg-slate-900" : "bg-rose-600"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Brand Profile & Competitors
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure entity resolution, owned web properties, and direct competitors for{" "}
            <span className="font-semibold text-slate-700">{currentBrand?.brandName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {hasUnsavedChanges && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetForm}
              disabled={isSaving}
              className="text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
          )}

          <Button
            type="button"
            onClick={() => handleSaveChanges()}
            disabled={isSaving}
            className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveChanges();
        }}
        className="space-y-8"
      >
        {/* Section 1: Brand Identity */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                <BrandFavicon
                  domain={domain || currentBrand.domain}
                  brandName={brandName || currentBrand.brandName}
                  size={20}
                />
              </div>
              <CardTitle>Brand Identity & Entity Resolution</CardTitle>
            </div>
            <CardDescription>
              Define your core brand names, owned root domains, and alternate entity identifiers used by conversational models.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Name & Primary Domain Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="brandName">Primary Brand Name *</Label>
                <div className="relative">
                  <Input
                    id="brandName"
                    type="text"
                    value={brandName}
                    onChange={(e) => {
                      setBrandName(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="e.g. Gymshark, Google, Nike"
                    required
                    className="pl-9"
                  />
                  <div className="w-4 h-4 absolute left-3 top-3 pointer-events-none flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  The primary label used across dashboard leaderboards and prompt recommendations.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandDomain">Primary Web Domain *</Label>
                <div className="relative">
                  <Input
                    id="brandDomain"
                    type="text"
                    value={domain}
                    onChange={(e) => {
                      setDomain(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="e.g. gymshark.com, google.com"
                    required
                    className="pl-9"
                  />
                  <div className="w-4 h-4 absolute left-3 top-3 pointer-events-none flex items-center justify-center">
                    {domain && domain.trim().length > 3 ? (
                      <Favicon
                        domain={domain.trim()}
                        size={15}
                        fallbackText={brandName}
                      />
                    ) : (
                      <Globe className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Your primary official website address (protocol not required).
                </p>
              </div>
            </div>

            {/* Aliases Tag Input */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <span>Brand Aliases & Entity Keywords</span>
                </Label>
                <span className="text-[11px] text-slate-400">
                  {aliases.length} {aliases.length === 1 ? "alias" : "aliases"} added
                </span>
              </div>
              <TagInput
                tags={aliases}
                onChange={(newTags) => {
                  setAliases(newTags);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Add alternate spelling, key executive, or sub-brand (e.g. 'Alphabet', 'Sundar Pichai', 'Pixel')..."
                helperText="LLMs often refer to brands by executive leadership, parent entities, or flagship product lines. Our extraction parser credits mentions of these aliases to your brand score."
                badgeVariant="brand"
              />
            </div>

            {/* Owned Properties / exact_urls Tag Input */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Owned Web Properties & Exact URLs</span>
                </Label>
                <span className="text-[11px] text-slate-400">
                  {exactUrls.length} {exactUrls.length === 1 ? "domain" : "domains"} verified
                </span>
              </div>
              <TagInput
                tags={exactUrls}
                onChange={(newUrls) => {
                  setExactUrls(newUrls);
                  setHasUnsavedChanges(true);
                }}
                placeholder="e.g. rowing.gymshark.com, gymshark.co.uk, blog.gymshark.com..."
                helperText="Citations matching these owned domains are marked as first-party brand citations in citation breakdown reports rather than third-party references."
                badgeVariant="outline"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Competitor Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900">
                <Shield className="w-5 h-5 text-indigo-600" />
                <CardTitle>Competitor Management & Benchmarking</CardTitle>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {competitors.length} Active {competitors.length === 1 ? "Competitor" : "Competitors"}
              </span>
            </div>
            <CardDescription>
              Add direct industry competitors. Our post-execution engine monitors their visibility across LLMs to calculate your competitive Share of Voice (SoV).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompetitorListEditor
              competitors={competitors}
              onChange={(newComps) => {
                setCompetitors(newComps);
                setHasUnsavedChanges(true);
              }}
            />
          </CardContent>
        </Card>

        {/* Bottom Sticky Action Bar if changes pending */}
        {hasUnsavedChanges && (
          <div className="sticky bottom-6 z-20 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>You have unsaved changes to this brand profile.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Discard
              </button>
              <Button
                type="button"
                onClick={() => handleSaveChanges()}
                disabled={isSaving}
                className="text-xs font-semibold bg-white hover:bg-slate-100 text-slate-900 shadow-xs"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
