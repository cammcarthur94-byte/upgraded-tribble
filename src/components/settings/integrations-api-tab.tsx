"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  BarChart3,
  Search,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Key,
  Code2,
  RefreshCw,
  Sliders,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import { Favicon } from "@/components/ui/favicon";
import { Button } from "@/components/ui/button";
import { IntegrationSource, ApiKeyItem } from "./types";

interface IntegrationsApiTabProps {
  integrations: IntegrationSource[];
  onConfigureIntegration: (integration: IntegrationSource) => void;
  apiKeys: ApiKeyItem[];
  onOpenGenerateKeyModal: () => void;
  onShowToast: (msg: string) => void;
}

export function IntegrationsApiTab({
  integrations,
  onConfigureIntegration,
  apiKeys,
  onOpenGenerateKeyModal,
  onShowToast,
}: IntegrationsApiTabProps) {
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [selectedSnippetTab, setSelectedSnippetTab] = useState<"curl" | "typescript">("curl");

  const toggleRevealKey = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyKey = (key: ApiKeyItem) => {
    navigator.clipboard.writeText(key.fullKey);
    setCopiedKeyId(key.id);
    onShowToast(`Copied ${key.name} to clipboard!`);
    setTimeout(() => {
      setCopiedKeyId(null);
    }, 2000);
  };

  const curlSnippet = `curl https://api.recomnd.ai/v1/telemetry/citations \\
  -H "Authorization: Bearer rcmnd_live_98a7f49c0182479e932b21" \\
  -H "Content-Type: application/json" \\
  -d '{"brandId": "gymshark", "timeframe": "30d"}'`;

  const tsSnippet = `import { RecomndClient } from "@recomnd/sdk";

const recomnd = new RecomndClient({
  apiKey: process.env.RECOMND_API_KEY, // rcmnd_live_...
});

const citations = await recomnd.citations.list({
  brandId: "gymshark",
  engines: ["chatgpt", "perplexity", "gemini", "claude"],
});`;

  return (
    <div className="space-y-8">
      {/* SECTION 1: Connected Integrations */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Connected Data Sources & Attribution Integrations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sync your commerce catalog, correlate search console impressions with AI Overviews, and attribute generative conversions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {integrations.map((item) => {
            const isConnected = item.status === "connected";

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isConnected
                    ? "border-slate-200/90 bg-white shadow-xs hover:border-slate-300"
                    : "border-dashed border-slate-300 bg-slate-50/50 hover:bg-white hover:border-slate-400"
                }`}
              >
                <div>
                  {/* Top Bar with Icon & Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                        {item.id === "shopify" && (
                          <Favicon domain="shopify.com" size={20} />
                        )}
                        {item.id === "ga4" && (
                          <Favicon domain="analytics.google.com" size={20} />
                        )}
                        {item.id === "gsc" && (
                          <Favicon domain="search.google.com" size={20} />
                        )}
                        {item.id === "slack" && (
                          <Favicon domain="slack.com" size={20} />
                        )}
                        {item.id === "linear" && (
                          <Favicon domain="linear.app" size={20} />
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          {item.name}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                          {item.target}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isConnected ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {item.badgeText || "Active"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                          Not Connected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description Details */}
                  <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                    {item.details}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {item.lastSynced ? `Sync: ${item.lastSynced}` : "OAuth 2.0 / API"}
                  </span>

                  {isConnected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onConfigureIntegration(item)}
                      className="h-8 text-xs border-slate-200 hover:bg-slate-50 text-slate-800"
                    >
                      Configure
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onConfigureIntegration(item)}
                      className="h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium"
                    >
                      Connect -&gt;
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Developer API Keys & Webhooks */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Developer API Keys
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authenticate requests to the Recomnd Telemetry REST API and stream generative citation data into your data warehouse.
            </p>
          </div>

          <Button
            size="sm"
            onClick={onOpenGenerateKeyModal}
            className="gap-1.5 h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            + Generate New Secret Key
          </Button>
        </div>

        {/* API Key Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Key Name</th>
                <th className="py-3 px-4">Token Value</th>
                <th className="py-3 px-4">Permissions</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Last Used</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {apiKeys.map((k) => {
                const isRevealed = revealedKeys[k.id];
                const isCopied = copiedKeyId === k.id;

                return (
                  <tr key={k.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-slate-400" />
                        <span>{k.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {isRevealed ? k.fullKey : k.keyPrefix}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                        {k.scope}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {k.createdAt}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {k.lastUsedAt}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleRevealKey(k.id)}
                          title={isRevealed ? "Mask Key" : "Reveal Key"}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          {isRevealed ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyKey(k)}
                          className="h-7 px-2.5 text-[11px] gap-1 font-medium border-slate-200"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              Copy Key
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quick Implementation Code Snippet */}
        <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-900 text-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200">
                Quick Start Code Example
              </span>
            </div>

            <div className="flex items-center p-0.5 bg-slate-800 rounded-lg text-[11px]">
              <button
                onClick={() => setSelectedSnippetTab("curl")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedSnippetTab === "curl"
                    ? "bg-slate-700 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setSelectedSnippetTab("typescript")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedSnippetTab === "typescript"
                    ? "bg-slate-700 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                TypeScript
              </button>
            </div>
          </div>

          <pre className="text-xs font-mono bg-slate-950 p-3.5 rounded-xl text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed">
            {selectedSnippetTab === "curl" ? curlSnippet : tsSnippet}
          </pre>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Official OpenAPI spec & Webhook docs: docs.recomnd.ai</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  selectedSnippetTab === "curl" ? curlSnippet : tsSnippet
                );
                onShowToast("Code snippet copied to clipboard!");
              }}
              className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline inline-flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              Copy Snippet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
