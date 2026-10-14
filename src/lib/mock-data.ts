import { UserProfile, BrandData, PromptItem } from "./types";
import { UNIFIED_USER_PROFILE, SYNCHRONIZED_PROMPTS_2026 } from "@/data/mockDataStore";

export const MOCK_USER: UserProfile = UNIFIED_USER_PROFILE;

export const MOCK_BRANDS: BrandData[] = [
  {
    id: "brand-1",
    userId: "user-1",
    brandName: "Gymshark",
    domain: "gymshark.com",
    aliases: ["Gym Shark", "Ben Francis", "Gymshark Lifting", "Gymshark Women"],
    exactUrls: ["gymshark.com", "rowing.gymshark.com", "support.gymshark.com"],
    competitors: ["Nike", "Lululemon", "Alo Yoga", "Under Armour"],
    competitorRecords: [
      { id: "comp-1-1", brandId: "brand-1", competitorName: "Nike", domain: "nike.com" },
      { id: "comp-1-2", brandId: "brand-1", competitorName: "Lululemon", domain: "lululemon.com" },
      { id: "comp-1-3", brandId: "brand-1", competitorName: "Alo Yoga", domain: "aloyoga.com" },
      { id: "comp-1-4", brandId: "brand-1", competitorName: "Under Armour", domain: "underarmour.com" },
    ],
  },
  {
    id: "brand-2",
    userId: "user-1",
    brandName: "Nike",
    domain: "nike.com",
    aliases: ["Nike Sportswear", "Nike Training", "Jordan", "Air Jordan"],
    exactUrls: ["nike.com", "jordan.com", "news.nike.com"],
    competitors: ["Adidas", "Puma", "Under Armour", "Gymshark"],
    competitorRecords: [
      { id: "comp-2-1", brandId: "brand-2", competitorName: "Adidas", domain: "adidas.com" },
      { id: "comp-2-2", brandId: "brand-2", competitorName: "Puma", domain: "puma.com" },
      { id: "comp-2-3", brandId: "brand-2", competitorName: "Under Armour", domain: "underarmour.com" },
      { id: "comp-2-4", brandId: "brand-2", competitorName: "Gymshark", domain: "gymshark.com" },
    ],
  },
  {
    id: "brand-3",
    userId: "user-1",
    brandName: "Lululemon",
    domain: "lululemon.com",
    aliases: ["Lululemon Athletica", "Align", "Scuba Hoodie"],
    exactUrls: ["lululemon.com", "shop.lululemon.com"],
    competitors: ["Alo Yoga", "Vuori", "Gymshark", "Athleta"],
    competitorRecords: [
      { id: "comp-3-1", brandId: "brand-3", competitorName: "Alo Yoga", domain: "aloyoga.com" },
      { id: "comp-3-2", brandId: "brand-3", competitorName: "Vuori", domain: "vuoriclothing.com" },
      { id: "comp-3-3", brandId: "brand-3", competitorName: "Gymshark", domain: "gymshark.com" },
      { id: "comp-3-4", brandId: "brand-3", competitorName: "Athleta", domain: "athleta.gap.com" },
    ],
  },
];

export const INITIAL_PROMPTS: PromptItem[] = SYNCHRONIZED_PROMPTS_2026;

