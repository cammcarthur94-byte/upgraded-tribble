export type BillingCycle = "monthly" | "annual";

export type PlanId = "starter" | "pro" | "scale" | "enterprise";

export interface PricingPlan {
  id: PlanId;
  name: string;
  badge?: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  isCurrent?: boolean;
  isPopular?: boolean;
  quotas: {
    workspaces: string;
    prompts: string;
    engines: string;
    competitors: string;
    referringDomains: string;
    dataRetention: string;
  };
  features: Array<{
    text: string;
    included: boolean;
  }>;
  ctaText: string;
  ctaVariant: "default" | "outline" | "active" | "dark";
}

export interface InvoiceItem {
  id: string;
  number: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  pdfUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "Admin" | "Editor" | "Viewer";
  title?: string;
  status: "Active" | "Pending" | "Suspended";
  joinedDate: string;
  twoFactorEnabled: boolean;
  avatarUrl?: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  fullKey: string;
  createdAt: string;
  lastUsedAt: string;
  scope: "Read/Write" | "Read-Only" | "Admin";
  environment: "production" | "sandbox";
}

export interface IntegrationSource {
  id: string;
  name: string;
  category: "ecommerce" | "analytics" | "search" | "alerts" | "project_management";
  status: "connected" | "not_connected" | "syncing" | "error";
  target: string;
  details: string;
  lastSynced?: string;
  badgeText?: string;
  iconName: string;
}

export interface GeoRegion {
  code: string;
  flag: string;
  name: string;
  includedInPlan?: boolean;
  isPurchased?: boolean;
  pricePerMonth?: number;
}
