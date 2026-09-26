"use client";

import React, { useState } from "react";
import { Globe, Bot, Sparkles, BrainCircuit, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Normalizes a raw domain or URL string to a clean hostname for favicon fetching.
 */
export function extractCleanHostname(rawDomainOrUrl: string): string {
  if (!rawDomainOrUrl) return "";
  let clean = rawDomainOrUrl.trim().toLowerCase();
  clean = clean.replace(/^https?:\/\//, "").replace(/^www\./, "");
  clean = clean.split("/")[0].split("?")[0].split("#")[0];
  return clean;
}

/**
 * Returns Google's high-resolution favicon service URL for any given web property.
 */
export function getFaviconUrl(domainOrUrl: string, size: number = 64): string {
  const hostname = extractCleanHostname(domainOrUrl);
  if (!hostname) return "";
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    hostname
  )}&sz=${size}`;
}

export const ENGINE_DOMAINS: Record<string, string> = {
  chatgpt: "chatgpt.com",
  openai: "openai.com",
  claude: "claude.ai",
  anthropic: "anthropic.com",
  gemini: "gemini.google.com",
  google: "google.com",
  perplexity: "perplexity.ai",
  copilot: "copilot.microsoft.com",
  microsoft: "microsoft.com",
};

interface FaviconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  domain: string;
  size?: number;
  alt?: string;
  className?: string;
  fallbackText?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

/**
 * Renders an authentic website/source/brand favicon using Google's Favicon CDN
 * with a resilient fallback if offline or domain missing.
 */
export function Favicon({
  domain,
  size = 16,
  alt,
  className,
  fallbackText,
  rounded = "sm",
  ...props
}: FaviconProps) {
  const [hasError, setHasError] = useState(false);
  const cleanDomain = extractCleanHostname(domain);
  const faviconUrl = getFaviconUrl(cleanDomain, size > 32 ? 128 : 64);

  const roundedClasses = {
    sm: "rounded-xs",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded];

  if (!cleanDomain || hasError) {
    if (fallbackText) {
      return (
        <span
          className={cn(
            "inline-flex items-center justify-center font-bold text-[10px] uppercase bg-slate-100 text-slate-700 border border-slate-200 select-none shrink-0",
            roundedClasses,
            className
          )}
          style={{ width: size, height: size }}
          title={domain}
        >
          {fallbackText.charAt(0)}
        </span>
      );
    }
    return (
      <Globe
        className={cn("text-slate-400 shrink-0", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={faviconUrl}
      alt={alt || `${cleanDomain} favicon`}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setHasError(true)}
      className={cn("object-contain shrink-0", roundedClasses, className)}
      {...props}
    />
  );
}

interface EngineFaviconProps {
  engine: string;
  size?: number;
  className?: string;
}

// Crisp vector AI engine logos
function PerplexityLogo({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    >
      <rect width="24" height="24" rx="4" fill="#1b2529" />
      <path
        d="M12 4v16M5.5 7.5l13 9M18.5 7.5l-13 9M4 12h16"
        stroke="#20b8cd"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OpenAILogo({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={cn("text-[#10a37f] shrink-0", className)}
    >
      <path d="M22.28 10.13c-.15-.98-.61-1.88-1.32-2.56a5.53 5.53 0 0 0-4.66-1.37c-.36-.67-.88-1.23-1.52-1.63a5.57 5.57 0 0 0-5.83.18 5.6 5.6 0 0 0-3.32-.47c-1 .2-1.9.74-2.58 1.52A5.55 5.55 0 0 0 1.7 8.4c-.45.89-.58 1.9-.38 2.89a5.58 5.58 0 0 0 .54 4.88 5.57 5.57 0 0 0 3.33 2.1c.36.67.89 1.23 1.52 1.63a5.56 5.56 0 0 0 5.84-.18 5.6 5.6 0 0 0 3.32.47c1-.2 1.9-.74 2.58-1.52a5.55 5.55 0 0 0 1.35-2.6c.45-.89.58-1.9.38-2.89a5.58 5.58 0 0 0-.54-4.88c.03-.06.07-.11.1-.17zm-8.8 10.37a3.8 3.8 0 0 1-2.4-.85l.13-.08 4.2-2.42a.87.87 0 0 0 .43-.76v-5.91l1.78 1.03v4.88a3.82 3.82 0 0 1-4.14 4.11zm-8.4-3.64a3.8 3.8 0 0 1-.5-2.5l.13.08 4.2 2.42c.26.15.58.15.84 0l5.12-2.95v2.05l-4.23 2.44a3.82 3.82 0 0 1-5.56-1.54zm-1.54-7.53a3.8 3.8 0 0 1 1.9-1.64l-.01.15v4.85c0 .3.16.58.42.73l5.12 2.96-1.78 1.03-4.23-2.45a3.82 3.82 0 0 1-1.42-5.63zm13.48 2.05-5.12-2.96 1.78-1.02 4.23 2.44a3.82 3.82 0 0 1 1.42 5.63 3.8 3.8 0 0 1-1.9 1.64l.02-.15v-4.85a.86.86 0 0 0-.43-.73zm2.04-2.58-.13-.08-4.2-2.43a.85.85 0 0 0-.84 0l-5.12 2.96V6.78l4.23-2.44a3.82 3.82 0 0 1 5.56 1.54 3.8 3.8 0 0 1 .5 2.5zm-8.34-1.93-1.78-1.03v-4.88a3.82 3.82 0 0 1 6.54-3.26l-.13.08-4.2 2.42a.86.86 0 0 0-.43.76v5.91zm-1.07 2.15 2.4-1.39 2.4 1.39v2.77l-2.4 1.38-2.4-1.38v-2.77z" />
    </svg>
  );
}

function GeminiLogo({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="geminiGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1ba0e2" />
          <stop offset="0.5" stopColor="#9b72cb" />
          <stop offset="1" stopColor="#d96570" />
        </linearGradient>
      </defs>
      <path
        d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
        fill="url(#geminiGrad)"
      />
    </svg>
  );
}

function ClaudeLogo({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    >
      <rect width="24" height="24" rx="4" fill="#d97757" />
      <path
        d="M7 16.5L11.5 6h1L17 16.5h-1.8l-1.2-3H10l-1.2 3H7zm3.6-4.5h2.8L12 8.5h-.1l-1.3 3.5z"
        fill="#ffffff"
      />
    </svg>
  );
}

/**
 * Dedicated Favicon component for AI engines (ChatGPT, Claude, Gemini, Perplexity, Copilot)
 * Uses high-fidelity vector icons with official styling.
 */
export function EngineFavicon({
  engine,
  size = 18,
  className,
}: EngineFaviconProps) {
  const norm = engine.toLowerCase().trim();

  if (norm.includes("perplexity")) {
    return <PerplexityLogo size={size} className={className} />;
  }
  if (norm.includes("chatgpt") || norm.includes("openai")) {
    return <OpenAILogo size={size} className={className} />;
  }
  if (norm.includes("gemini") || norm.includes("google")) {
    return <GeminiLogo size={size} className={className} />;
  }
  if (norm.includes("claude") || norm.includes("anthropic")) {
    return <ClaudeLogo size={size} className={className} />;
  }

  return <Bot className={cn("text-slate-600", className)} style={{ width: size, height: size }} />;
}

interface BrandFaviconProps {
  brandName: string;
  domain?: string;
  size?: number;
  className?: string;
}

/**
 * Dedicated Brand / Competitor Favicon with letter fallback
 */
export function BrandFavicon({
  brandName,
  domain,
  size = 24,
  className,
}: BrandFaviconProps) {
  const firstLetter = brandName.charAt(0).toUpperCase() || "B";

  if (!domain) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center font-bold text-xs bg-slate-900 text-white rounded-lg select-none shrink-0",
          className
        )}
        style={{ width: size, height: size }}
      >
        {firstLetter}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden flex items-center justify-center bg-white border border-slate-200/90 shadow-2xs shrink-0 p-0.5",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Favicon
        domain={domain}
        size={size - 6}
        alt={`${brandName} icon`}
        fallbackText={firstLetter}
      />
    </div>
  );
}
