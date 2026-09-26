/**
 * Product Image & Metadata Resolver
 * Resolves Open Graph (og:image) or canonical catalog thumbnails for cited products.
 */

// Curated canonical product imagery for AI Shopping product tiles
export const PRODUCT_IMAGE_REGISTRY: Record<string, string> = {
  // Gymshark Products
  "vital seamless 2.0 leggings":
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&auto=format&fit=crop&q=80",
  "adapt camo seamless leggings":
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80",
  'apex 5" running shorts':
    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&auto=format&fit=crop&q=80",
  "power oversized t-shirt":
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",

  // Competitor Products: Lululemon
  'align high-rise pant 28"':
    "https://images.unsplash.com/photo-1552196563-552349a2d810?w=500&auto=format&fit=crop&q=80",
  'pace breaker linerless short 7"':
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format&fit=crop&q=80",

  // Competitor Products: Nike
  "one dri-fit mid-rise leggings":
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80",
  'challenger 5" dri-fit shorts':
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&auto=format&fit=crop&q=80",

  // Competitor Products: Vuori
  "performance jogger & legging hybrid":
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80",
  'kore short 5"':
    "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=500&auto=format&fit=crop&q=80",
};

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
