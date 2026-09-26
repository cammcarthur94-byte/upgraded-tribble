"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/context/brand-context";
import {
  getGrowthTasksAction,
  updateTaskStatusAction,
} from "@/app/actions/growth-task-actions";
import { GrowthTaskItem, TaskStatus } from "@/lib/types/growth";
import { GrowthTaskTable } from "@/components/growth/growth-task-table";
import { GrowthKanbanBoard } from "@/components/growth/growth-kanban-board";
import {
  TrendingUp,
  Table as TableIcon,
  Kanban,
  CheckCircle2,
  Clock,
  Layers,
  RefreshCw,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GrowthOpportunitiesPage() {
  const { currentBrand } = useBrand();

  const [tasks, setTasks] = useState<GrowthTaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadTasks = () => {
    setIsLoading(true);
    getGrowthTasksAction(currentBrand.id)
      .then((data) => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load growth tasks:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadTasks();
  }, [currentBrand.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              implementedDate:
                newStatus === "Implemented"
                  ? new Date().toISOString()
                  : t.implementedDate,
            }
          : t
      )
    );

    const res = await updateTaskStatusAction(taskId, newStatus);
    if (res.success) {
      showToast(`Task moved to "${newStatus}"`);
    } else {
      showToast(res.error || "Failed to update task status");
      loadTasks(); // rollback on error
    }
  };

  // Metrics
  const totalTasks = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length;
  const implementedCount = tasks.filter((t) => t.status === "Implemented").length;
  const todoCount = tasks.filter((t) => t.status === "To Do").length;

  const filteredTasks =
    categoryFilter === "all"
      ? tasks
      : tasks.filter((t) => t.category === categoryFilter);

  const categories = [
    "all",
    "Content Structure",
    "Citations & PR",
    "Sentiment & Perception",
    "Schema & Technical",
  ];

  return (
    <div className="space-y-6">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Growth Opportunities & Task Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Prioritized GEO/AEO optimization tasks to improve visibility across AI search engines for{" "}
            <span className="font-semibold text-slate-700">{currentBrand?.brandName}</span>.
          </p>
        </div>

        {/* View Switcher: Table vs Kanban */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban View</span>
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadTasks}
            disabled={isLoading}
            className="h-9 px-3 rounded-xl border-slate-200 text-slate-700 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 text-slate-500 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Total Recommendations
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {totalTasks}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {todoCount} pending
            </span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Active In Progress
            </span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-indigo-600 tracking-tight">
              {inProgressCount}
            </span>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Deploying
            </span>
          </div>
        </div>

        {/* Implemented */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Implemented & Verified
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-600 tracking-tight">
              {implementedCount}
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Lift Tracked
            </span>
          </div>
        </div>

        {/* Estimated Impact Lift */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Avg. Visibility Lift
            </span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              +16.5%
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 mr-1.5">
          Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all capitalize shrink-0 cursor-pointer ${
              categoryFilter === cat
                ? "bg-slate-900 text-white shadow-2xs font-semibold"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat === "all" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      {/* Main Content Area: Table vs Kanban */}
      <div id="tasks-section" className="scroll-mt-6">
        {isLoading && tasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading growth tasks...</p>
          </div>
        ) : viewMode === "table" ? (
          <GrowthTaskTable
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            brandId={currentBrand.id}
          />
        ) : (
          <GrowthKanbanBoard
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            brandId={currentBrand.id}
          />
        )}
      </div>
    </div>
  );
}
