export type TaskStatus =
  | "To Do"
  | "In Progress"
  | "Implemented"
  | "Dismissed";

export type TaskImpact = "High" | "Medium" | "Quick Win";

export type TaskCategory =
  | "Content Structure"
  | "Citations & PR"
  | "Sentiment & Perception"
  | "Schema & Technical";

export interface GrowthTaskItem {
  id: string;
  brandId: string;
  recommendationText: string;
  status: TaskStatus;
  impact: TaskImpact;
  category: TaskCategory;
  targetEngine: string;
  estimatedLift: string;
  effort?: "Low Effort" | "Medium Effort" | "High Effort" | string;
  implementedDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BeforeAfterPoint {
  dayOffset: number; // e.g. -7, -3, 0, +3, +7
  date: string;
  visibilityScore: number;
  isPostImplementation: boolean;
  brandMentions: number;
}

export interface TaskImpactData {
  taskId: string;
  implementedDate: string;
  preScore: number;
  postScore: number;
  deltaLift: number;
  trajectory: BeforeAfterPoint[];
  citationsGained: number;
}
