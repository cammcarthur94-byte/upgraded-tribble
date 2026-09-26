import React from "react";
import { SupportedEngine } from "@/lib/types";
import { EngineFavicon } from "@/components/ui/favicon";

interface EngineBadgeProps {
  engine: SupportedEngine | string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function EngineBadge({
  engine,
  size = "sm",
  showLabel = false,
}: EngineBadgeProps) {
  const configs: Record<
    string,
    { label: string; badgeClasses: string }
  > = {
    chatgpt: {
      label: "ChatGPT",
      badgeClasses: "bg-emerald-50/90 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/90",
    },
    claude: {
      label: "Claude",
      badgeClasses: "bg-amber-50/90 text-amber-700 border-amber-200/80 hover:bg-amber-100/90",
    },
    gemini: {
      label: "Gemini",
      badgeClasses: "bg-blue-50/90 text-blue-700 border-blue-200/80 hover:bg-blue-100/90",
    },
    perplexity: {
      label: "Perplexity",
      badgeClasses: "bg-cyan-50/90 text-cyan-700 border-cyan-200/80 hover:bg-cyan-100/90",
    },
    copilot: {
      label: "Copilot",
      badgeClasses: "bg-indigo-50/90 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100/90",
    },
  };

  const config = configs[engine.toLowerCase()] || {
    label: engine,
    badgeClasses: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26,
  };

  const iconSize = iconSizes[size] || 18;

  if (!showLabel) {
    const boxSizeClasses = {
      sm: "w-8 h-8 rounded-xl",
      md: "w-9 h-9 rounded-xl",
      lg: "w-10 h-10 rounded-2xl",
    }[size] || "w-8 h-8 rounded-xl";

    return (
      <span
        title={config.label}
        className={`inline-flex items-center justify-center border shadow-2xs transition-all hover:scale-105 select-none shrink-0 ${boxSizeClasses} ${config.badgeClasses}`}
      >
        <EngineFavicon engine={engine} size={iconSize} />
      </span>
    );
  }

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2.5 py-1 gap-2"
      : size === "lg"
      ? "text-sm px-3.5 py-1.5 gap-2.5"
      : "text-xs px-3 py-1 gap-2";

  return (
    <span
      title={config.label}
      className={`inline-flex items-center font-medium rounded-lg border ${config.badgeClasses} ${sizeClasses} shadow-2xs transition-colors select-none`}
    >
      <EngineFavicon engine={engine} size={iconSize} />
      <span>{config.label}</span>
    </span>
  );
}
