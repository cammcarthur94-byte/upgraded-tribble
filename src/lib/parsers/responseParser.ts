import {
  BrandMentionData,
  CitationDomainData,
  ParsedResponseData,
  MentionPositionContext,
  DiscoveredCompetitorData,
} from "../types";

/**
 * Normalizes a URL or domain string into a clean lowercase root domain.
 * e.g., "https://www.gymshark.com/collections/leggings?ref=1" -> "gymshark.com"
 * e.g., "http://sub.reddit.com/r/fitness" -> "reddit.com"
 */
export function normalizeDomain(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";

  let urlString = rawUrl.trim();
  if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
    urlString = "https://" + urlString;
  }

  try {
    const parsed = new URL(urlString);
    let hostname = parsed.hostname.toLowerCase();

    // Strip leading www.
    if (hostname.startsWith("www.")) {
      hostname = hostname.slice(4);
    }

    // Strip standard port if present
    hostname = hostname.split(":")[0];

    // Extract root domain (e.g., sub.reddit.com -> reddit.com)
    const parts = hostname.split(".");
    if (parts.length > 2) {
      const secondToLast = parts[parts.length - 2];
      if (
        ["co", "com", "org", "gov", "edu", "net"].includes(secondToLast) &&
        parts.length > 3
      ) {
        return parts.slice(-3).join(".");
      }
      return parts.slice(-2).join(".");
    }

    return hostname;
  } catch {
    // Basic regex fallback if URL parsing fails
    const match = rawUrl.match(/(?:https?:\/\/)?(?:www\.)?([^\/\s:]+)/i);
    return match ? match[1].toLowerCase() : rawUrl.toLowerCase();
  }
}

/**
 * Checks if a citation domain matches the brand's owned root domain or exact URLs.
 */
export function isBrandDomain(
  citationDomain: string,
  brandDomain: string,
  exactUrls: string[] = []
): boolean {
  if (!citationDomain) return false;

  const cleanCitation = normalizeDomain(citationDomain);

  if (brandDomain) {
    const cleanBrand = normalizeDomain(brandDomain);
    if (cleanCitation === cleanBrand || cleanCitation.endsWith("." + cleanBrand)) {
      return true;
    }
  }

  for (const url of exactUrls) {
    const cleanExact = normalizeDomain(url);
    if (cleanExact && (cleanCitation === cleanExact || cleanCitation.endsWith("." + cleanExact))) {
      return true;
    }
  }

  return false;
}

/**
 * Extracts citations and links from markdown text and engine footnote citations.
 * Deduplicates by unique URL.
 */
export function extractCitationDomains(
  rawText: string,
  trackedBrandDomain: string,
  payloadCitations: string[] = [],
  exactUrls: string[] = []
): CitationDomainData[] {
  const urlMap = new Map<string, CitationDomainData>();

  if (!rawText) return [];

  // 1. Extract standard markdown links: [anchor](https://...)
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/gi;
  let mdMatch: RegExpExecArray | null;
  while ((mdMatch = markdownLinkRegex.exec(rawText)) !== null) {
    let url = mdMatch[2].trim().replace(/[.,;:)\]]+$/, "");
    if (url && !urlMap.has(url)) {
      const domain = normalizeDomain(url);
      urlMap.set(url, {
        url,
        domain,
        isBrandOwned: isBrandDomain(domain, trackedBrandDomain, exactUrls),
      });
    }
  }

  // 2. Extract raw HTTP/HTTPS URLs
  const rawUrlRegex = /https?:\/\/[^\s)\]>"',]+/gi;
  let urlMatch: RegExpExecArray | null;
  while ((urlMatch = rawUrlRegex.exec(rawText)) !== null) {
    let url = urlMatch[0].trim().replace(/[.,;:)\]]+$/, "");
    if (url && !urlMap.has(url)) {
      const domain = normalizeDomain(url);
      urlMap.set(url, {
        url,
        domain,
        isBrandOwned: isBrandDomain(domain, trackedBrandDomain, exactUrls),
      });
    }
  }

  // 3. Extract footnote annotations (e.g. [1], [2]) correlated to payloadCitations
  if (Array.isArray(payloadCitations) && payloadCitations.length > 0) {
    const footnoteRegex = /\[(\d+)\]/g;
    let fnMatch: RegExpExecArray | null;
    while ((fnMatch = footnoteRegex.exec(rawText)) !== null) {
      const index = parseInt(fnMatch[1], 10);
      // Footnote 1 maps to index 0
      if (index > 0 && index <= payloadCitations.length) {
        const url = payloadCitations[index - 1];
        if (url && typeof url === "string" && !urlMap.has(url)) {
          const domain = normalizeDomain(url);
          urlMap.set(url, {
            url,
            domain,
            isBrandOwned: isBrandDomain(domain, trackedBrandDomain, exactUrls),
          });
        }
      }
    }

    // Also include any payload citations that weren't explicitly footnoted in body text
    for (const url of payloadCitations) {
      if (url && typeof url === "string" && !urlMap.has(url)) {
        const domain = normalizeDomain(url);
        urlMap.set(url, {
          url,
          domain,
          isBrandOwned: isBrandDomain(domain, trackedBrandDomain, exactUrls),
        });
      }
    }
  }

  return Array.from(urlMap.values());
}

/**
 * Determines position context for an entity match based on surrounding text and markdown markers.
 */
function determinePositionContext(
  text: string,
  matchIndex: number
): MentionPositionContext {
  // Extract the line containing the match
  const textBefore = text.slice(0, matchIndex);
  const textAfter = text.slice(matchIndex);
  const lineStart = textBefore.lastIndexOf("\n") + 1;
  const lineEndRelative = textAfter.indexOf("\n");
  const lineEnd = lineEndRelative === -1 ? text.length : matchIndex + lineEndRelative;
  const line = text.slice(lineStart, lineEnd).trim();

  // Check for conclusion / summary markers in section headers or preceding text
  const lowerTextBefore = textBefore.toLowerCase();
  const lowerLine = line.toLowerCase();

  if (
    lowerLine.startsWith("in conclusion") ||
    lowerLine.startsWith("in summary") ||
    lowerLine.startsWith("overall") ||
    lowerLine.startsWith("to summarize") ||
    lowerTextBefore.includes("## conclusion") ||
    lowerTextBefore.includes("### conclusion") ||
    lowerTextBefore.includes("## summary") ||
    lowerTextBefore.includes("### summary") ||
    lowerTextBefore.includes("## final recommendation") ||
    lowerTextBefore.includes("### final recommendation")
  ) {
    return "conclusion";
  }

  // Check if it's the very first numbered recommendation (e.g. "1.", "# 1.", "1)")
  if (
    /^#*\s*1[\.\)]\s+/i.test(line) ||
    lowerLine.includes("top pick") ||
    lowerLine.includes("best overall") ||
    lowerLine.includes("# 1") ||
    lowerLine.includes("number one")
  ) {
    return "top_recommendation";
  }

  // Check if it's in a bullet list or subsequent numbered item (2., 3., etc.)
  if (
    /^[-*+]\s+/i.test(line) ||
    /^[2-9]\d*[\.\)]\s+/i.test(line)
  ) {
    return "bullet_list";
  }

  return "passing_mention";
}

/**
 * Excluded keywords and non-brand entities that should not be classified as competitors.
 */
const EXCLUDED_ENTITIES = new Set([
  // AI models & tech engines
  "chatgpt", "openai", "claude", "anthropic", "google", "gemini", "perplexity", "copilot", "microsoft",
  // Social, UGC & generic media
  "reddit", "youtube", "tiktok", "instagram", "facebook", "twitter", "quora", "medium", "discord", "pinterest",
  // Marketplaces & generic retailers
  "amazon", "ebay", "walmart", "target", "etsy", "aliexpress", "shopify",
  // Common publication/review outlets
  "nytimes", "forbes", "gq", "vogue", "runnersworld", "barbend", "wirecutter", "rtings", "tomsguide", "gearpatrol", "garagegymreviews", "healthline", "webmd", "wikipedia", "wsj",
  // Generic headings, categories and descriptors
  "overview", "summary", "conclusion", "final recommendation", "pros", "cons", "features", "price", "pricing",
  "quality", "performance", "durability", "fit", "sizing", "compression", "fabric", "material", "comfort", "design",
  "options", "value", "breathability", "workout", "training", "apparel", "clothing", "gear", "products", "items",
  "athletes", "runners", "lifters", "women", "men", "unisex", "alternative", "alternatives", "competitor", "competitors",
  "brand", "brands", "key highlights", "highlights", "top picks", "top pick", "best overall", "verdict", "recommendation",
  "recommendations", "note", "notes", "update", "faq", "faqs", "here", "several", "solid", "durable", "high",
  "features", "consider", "budget", "luxury", "review", "reviews", "based", "first", "second", "third", "key", "both",
  "these", "other", "many", "while", "though", "overall", "when", "with", "from"
]);

// Well-known commercial fitness, apparel, and SaaS brands frequently appearing in comparisons
const RECOGNIZED_BRANDS = [
  "Nike", "Lululemon", "Alo Yoga", "Under Armour", "Vuori", "Gym People", "Fabletics", "Athleta",
  "Sweaty Betty", "Puma", "Reebok", "Adidas", "New Balance", "Nobull", "Ten Thousand",
  "Born Primitive", "Alphalete", "YoungLA", "DFYNE", "AYBL", "NVGTN", "Oner Active",
  "Bo+Tee", "Set Active", "Beyond Yoga", "Outdoor Voices", "Champion", "Asics", "Brooks",
  "Hoka", "On Running", "Saucony", "Inov-8", "Rhone", "Tracksmith", "Bandier", "Girlfriend Collective"
];

/**
 * Derives a clean web domain for a competitor based on available citations or name slug.
 */
export function inferCompetitorDomain(
  entityName: string,
  citations: Array<{ domain: string } | string> = []
): string {
  const cleanSlug = entityName.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!cleanSlug) return "brand.com";

  // Check if any citation matches this entity name
  for (const item of citations) {
    const domain = typeof item === "string" ? normalizeDomain(item) : item.domain;
    if (domain) {
      const rootWithoutExt = domain.split(".")[0];
      if (rootWithoutExt.includes(cleanSlug) || cleanSlug.includes(rootWithoutExt)) {
        return domain;
      }
    }
  }

  return `${cleanSlug}.com`;
}

/**
 * Discovers unlisted competitor brands mentioned in AI responses that are not currently
 * tracked in the dashboard or database.
 */
export function discoverUnlistedCompetitors(
  rawText: string,
  brandName: string,
  aliases: string[] = [],
  knownCompetitors: string[] = [],
  citations: Array<{ domain: string } | string> = []
): DiscoveredCompetitorData[] {
  if (!rawText) return [];

  const discoveredMap = new Map<string, DiscoveredCompetitorData>();

  const brandLower = brandName.toLowerCase().trim();
  const aliasLowers = new Set(aliases.map((a) => a.toLowerCase().trim()));
  const knownCompLowers = new Set(knownCompetitors.map((c) => c.toLowerCase().trim()));

  const isInvalidCandidate = (name: string): boolean => {
    const lower = name.toLowerCase().trim();
    if (!lower || lower.length < 2) return true;
    if (lower === brandLower || aliasLowers.has(lower) || knownCompLowers.has(lower)) return true;
    if (EXCLUDED_ENTITIES.has(lower)) return true;

    // Reject if name starts with or equals the brand name or any alias
    if (lower.startsWith(brandLower) || Array.from(aliasLowers).some((a) => lower.startsWith(a))) {
      return true;
    }

    // Reject if name starts with any already known competitor (e.g. "Nike Dri" -> "Nike" already known)
    if (Array.from(knownCompLowers).some((c) => lower.startsWith(c) || c.startsWith(lower))) {
      return true;
    }

    // Reject if name starts with any already registered discovered brand (e.g. "Vuori Kore" when "Vuori" is registered)
    for (const key of discoveredMap.keys()) {
      if (lower.startsWith(key) || key.startsWith(lower)) {
        return true;
      }
    }

    // Check if name is part of brand (e.g. "Gym" for "Gymshark")
    if (brandLower.split(/\s+/).includes(lower)) return true;
    return false;
  };

  const registerCandidate = (candidateName: string) => {
    let name = candidateName.trim().replace(/^[\*\#\-\s\d\.\)\:]+|[\*\:\.\,\;\-\s]+$/g, "");
    if (!name) return;

    // Check if candidate starts with a known recognized brand (e.g. "Vuori Kore" -> "Vuori")
    for (const recognized of RECOGNIZED_BRANDS) {
      if (name.toLowerCase().startsWith(recognized.toLowerCase())) {
        name = recognized;
        break;
      }
    }

    if (isInvalidCandidate(name)) return;

    // Count appearances in text
    const escaped = escapeRegExp(name);
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    const matches = rawText.match(regex);
    const count = matches ? matches.length : 1;

    const lowerKey = name.toLowerCase();
    if (!discoveredMap.has(lowerKey)) {
      const domain = inferCompetitorDomain(name, citations);
      discoveredMap.set(lowerKey, { name, domain, mentionCount: count });
    }
  };

  // 1. Check for recognized industry brands appearing in the response
  for (const known of RECOGNIZED_BRANDS) {
    if (!isInvalidCandidate(known)) {
      const regex = new RegExp(`\\b${escapeRegExp(known)}\\b`, "gi");
      const match = regex.exec(rawText);
      if (match) {
        registerCandidate(known);
      }
    }
  }

  // 2. Scan structured markdown lists (numbered or bulleted recommendations)
  // e.g., "1. Vuori Kore Shorts:" or "2. Gym People:" or "- **Fabletics Oasis**:"
  const listRegex = /^[#\s]*(?:\d+[\.\)]|[-*•])\s+\**([A-Z][A-Za-z0-9&]+(?:\s+[A-Z][A-Za-z0-9&]+)?)(?:\s+[A-Za-z0-9]+)?\**(?:\s*[\:\-\–])/gm;
  let listMatch: RegExpExecArray | null;
  while ((listMatch = listRegex.exec(rawText)) !== null) {
    const candidate = listMatch[1];
    if (candidate) registerCandidate(candidate);
  }

  // 3. Scan comparison phrases
  // e.g., "vs Vuori", "versus Sweaty Betty", "alongside Nike and Vuori", "alternatives like Gym People"
  const comparisonRegex = /\b(?:vs\.?|versus|alongside|compared to|alternatives? like|brands? such as|brands? like|rivals? such as|competitors? like)\s+([A-Z][A-Za-z0-9&]+(?:\s+[A-Z][A-Za-z0-9&]+)?)(?:,\s*([A-Z][A-Za-z0-9&]+(?:\s+[A-Z][A-Za-z0-9&]+)?))?(?:,?\s*(?:and|or)\s+([A-Z][A-Za-z0-9&]+(?:\s+[A-Z][A-Za-z0-9&]+)?))?/gi;
  let compMatch: RegExpExecArray | null;
  while ((compMatch = comparisonRegex.exec(rawText)) !== null) {
    if (compMatch[1]) registerCandidate(compMatch[1]);
    if (compMatch[2]) registerCandidate(compMatch[2]);
    if (compMatch[3]) registerCandidate(compMatch[3]);
  }

  // 4. Scan citation domains: if an external commercial domain is cited and mentioned in text
  for (const item of citations) {
    const domain = typeof item === "string" ? normalizeDomain(item) : item.domain;
    if (domain) {
      const rootWithoutExt = domain.split(".")[0]?.toLowerCase();
      if (rootWithoutExt && !EXCLUDED_ENTITIES.has(rootWithoutExt) && rootWithoutExt.length > 2) {
        // Look for capitalized or word match in text
        const titleCased = rootWithoutExt.charAt(0).toUpperCase() + rootWithoutExt.slice(1);
        if (!isInvalidCandidate(titleCased)) {
          const domainRegex = new RegExp(`\\b${escapeRegExp(titleCased)}\\b`, "gi");
          if (domainRegex.test(rawText)) {
            registerCandidate(titleCased);
          }
        }
      }
    }
  }

  return Array.from(discoveredMap.values());
}

/**
 * Escapes regex special characters in a string.
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Scans raw AI text for the tracked brand and competitors, computing frequency,
 * position rank, and context categorization.
 */
export function extractBrandMentions(
  rawText: string,
  brandId: string = "",
  brandName: string,
  competitors: string[] = [],
  aliases: string[] = []
): BrandMentionData[] {
  if (!rawText || !brandName) return [];

  interface EntityCandidate {
    name: string;
    isCompetitor: boolean;
    isNewCompetitor?: boolean;
    firstIndex: number;
    count: number;
    context: MentionPositionContext;
  }

  const candidates: EntityCandidate[] = [];

  // 1. Process tracked brand (matches primary name or any aliases)
  const brandKeywords = [brandName, ...aliases].filter(Boolean);
  let firstBrandIndex = -1;
  let totalBrandMatches = 0;

  for (const keyword of brandKeywords) {
    const brandRegex = new RegExp(`\\b${escapeRegExp(keyword.trim())}\\b`, "gi");
    let bMatch: RegExpExecArray | null;
    while ((bMatch = brandRegex.exec(rawText)) !== null) {
      totalBrandMatches++;
      if (firstBrandIndex === -1 || (bMatch.index ?? 0) < firstBrandIndex) {
        firstBrandIndex = bMatch.index ?? 0;
      }
    }
  }

  if (totalBrandMatches > 0) {
    const context = determinePositionContext(rawText, firstBrandIndex);
    candidates.push({
      name: brandName,
      isCompetitor: false,
      firstIndex: firstBrandIndex,
      count: totalBrandMatches,
      context,
    });
  }

  // 2. Process competitors (deduplicating by name)
  const uniqueCompetitors = Array.from(
    new Set(competitors.filter((c) => c && c.trim().toLowerCase() !== brandName.toLowerCase()))
  );

  for (const competitor of uniqueCompetitors) {
    const compRegex = new RegExp(`\\b${escapeRegExp(competitor.trim())}\\b`, "gi");
    const compMatches: RegExpExecArray[] = [];
    let cMatch: RegExpExecArray | null;
    while ((cMatch = compRegex.exec(rawText)) !== null) {
      compMatches.push(cMatch);
    }

    if (compMatches.length > 0) {
      const firstIndex = compMatches[0].index ?? 0;
      const context = determinePositionContext(rawText, firstIndex);
      candidates.push({
        name: competitor.trim(),
        isCompetitor: true,
        firstIndex,
        count: compMatches.length,
        context,
      });
    }
  }

  // 3. Sort candidates by appearance offset (firstIndex) to establish position rank
  candidates.sort((a, b) => a.firstIndex - b.firstIndex);

  // 4. Map to BrandMentionData with positionRank (1-based)
  return candidates.map((candidate, idx) => ({
    brandId,
    entityName: candidate.name,
    isCompetitor: candidate.isCompetitor,
    isNewCompetitor: candidate.isNewCompetitor,
    mentionCount: candidate.count,
    positionRank: idx + 1,
    positionContext: candidate.context,
  }));
}

/**
 * Unified Parser function combining brand mentions and citation domain extractors.
 * Discovers any unlisted competitors mentioned in the response and includes them in mentions.
 */
export function parseAIResponse({
  rawText,
  brandId = "",
  brandName,
  brandDomain,
  competitors = [],
  aliases = [],
  exactUrls = [],
  payloadCitations = [],
}: {
  rawText: string;
  brandId?: string;
  brandName: string;
  brandDomain: string;
  competitors?: string[];
  aliases?: string[];
  exactUrls?: string[];
  payloadCitations?: string[];
}): ParsedResponseData {
  const citations = extractCitationDomains(rawText, brandDomain, payloadCitations, exactUrls);

  // 1. Discover any unlisted competitors mentioned in the AI response
  const discovered = discoverUnlistedCompetitors(
    rawText,
    brandName,
    aliases,
    competitors,
    citations
  );

  // 2. Combine pre-configured competitors with newly discovered competitors
  const allCompetitorNames = [
    ...competitors,
    ...discovered.map((d) => d.name),
  ];

  // 3. Extract mentions across tracked brand and all competitors
  const mentions = extractBrandMentions(
    rawText,
    brandId,
    brandName,
    allCompetitorNames,
    aliases
  );

  // 4. Flag newly discovered competitor mentions
  const discoveredNamesSet = new Set(discovered.map((d) => d.name.toLowerCase()));
  for (const mention of mentions) {
    if (mention.isCompetitor && discoveredNamesSet.has(mention.entityName.toLowerCase())) {
      mention.isNewCompetitor = true;
    }
  }

  return {
    mentions,
    citations,
    discoveredCompetitors: discovered,
  };
}
