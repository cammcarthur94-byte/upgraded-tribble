"use client";

import React, { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  helperText?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "brand";
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Type and press Enter...",
  helperText,
  badgeVariant = "brand",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (rawVal: string) => {
    const trimmed = rawVal.trim().replace(/^,+|,+$/g, "");
    if (!trimmed) return;

    // Prevent duplicate entries (case-insensitive check)
    const exists = tags.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, i) => i !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      e.preventDefault();
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      {/* Active Tags list */}
      <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl border border-slate-200/90 bg-slate-50/50">
        {tags.length === 0 && (
          <span className="text-xs text-slate-400 italic py-1 px-1">
            No items added yet. Type below and press Enter.
          </span>
        )}
        {tags.map((tag, idx) => (
          <Badge
            key={`${tag}-${idx}`}
            variant={badgeVariant}
            className="flex items-center gap-1.5 py-1 px-2.5 text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-2xs group"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-slate-400 hover:text-slate-700 transition-colors rounded-full p-0.5"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Input + Add button */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 text-xs sm:text-sm bg-white"
        />
        <button
          type="button"
          onClick={() => addTag(inputValue)}
          disabled={!inputValue.trim()}
          className="inline-flex items-center gap-1 px-3 py-2 h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-400 leading-normal">
          {helperText}
        </p>
      )}
    </div>
  );
}
