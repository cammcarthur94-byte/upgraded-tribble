"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface InspectorOpenOptions {
  queryText?: string;
  engine?: string;
  promptId?: string;
}

interface InspectorContextType {
  isOpen: boolean;
  activeQuery: string;
  activeEngine: string;
  activePromptId?: string;
  openInspector: (options?: InspectorOpenOptions | string) => void;
  closeInspector: () => void;
}

const InspectorContext = createContext<InspectorContextType | undefined>(undefined);

export function InspectorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeQuery, setActiveQuery] = useState("best squat proof leggings for gym");
  const [activeEngine, setActiveEngine] = useState("perplexity");
  const [activePromptId, setActivePromptId] = useState<string | undefined>(undefined);

  const openInspector = (options?: InspectorOpenOptions | string) => {
    if (typeof options === "string") {
      setActiveQuery(options);
    } else if (options) {
      if (options.queryText) setActiveQuery(options.queryText);
      if (options.engine) setActiveEngine(options.engine.toLowerCase());
      if (options.promptId) setActivePromptId(options.promptId);
    }
    setIsOpen(true);
  };

  const closeInspector = () => {
    setIsOpen(false);
  };

  return (
    <InspectorContext.Provider
      value={{
        isOpen,
        activeQuery,
        activeEngine,
        activePromptId,
        openInspector,
        closeInspector,
      }}
    >
      {children}
    </InspectorContext.Provider>
  );
}

export function useInspector() {
  const context = useContext(InspectorContext);
  if (!context) {
    throw new Error("useInspector must be used within an InspectorProvider");
  }
  return context;
}
