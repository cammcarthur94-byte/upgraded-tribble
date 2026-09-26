"use client";

import React, { useState } from "react";
import { Plus, Trash2, Globe, ShieldCheck, AlertCircle } from "lucide-react";
import { CompetitorItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Favicon } from "@/components/ui/favicon";

interface CompetitorListEditorProps {
  competitors: CompetitorItem[];
  onChange: (competitors: CompetitorItem[]) => void;
}

export function CompetitorListEditor({
  competitors,
  onChange,
}: CompetitorListEditorProps) {
  const [newCompName, setNewCompName] = useState("");
  const [newCompDomain, setNewCompDomain] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  // Helper to normalize domain input (e.g., https://www.nike.com/ -> nike.com)
  const cleanDomain = (raw: string) => {
    return raw
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];
  };

  const handleAddCompetitor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError(null);

    const name = newCompName.trim();
    const domain = cleanDomain(newCompDomain);

    if (!name) {
      setInputError("Please enter a competitor brand name.");
      return;
    }

    if (!domain) {
      setInputError("Please enter a competitor primary domain.");
      return;
    }

    // Check duplicate
    const exists = competitors.some(
      (c) =>
        c.competitorName.toLowerCase() === name.toLowerCase() ||
        c.domain.toLowerCase() === domain.toLowerCase()
    );

    if (exists) {
      setInputError("This competitor name or domain is already in your tracking list.");
      return;
    }

    const newEntry: CompetitorItem = {
      id: `temp-${Date.now()}`,
      brandId: "",
      competitorName: name,
      domain: domain,
    };

    onChange([...competitors, newEntry]);
    setNewCompName("");
    setNewCompDomain("");
  };

  const handleUpdateRow = (
    index: number,
    field: "competitorName" | "domain",
    value: string
  ) => {
    const updated = [...competitors];
    updated[index] = {
      ...updated[index],
      [field]: field === "domain" ? cleanDomain(value) : value,
    };
    onChange(updated);
  };

  const handleRemoveRow = (index: number) => {
    onChange(competitors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Quick Add Form Row */}
      <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70">
        <div className="text-xs font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>Add Direct Competitor</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          <div className="sm:col-span-2">
            <Input
              type="text"
              placeholder="e.g. Nike, Alo Yoga"
              value={newCompName}
              onChange={(e) => {
                setNewCompName(e.target.value);
                if (inputError) setInputError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCompetitor();
                }
              }}
              className="bg-white text-xs sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="e.g. nike.com, aloyoga.com"
                value={newCompDomain}
                onChange={(e) => {
                  setNewCompDomain(e.target.value);
                  if (inputError) setInputError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCompetitor();
                  }
                }}
                className="bg-white text-xs sm:text-sm pl-8"
              />
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="sm:col-span-1">
            <Button
              type="button"
              onClick={() => handleAddCompetitor()}
              className="w-full h-10 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white"
            >
              + Add
            </Button>
          </div>
        </div>

        {inputError && (
          <div className="flex items-center gap-1.5 text-rose-600 text-xs mt-2.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{inputError}</span>
          </div>
        )}
      </div>

      {/* Competitors Table or Empty State */}
      {competitors.length === 0 ? (
        <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 bg-white">
          <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">
            No competitors configured yet
          </p>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1">
            Add 2 to 5 direct competitors above to enable conversational Share of Voice (SoV) tracking and benchmark audits.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 px-4">#</th>
                <th className="py-2.5 px-4">Competitor Name</th>
                <th className="py-2.5 px-4">Domain</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {competitors.map((comp, idx) => (
                <tr
                  key={comp.id || idx}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px] w-10">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <Favicon
                        domain={comp.domain}
                        size={18}
                        fallbackText={comp.competitorName}
                        className="rounded-md border border-slate-200/80 p-0.5 bg-white shadow-2xs"
                      />
                      <input
                        type="text"
                        value={comp.competitorName}
                        onChange={(e) =>
                          handleUpdateRow(idx, "competitorName", e.target.value)
                        }
                        className="w-full bg-transparent px-2 py-1 rounded-md hover:bg-slate-100/80 focus:bg-white focus:ring-1 focus:ring-slate-300 font-medium text-slate-900 border-none outline-hidden"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Favicon
                        domain={comp.domain}
                        size={14}
                        fallbackText={comp.competitorName}
                        className="shrink-0"
                      />
                      <input
                        type="text"
                        value={comp.domain}
                        onChange={(e) =>
                          handleUpdateRow(idx, "domain", e.target.value)
                        }
                        className="w-full bg-transparent px-2 py-1 rounded-md hover:bg-slate-100/80 focus:bg-white focus:ring-1 focus:ring-slate-300 font-mono text-slate-600 border-none outline-hidden"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      aria-label={`Remove competitor ${comp.competitorName}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Callout */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          These competitors are actively matched against conversational responses from ChatGPT, Claude, Gemini, and Perplexity to calculate competitive Share of Voice, positioning ranks, and recommendation preference.
        </p>
      </div>
    </div>
  );
}
