/**
 * Product Image & Metadata Resolver
 * Resolves Open Graph (og:image) or canonical catalog thumbnails for cited products.
 */

export interface CanonicalProductItem {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  price?: string;
  matchPatterns: string[];
}

export const CANONICAL_PRODUCTS: CanonicalProductItem[] = [
  // Gymshark Products
  {
    id: "prod-vital-seamless",
    name: "Vital Seamless 2.0 Leggings",
    brand: "Gymshark",
    imageUrl:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&auto=format&fit=crop&q=80",
    price: "$54.00",
    matchPatterns: [
      "vital seamless 2.0 leggings",
      "vital seamless 2.0",
      "vital seamless",
      "vital seamless leggings",
      "gs-vit-20",
    ],
  },
  {
    id: "prod-adapt-camo",
    name: "Adapt Camo Seamless Leggings",
    brand: "Gymshark",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80",
    price: "$60.00",
    matchPatterns: [
      "adapt camo seamless leggings",
      "adapt camo seamless",
      "adapt camo",
      "camo seamless",
      "gs-adp-cmo",
    ],
  },
  {
    id: "prod-apex-shorts",
    name: 'Apex 5" Running Shorts',
    brand: "Gymshark",
    imageUrl:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&auto=format&fit=crop&q=80",
    price: "$44.00",
    matchPatterns: [
      'apex 5" running shorts',
      "apex 5 running shorts",
      "apex running shorts",
      'apex 5"',
      "gs-apx-05",
    ],
  },
  {
    id: "prod-power-oversized",
    name: "Power Oversized T-Shirt",
    brand: "Gymshark",
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
    price: "$38.00",
    matchPatterns: [
      "power oversized t-shirt",
      "power oversized tee",
      "power oversized",
      "gs-pwr-ovr",
    ],
  },
  {
    id: "prod-arrival-zip",
    name: "Arrival 1/4 Zip Pullover",
    brand: "Gymshark",
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80",
    price: "$42.00",
    matchPatterns: [
      "arrival 1/4 zip pullover",
      "arrival 1/4 zip",
      "arrival pullover",
      "arrival zip",
      "gs-arv-qtr",
    ],
  },

  // Lululemon Products
  {
    id: "prod-align-pant",
    name: 'Align High-Rise Pant 28"',
    brand: "Lululemon",
    imageUrl:
      "https://images.unsplash.com/photo-1552196563-552349a2d810?w=500&auto=format&fit=crop&q=80",
    price: "$98.00",
    matchPatterns: [
      'align high-rise pant 28"',
      "align high-rise pant",
      "align pant",
      "align high-rise",
      "align leggings",
      "lulu-aln-28",
    ],
  },
  {
    id: "prod-wunder-train",
    name: "Wunder Train High-Rise Tight",
    brand: "Lululemon",
    imageUrl:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&auto=format&fit=crop&q=80",
    price: "$98.00",
    matchPatterns: [
      "wunder train high-rise tight",
      "wunder train high-rise",
      "wunder train tight",
      "wunder train",
      "everlux",
    ],
  },
  {
    id: "prod-pace-breaker",
    name: 'Pace Breaker Linerless Short 7"',
    brand: "Lululemon",
    imageUrl:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format&fit=crop&q=80",
    price: "$68.00",
    matchPatterns: [
      'pace breaker linerless short 7"',
      "pace breaker linerless short",
      "pace breaker short",
      "pace breaker",
      "lulu-pcb-07",
    ],
  },
  {
    id: "prod-metal-vent",
    name: "Metal Vent Tech Short-Sleeve 2.0",
    brand: "Lululemon",
    imageUrl:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=80",
    price: "$78.00",
    matchPatterns: [
      "metal vent tech short-sleeve 2.0",
      "metal vent tech short-sleeve",
      "metal vent tech",
      "metal vent",
      "lulu-mvt-ss",
    ],
  },

  // Nike Products
  {
    id: "prod-nike-one",
    name: "One Dri-FIT Mid-Rise Leggings",
    brand: "Nike",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80",
    price: "$65.00",
    matchPatterns: [
      "one dri-fit mid-rise leggings",
      "one dri-fit mid-rise",
      "one dri-fit",
      "nike one dri-fit",
      "nike one leggings",
      "nike one",
      "nk-dr1-mid",
    ],
  },
  {
    id: "prod-nike-pro",
    name: "Nike Pro Dri-FIT Leggings",
    brand: "Nike",
    imageUrl:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500&auto=format&fit=crop&q=80",
    price: "$60.00",
    matchPatterns: [
      "nike pro dri-fit leggings",
      "nike pro dri-fit",
      "pro dri-fit",
      "nike pro",
    ],
  },
  {
    id: "prod-challenger-shorts",
    name: 'Challenger 5" Dri-FIT Shorts',
    brand: "Nike",
    imageUrl:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&auto=format&fit=crop&q=80",
    price: "$40.00",
    matchPatterns: [
      'challenger 5" dri-fit shorts',
      "challenger 5 dri-fit shorts",
      "challenger 5 shorts",
      "nike challenger",
      "nk-chl-05",
    ],
  },
  {
    id: "prod-legend-tee",
    name: "Dri-FIT Legend Fitness Tee",
    brand: "Nike",
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
    price: "$30.00",
    matchPatterns: [
      "dri-fit legend fitness tee",
      "dri-fit legend tee",
      "legend fitness tee",
      "nk-dr1-leg",
    ],
  },

  // Vuori Products
  {
    id: "prod-vuori-jogger",
    name: "Performance Jogger & Legging Hybrid",
    brand: "Vuori",
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80",
    price: "$94.00",
    matchPatterns: [
      "performance jogger & legging hybrid",
      "performance jogger",
      "vuori jogger",
      "dreamknit",
      "vr-prf-hyb",
    ],
  },
  {
    id: "prod-daily-legging",
    name: "Vuori Daily Legging",
    brand: "Vuori",
    imageUrl:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&auto=format&fit=crop&q=80",
    price: "$89.00",
    matchPatterns: [
      "vuori daily legging",
      "daily legging",
      "vuori daily",
    ],
  },
  {
    id: "prod-kore-short",
    name: 'Kore Short 5"',
    brand: "Vuori",
    imageUrl:
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=500&auto=format&fit=crop&q=80",
    price: "$68.00",
    matchPatterns: [
      'kore short 5"',
      "kore short",
      "vuori kore",
      "vr-kor-05",
    ],
  },

  // Alo Yoga Products
  {
    id: "prod-alo-airlift",
    name: "High-Waist Airlift Legging",
    brand: "Alo Yoga",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80",
    price: "$128.00",
    matchPatterns: [
      "high-waist airlift legging",
      "high-waist airlift",
      "alo yoga airlift",
      "alo airlift",
      "airlift legging",
      "airlift",
    ],
  },
];

// Curated lookup dictionary
export const PRODUCT_IMAGE_REGISTRY: Record<string, string> = {};
CANONICAL_PRODUCTS.forEach((prod) => {
  PRODUCT_IMAGE_REGISTRY[prod.name.toLowerCase().trim()] = prod.imageUrl;
  prod.matchPatterns.forEach((pat) => {
    PRODUCT_IMAGE_REGISTRY[pat.toLowerCase().trim()] = prod.imageUrl;
  });
});

/**
 * Returns a high-resolution product thumbnail matching product name
 */
export function getProductThumbnail(productName: string): string | undefined {
  if (!productName) return undefined;
  const key = productName.toLowerCase().trim();
  if (PRODUCT_IMAGE_REGISTRY[key]) {
    return PRODUCT_IMAGE_REGISTRY[key];
  }

  // Substring match
  for (const [k, url] of Object.entries(PRODUCT_IMAGE_REGISTRY)) {
    if (key.includes(k) || k.includes(key)) {
      return url;
    }
  }

  return undefined;
}

/**
 * Scans an AI response text (or collection of mentions) for recommended products
 * and returns all matched canonical items with their product name and image.
 */
export function findProductsInText(text: string): CanonicalProductItem[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matched: CanonicalProductItem[] = [];
  const seenIds = new Set<string>();

  for (const prod of CANONICAL_PRODUCTS) {
    if (seenIds.has(prod.id)) continue;
    for (const pat of prod.matchPatterns) {
      if (lower.includes(pat.toLowerCase())) {
        matched.push(prod);
        seenIds.add(prod.id);
        break;
      }
    }
  }

  return matched;
}

/**
 * Server-side Open Graph scraper to extract og:image from any cited landing page URL
 */
export async function scrapeOgImageFromUrl(url: string): Promise<string | null> {
  if (!url || !url.startsWith("http")) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml",
      },
    });

    clearTimeout(timeout);
    if (!response.ok) return null;

    const html = await response.text();

    // 1. Look for og:image
    const ogMatch = html.match(
      /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
    ) || html.match(
      /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i
    );
    if (ogMatch && ogMatch[1]) {
      return ogMatch[1];
    }

    // 2. Look for twitter:image
    const twitterMatch = html.match(
      /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i
    );
    if (twitterMatch && twitterMatch[1]) {
      return twitterMatch[1];
    }

    // 3. Look for schema.org Product JSON-LD
    const jsonLdMatches = html.matchAll(
      /<script\s+type=["']application\/ld\+json["']>([^<]+)<\/script>/gi
    );
    for (const match of jsonLdMatches) {
      try {
        const json = JSON.parse(match[1]);
        if (json["@type"] === "Product" && json.image) {
          const img = Array.isArray(json.image) ? json.image[0] : json.image;
          if (typeof img === "string") return img;
          if (img && typeof img.url === "string") return img.url;
        }
      } catch {
        // Continue
      }
    }

    return null;
  } catch (err) {
    return null;
  }
}
