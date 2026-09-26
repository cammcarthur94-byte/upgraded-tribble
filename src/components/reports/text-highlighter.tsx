"use client";

import React from "react";
import { BrandMentionData } from "@/lib/types";

interface TextHighlighterProps {
  rawText: string;
  mentions: BrandMentionData[];
  brandName: string;
}

export function TextHighlighter({ rawText, mentions, brandName }: TextHighlighterProps) {
  if (!rawText) return null;

  // Build a map of entity names to their mention details
  const entityMap = new Map<string, BrandMentionData>();
  for (const m of mentions) {
    entityMap.set(m.entityName.toLowerCase(), m);
  }

  // Create regex pattern to match any of the detected entities
  const entityNames = Array.from(entityMap.keys());
  if (entityNames.length === 0 && brandName) {
    entityNames.push(brandName.toLowerCase());
  }

  const escapedNames = entityNames
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  const pattern = new RegExp(`\\b(${escapedNames})\\b`, "gi");

  // Render text line-by-line to preserve markdown paragraph structure
  const lines = rawText.split("\n");

  return (
    <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Check if header
        const isH1 = line.startsWith("# ");
        const isH2 = line.startsWith("## ");
        const isH3 = line.startsWith("### ");
        const isBullet = line.startsWith("- ") || line.startsWith("* ");
        const isNumbered = /^\d+\.\s+/.test(line);

        let cleanLine = line;
        if (isH1) cleanLine = line.slice(2);
        else if (isH2) cleanLine = line.slice(3);
        else if (isH3) cleanLine = line.slice(4);

        // Highlight entities in the line
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        // Reset regex state
        pattern.lastIndex = 0;

        while ((match = pattern.exec(cleanLine)) !== null) {
          const matchStart = match.index;
          const matchedText = match[0];

          // Push text before match
          if (matchStart > lastIndex) {
            parts.push(cleanLine.substring(lastIndex, matchStart));
          }

          const entityData = entityMap.get(matchedText.toLowerCase());
          const isTrackedBrand =
            entityData ? !entityData.isCompetitor : matchedText.toLowerCase() === brandName.toLowerCase();
          const rank = entityData?.positionRank || 1;

          if (isTrackedBrand) {
            parts.push(
              <span
                key={`${lineIdx}-${matchStart}`}
                className="inline-flex items-center gap-1 mx-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold shadow-2xs"
              >
                <span>{matchedText}</span>
                <span className="text-[9px] font-bold bg-emerald-600 text-white rounded px-1 py-0.2 leading-none">
                  #{rank} Ranked
                </span>
              </span>
            );
          } else if (entityData?.isNewCompetitor) {
            parts.push(
              <span
                key={`${lineIdx}-${matchStart}`}
                className="inline-flex items-center gap-1 mx-0.5 px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-300 font-medium shadow-2xs"
              >
                <span>{matchedText}</span>
                <span className="text-[9px] font-bold bg-purple-600 text-white rounded px-1 py-0.2 leading-none">
                  #{rank} AI Discovered
                </span>
              </span>
            );
          } else {
            parts.push(
              <span
                key={`${lineIdx}-${matchStart}`}
                className="inline-flex items-center gap-1 mx-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-300 font-medium shadow-2xs"
              >
                <span>{matchedText}</span>
                <span className="text-[9px] font-bold bg-amber-600 text-white rounded px-1 py-0.2 leading-none">
                  #{rank} Ranked
                </span>
              </span>
            );
          }

          lastIndex = pattern.lastIndex;
        }

        // Push remainder of line
        if (lastIndex < cleanLine.length) {
          parts.push(cleanLine.substring(lastIndex));
        }

        if (isH1) {
          return (
            <h3 key={lineIdx} className="text-sm font-bold text-slate-900 mt-2">
              {parts}
            </h3>
          );
        }
        if (isH2 || isH3) {
          return (
            <h4 key={lineIdx} className="text-xs font-bold text-slate-900 mt-1.5">
              {parts}
            </h4>
          );
        }
        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2">
              <span className="text-slate-400 mt-0.5">•</span>
              <div className="flex-1">{parts}</div>
            </div>
          );
        }
        if (isNumbered) {
          return (
            <div key={lineIdx} className="flex items-start gap-1 pl-1 font-medium">
              <div>{parts}</div>
            </div>
          );
        }

        return <p key={lineIdx}>{parts}</p>;
      })}
    </div>
  );
}
