"use client";

import React, { useState } from "react";
import { GrowthTaskItem, TaskStatus } from "@/lib/types/growth";
import { BeforeAfterImpactWidget } from "./before-after-impact-widget";
import {
  TrendingUp,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface GrowthKanbanBoardProps {
  tasks: GrowthTaskItem[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  brandId: string;
}

const COLUMNS: { status: TaskStatus; label: string; headerColor: string }[] = [
  { status: "To Do", label: "To Do", headerColor: "border-slate-300 text-slate-700 bg-slate-100" },
  { status: "In Progress", label: "In Progress", headerColor: "border-indigo-300 text-indigo-700 bg-indigo-50" },
  { status: "Implemented", label: "Implemented", headerColor: "border-emerald-300 text-emerald-800 bg-emerald-50" },
  { status: "Dismissed", label: "Dismissed", headerColor: "border-slate-200 text-slate-500 bg-slate-50" },
];

export function GrowthKanbanBoard({
  tasks,
  onStatusChange,
  brandId,
}: GrowthKanbanBoardProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const toggleExpand = (taskId: string) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "text-rose-600 bg-rose-50 border-rose-200";
      case "Medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className="flex flex-col rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 min-h-[480px] shadow-2xs"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {col.label}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${col.headerColor}`}
                >
                  {colTasks.length}
                </span>
              </div>
            </div>

            {/* Tasks in Column */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {colTasks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 italic">
                  No tasks in {col.label.toLowerCase()}
                </div>
              ) : (
                colTasks.map((task) => {
                  const isImplemented = task.status === "Implemented";
                  const isExpanded = expandedTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-all space-y-3"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getImpactColor(
                            task.impact
                          )}`}
                        >
                          {task.impact}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <TrendingUp className="w-3 h-3" />
                          <span>{task.estimatedLift}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                        {task.recommendationText}
                      </h4>

                      {/* Target Engine & Category */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>{task.category}</span>
                        <span className="font-medium text-slate-700">
                          {task.targetEngine}
                        </span>
                      </div>

                      {/* Footer Actions: Status Transition Selector */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                        <div className="relative flex-1">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              onStatusChange(task.id, e.target.value as TaskStatus)
                            }
                            className="w-full text-[11px] font-medium rounded-lg px-2 py-1 border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 cursor-pointer appearance-none pr-5 focus:outline-hidden"
                          >
                            <option value="To Do">Move to: To Do</option>
                            <option value="In Progress">Move to: In Progress</option>
                            <option value="Implemented">Move to: Implemented</option>
                            <option value="Dismissed">Move to: Dismissed</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
                        </div>

                        {/* View Impact Button on Implemented Cards */}
                        {isImplemented && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(task.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{isExpanded ? "Hide" : "Impact"}</span>
                          </button>
                        )}
                      </div>

                      {/* Inline Expanded Impact Analytics */}
                      {isExpanded && isImplemented && (
                        <div className="pt-2">
                          <BeforeAfterImpactWidget
                            brandId={brandId}
                            implementedDate={task.implementedDate}
                            taskTitle={task.recommendationText}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

