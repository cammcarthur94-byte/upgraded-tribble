"use client";

import React, { useState } from "react";
import { GrowthTaskItem, TaskStatus } from "@/lib/types/growth";
import { BeforeAfterImpactWidget } from "./before-after-impact-widget";
import {
  TrendingUp,
  Sparkles,
  ChevronRight,
  X,
  CheckCircle2,
  Clock,
  ListTodo,
  Code2,
  CheckSquare,
  Square,
  ArrowRight,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Favicon, EngineFavicon } from "@/components/ui/favicon";

interface GrowthTaskTableProps {
  tasks: GrowthTaskItem[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  brandId: string;
}

export function GrowthTaskTable({
  tasks,
  onStatusChange,
  brandId,
}: GrowthTaskTableProps) {
  const [selectedTaskForDrawer, setSelectedTaskForDrawer] =
    useState<GrowthTaskItem | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleChecklistStep = (key: string) => {
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "Implemented":
        return "bg-emerald-50 text-emerald-700 border-emerald-300";
      case "In Progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-300";
      case "To Do":
        return "bg-slate-100 text-slate-700 border-slate-300";
      case "Dismissed":
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  // Implementation guide checklist items tailored to task categories
  const getChecklistForTask = (task: GrowthTaskItem) => {
    switch (task.category) {
      case "Schema & Technical":
        return [
          "Validate JSON-LD structured schema on target product/editorial landing pages",
          "Ensure @context: 'https://schema.org' includes Brand, aggregateRating, and offers",
          "Test crawl accessibility with Google Rich Results Tester & Perplexity bot",
          "Deploy schema updates and request immediate AI engine re-indexing",
        ];
      case "Content Structure":
        return [
          "Restructure H2/H3 headings to match conversational user prompt syntax",
          "Add high-authority comparison matrices and bulleted spec tables",
          "Include direct factual answers within the first 120 words of key sections",
          "Audit internal anchor text distribution targeting high-volume AI queries",
        ];
      case "Citations & PR":
        return [
          "Identify unlinked brand mentions across top citing editorial domains",
          "Coordinate press release distribution to syndicated industry publications",
          "Seed verified product reviews onto Reddit (r/running, r/gym) and Trustpilot",
          "Verify domain authority score (DA 70+) of newly targeted referral partners",
        ];
      default:
        return [
          "Audit AI engine answers for inaccurate or outdated brand sentiment snippets",
          "Update customer FAQ documentation addressing highlighted perception gaps",
          "Publish counter-proof points or benchmark studies on verified owned domains",
          "Monitor sentiment trajectory changes over the next 14-day rolling window",
        ];
    }
  };

  return (
    <>
      {/* Linear-Style Card-Based Task Rows */}
      <div className="space-y-2.5">
        {tasks.map((task) => {
          const isImplemented = task.status === "Implemented";
          const isSelected = selectedTaskForDrawer?.id === task.id;

          return (
            <div
              key={task.id}
              onClick={() => setSelectedTaskForDrawer(task)}
              className={`bg-white rounded-xl border p-3.5 sm:px-5 sm:py-3.5 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer ${
                isSelected
                  ? "border-slate-400 ring-1 ring-slate-300 shadow-xs"
                  : "border-slate-200/60 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              {/* Left Group: Priority Impact Lift + Interactive Status Badge */}
              <div className="flex items-center gap-3 shrink-0">
                {/* 1. Estimated Lift Badge (Far-Left Priority Scanning) */}
                <div
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/80 shrink-0"
                  title="Estimated Visibility Lift"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{task.estimatedLift}</span>
                </div>

                {/* 2. Interactive Status Pill */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative inline-block"
                >
                  <select
                    value={task.status}
                    onChange={(e) => {
                      onStatusChange(task.id, e.target.value as TaskStatus);
                    }}
                    className={`text-xs font-semibold rounded-lg px-2.5 py-1 border cursor-pointer appearance-none pr-6 focus:outline-hidden text-center transition-colors ${getStatusBadge(
                      task.status
                    )}`}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Implemented">Implemented</option>
                    <option value="Dismissed">Dismissed</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Middle Group: Title & Meta Pills */}
              <div className="flex-1 min-w-0 px-0 sm:px-3">
                <div className="font-semibold text-slate-900 text-xs sm:text-sm leading-snug group-hover:text-indigo-600 transition-colors truncate">
                  {task.recommendationText}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="inline-flex items-center text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                    {task.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                    <EngineFavicon engine={task.targetEngine} size={11} />
                    <span>{task.targetEngine}</span>
                  </span>
                  {task.notes && (
                    <span className="text-[11px] text-slate-400 truncate max-w-xs hidden md:inline">
                      {task.notes}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Group: Action / Impact Badge + Drawer Chevron */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {isImplemented ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <Sparkles className="w-3 h-3" />
                    <span>Live Lift</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    {task.status === "In Progress" ? "In Progress" : "Pending"}
                  </span>
                )}

                <div className="w-7 h-7 rounded-lg border border-slate-200/70 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-100 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Slide-Out Preview Drawer */}
      {selectedTaskForDrawer && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
          onClick={() => setSelectedTaskForDrawer(null)}
        >
          <div
            className="w-full max-w-xl h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200/80 bg-slate-50/60 flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    {selectedTaskForDrawer.estimatedLift} Lift
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {selectedTaskForDrawer.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    <EngineFavicon
                      engine={selectedTaskForDrawer.targetEngine}
                      size={12}
                    />
                    <span>{selectedTaskForDrawer.targetEngine}</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedTaskForDrawer.recommendationText}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTaskForDrawer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                title="Close drawer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section 1: Overview & Strategic Rationale */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Strategic Rationale
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200/60 rounded-xl p-3.5">
                  {selectedTaskForDrawer.notes ||
                    "Optimizing this footprint attribute directly impacts the generative synthesis engine's authority score, elevating category recommendation frequency and prominence rank."}
                </p>
              </div>

              {/* Section 2: Actionable Implementation Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Implementation Checklist
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Click steps to complete
                  </span>
                </div>
                <div className="space-y-2">
                  {getChecklistForTask(selectedTaskForDrawer).map((step, idx) => {
                    const stepKey = `${selectedTaskForDrawer.id}-step-${idx}`;
                    const isChecked = completedSteps[stepKey] || false;

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleChecklistStep(stepKey)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? "bg-emerald-50/40 border-emerald-200 text-slate-500 line-through"
                            : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800"
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-slate-400 hover:text-slate-600 shrink-0"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <span className="text-xs font-medium leading-relaxed select-none">
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Recommended Prompt / Technical Snippet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Sample Prompt or Schema Snippet</span>
                  </h4>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 text-slate-200 font-mono text-xs overflow-x-auto shadow-2xs border border-slate-800">
                  <pre className="leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@type": "ProductGroup",
  "name": "${selectedTaskForDrawer.recommendationText.slice(0, 32)}...",
  "targetEngine": "${selectedTaskForDrawer.targetEngine}",
  "visibilityOptimization": {
    "estimatedLift": "${selectedTaskForDrawer.estimatedLift}",
    "status": "${selectedTaskForDrawer.status}"
  }
}`}
                  </pre>
                </div>
              </div>

              {/* Section 4: Before / After Impact Widget */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Impact Trajectory & Verification</span>
                </h4>
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
                  <BeforeAfterImpactWidget
                    brandId={brandId}
                    implementedDate={selectedTaskForDrawer.implementedDate}
                    taskTitle={selectedTaskForDrawer.recommendationText}
                  />
                </div>
              </div>
            </div>

            {/* Drawer Footer: Quick Status Actions */}
            <div className="p-4 border-t border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onStatusChange(selectedTaskForDrawer.id, "In Progress");
                    setSelectedTaskForDrawer((prev) =>
                      prev ? { ...prev, status: "In Progress" } : null
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    selectedTaskForDrawer.status === "In Progress"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Mark In Progress
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onStatusChange(selectedTaskForDrawer.id, "Implemented");
                    setSelectedTaskForDrawer((prev) =>
                      prev
                        ? {
                            ...prev,
                            status: "Implemented",
                            implementedDate: new Date().toISOString(),
                          }
                        : null
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    selectedTaskForDrawer.status === "Implemented"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Mark Implemented
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTaskForDrawer(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
