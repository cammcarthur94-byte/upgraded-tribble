"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard,
  Download,
  ExternalLink,
  Layers,
  Key,
  Users,
  Bell,
  Sparkles,
  CheckCircle2,
  X,
  Shield,
  HelpCircle,
  FileText,
} from "lucide-react";
import { useBrand } from "@/context/brand-context";
import { Button } from "@/components/ui/button";

import {
  BillingCycle,
  PlanId,
  PricingPlan,
  InvoiceItem,
  TeamMember,
  ApiKeyItem,
  IntegrationSource,
} from "@/components/settings/types";

import { BillingPlansTab } from "@/components/settings/billing-plans-tab";
import { IntegrationsApiTab } from "@/components/settings/integrations-api-tab";
import { TeamWorkspaceTab } from "@/components/settings/team-workspace-tab";
import { NotificationsTab } from "@/components/settings/notifications-tab";

// Modals
import { InvoiceModal } from "@/components/settings/invoice-modal";
import { StripePortalModal } from "@/components/settings/stripe-portal-modal";
import { PaymentMethodModal } from "@/components/settings/payment-method-modal";
import { PlanChangeModal } from "@/components/settings/plan-change-modal";
import { AddRegionModal } from "@/components/settings/add-region-modal";
import { AddWorkspaceModal } from "@/components/settings/add-workspace-modal";
import { InviteMemberModal } from "@/components/settings/invite-member-modal";
import { GenerateApiKeyModal } from "@/components/settings/generate-api-key-modal";
import { ConfigureIntegrationModal } from "@/components/settings/configure-integration-modal";

type TabId = "billing" | "integrations" | "team" | "notifications";

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentBrand } = useBrand();

  const brandName = currentBrand?.brandName || "Gymshark";

  // Tab State
  const [activeTab, setActiveTab] = useState<TabId>("billing");

  // Sync tab with URL
  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabId;
    if (
      tabParam &&
      ["billing", "integrations", "team", "notifications"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Plan & Billing State
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [activePlanId, setActivePlanId] = useState<PlanId>("scale");
  const [targetPlanForModal, setTargetPlanForModal] = useState<PricingPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Payment Method State
  const [cardInfo, setCardInfo] = useState({
    brand: "Visa",
    last4: "4242",
    expiry: "12/28",
    billingEmail: "cam@recomnd.ai",
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Modals state
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isAddRegionModalOpen, setIsAddRegionModalOpen] = useState(false);
  const [isAddWorkspaceModalOpen, setIsAddWorkspaceModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isGenerateKeyModalOpen, setIsGenerateKeyModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationSource | null>(null);
  const [isConfigureIntegrationOpen, setIsConfigureIntegrationOpen] = useState(false);

  // Add-Ons State
  const [activeRegions, setActiveRegions] = useState<string[]>(["US", "UK"]);
  const [extraPromptPacks, setExtraPromptPacks] = useState<number>(0);
  const [extraWorkspaces, setExtraWorkspaces] = useState<number>(0);

  // Team Members State
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "mem-1",
      name: "Cameron M.",
      email: "cam@recomnd.ai",
      role: "OWNER",
      title: "Organization Founder & CEO",
      status: "Active",
      joinedDate: "Jan 10, 2026",
      twoFactorEnabled: true,
    },
    {
      id: "mem-2",
      name: "Sarah Jenkins",
      email: "s.jenkins@gymshark.com",
      role: "Admin",
      title: "HEAD OF SEO & GEO",
      status: "Active",
      joinedDate: "Feb 1, 2026",
      twoFactorEnabled: true,
    },
    {
      id: "mem-3",
      name: "Marcus Vance",
      email: "m.vance@gymshark.com",
      role: "Editor",
      title: "DIGITAL PR LEAD",
      status: "Active",
      joinedDate: "Mar 15, 2026",
      twoFactorEnabled: true,
    },
  ]);

  // Integrations State
  const [integrations, setIntegrations] = useState<IntegrationSource[]>([
    {
      id: "shopify",
      name: "Shopify Product Catalog & Orders",
      category: "ecommerce",
      status: "connected",
      target: "Connected (gymshark-us.myshopify.com)",
      details: "Syncing 7,456 SKUs for AI Shopping Carousels",
      lastSynced: "12m ago",
      badgeText: "Synced 12m ago",
      iconName: "shopify",
    },
    {
      id: "ga4",
      name: "Google Analytics 4 (GA4)",
      category: "analytics",
      status: "connected",
      target: "G-84729184",
      details:
        "Tracking referral traffic & assisted conversions from chatgpt.com, perplexity.ai, gemini.google.com",
      badgeText: "Active",
      iconName: "ga4",
    },
    {
      id: "gsc",
      name: "Google Search Console",
      category: "search",
      status: "connected",
      target: "sc-domain:gymshark.com",
      details: "Correlating AI Overviews with organic CTR",
      badgeText: "Active",
      iconName: "gsc",
    },
    {
      id: "slack",
      name: "Slack Alerts (#geo-visibility-alerts)",
      category: "alerts",
      status: "connected",
      target: "#geo-visibility-alerts",
      details: "Sending instant alerts on >5% Algorithm Volatility & Rank #1 Drops",
      badgeText: "Active",
      iconName: "slack",
    },
    {
      id: "linear",
      name: "Linear / Jira Task Sync",
      category: "project_management",
      status: "not_connected",
      target: "Linear / Atlassian Jira",
      details: "Push Growth Opportunities directly to your engineering & content sprints",
      iconName: "linear",
    },
  ]);

  // API Keys State
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: "key-prod-1",
      name: "Production Telemetry Key",
      keyPrefix: "rcmnd_live_98a7f...3b21",
      fullKey: "rcmnd_live_98a7f49c0182479e932b21",
      createdAt: "Sep 1, 2026",
      lastUsedAt: "4m ago",
      scope: "Read/Write",
      environment: "production",
    },
  ]);

  // Invoices Latest Reference
  const latestInvoice: InvoiceItem = {
    id: "inv-10",
    number: "INV-2026-010",
    date: "Oct 14, 2026",
    description: "Scale (Commerce) Plan — Monthly",
    amount: 699.0,
    status: "paid",
  };

  // Action Handlers
  const handleOpenLatestInvoice = () => {
    setSelectedInvoice(latestInvoice);
    setIsInvoiceModalOpen(true);
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    setTargetPlanForModal(plan);
    setIsPlanModalOpen(true);
  };

  const handleConfirmPlanChange = (planId: string) => {
    if (planId === "enterprise") {
      showToast("Enterprise inquiry submitted. A GEO strategist will contact you within 2 hours.");
    } else {
      setActivePlanId(planId as PlanId);
      showToast(
        `Subscription successfully updated to ${
          planId === "starter" ? "Starter (Growth)" : planId === "pro" ? "Pro (Brand)" : "Scale (Commerce)"
        }!`
      );
    }
  };

  const handleToggleRegion = (code: string) => {
    if (code === "US" || code === "UK") {
      showToast("US and UK regions are included by default in your Scale plan.");
      return;
    }
    setActiveRegions((prev) => {
      const exists = prev.includes(code);
      const next = exists ? prev.filter((c) => c !== code) : [...prev, code];
      showToast(
        exists
          ? `Region ${code} removed from geo tracking.`
          : `Region ${code} added to geo tracking (+ $99 / mo).`
      );
      return next;
    });
  };

  const handleTogglePromptPack = () => {
    setExtraPromptPacks((prev) => {
      const next = prev > 0 ? 0 : 1;
      showToast(
        next > 0
          ? "Added Extra Daily Prompt Pack (+25 prompts / 3,000 monthly runs) for $49/mo!"
          : "Removed extra prompt pack from subscription."
      );
      return next;
    });
  };

  const handleAddWorkspace = (wsName: string, wsDomain: string) => {
    setExtraWorkspaces((prev) => prev + 1);
    showToast(`Workspace "${wsName}" (${wsDomain}) provisioned and isolated!`);
  };

  const handleInviteMember = (newMem: Omit<TeamMember, "id" | "joinedDate" | "twoFactorEnabled">) => {
    const member: TeamMember = {
      ...newMem,
      id: `mem-${Date.now()}`,
      joinedDate: "Today",
      twoFactorEnabled: true,
    };
    setMembers((prev) => [...prev, member]);
    showToast(`Invitation sent to ${member.email} with ${member.role} privileges!`);
  };

  const handleUpdateMemberRole = (
    memberId: string,
    newRole: "Admin" | "Editor" | "Viewer"
  ) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    showToast(`Member role updated to ${newRole}.`);
  };

  const handleRemoveMember = (memberId: string) => {
    const mem = members.find((m) => m.id === memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    showToast(`Removed ${mem?.name || "member"} from workspace.`);
  };

  const handleResendInvite = (member: TeamMember) => {
    showToast(`Invitation instructions resent to ${member.email}.`);
  };

  const handleAddApiKey = (newKey: ApiKeyItem) => {
    setApiKeys((prev) => [newKey, ...prev]);
    showToast(`Secret API Key "${newKey.name}" created!`);
  };

  const handleConfigureIntegration = (integration: IntegrationSource) => {
    setSelectedIntegration(integration);
    setIsConfigureIntegrationOpen(true);
  };

  const handleSaveIntegration = (updated: IntegrationSource) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  // Sub-navigation tabs definition
  const tabs = [
    {
      id: "billing" as const,
      label: "Billing & Plans",
      icon: CreditCard,
      badge: "Scale Active",
      badgeVariant: "emerald" as const,
    },
    {
      id: "integrations" as const,
      label: "Integrations & API",
      icon: Key,
      badge: "4 Active",
      badgeVariant: "slate" as const,
    },
    {
      id: "team" as const,
      label: "Team & Workspace",
      icon: Users,
      badge: "3 Seats",
      badgeVariant: "slate" as const,
    },
    {
      id: "notifications" as const,
      label: "Notifications & Alerts",
      icon: Bell,
      badge: undefined,
      badgeVariant: undefined,
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* PAGE HEADER & TOP ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Admin</span>
            <span>/</span>
            <span>Settings & Billing</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
              {brandName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Settings & Billing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage subscription tiers, prompt execution quotas, analytics integrations, and workspace members for{" "}
            <span className="font-semibold text-slate-800">{brandName}</span>.
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenLatestInvoice}
            className="h-9 px-3.5 text-xs border-slate-200 hover:bg-slate-50 text-slate-700 font-medium shadow-2xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Download Latest Invoice (PDF)
          </Button>

          <Button
            size="sm"
            onClick={() => setIsStripeModalOpen(true)}
            className="h-9 px-3.5 text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs gap-1.5"
          >
            Manage in Stripe ↗
          </Button>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="border-b border-slate-200/80">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-px" aria-label="Settings Sub-Navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`group inline-flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-indigo-600 text-indigo-700 font-semibold"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                      tab.badgeVariant === "emerald"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                        : "bg-slate-100 text-slate-600 border border-slate-200/70"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* TAB CONTENT VIEWS */}
      <div>
        {activeTab === "billing" && (
          <BillingPlansTab
            billingCycle={billingCycle}
            onBillingCycleChange={setBillingCycle}
            activePlanId={activePlanId}
            onSelectPlan={handleSelectPlan}
            cardInfo={cardInfo}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            onOpenAddRegionModal={() => setIsAddRegionModalOpen(true)}
            onOpenAddWorkspaceModal={() => setIsAddWorkspaceModalOpen(true)}
            onOpenInvoiceModal={(inv) => {
              setSelectedInvoice(inv);
              setIsInvoiceModalOpen(true);
            }}
            activeRegions={activeRegions}
            extraPromptPacks={extraPromptPacks}
            onTogglePromptPack={handleTogglePromptPack}
            extraWorkspaces={extraWorkspaces}
            onShowToast={showToast}
          />
        )}

        {activeTab === "integrations" && (
          <IntegrationsApiTab
            integrations={integrations}
            onConfigureIntegration={handleConfigureIntegration}
            apiKeys={apiKeys}
            onOpenGenerateKeyModal={() => setIsGenerateKeyModalOpen(true)}
            onShowToast={showToast}
          />
        )}

        {activeTab === "team" && (
          <TeamWorkspaceTab
            members={members}
            onOpenInviteModal={() => setIsInviteModalOpen(true)}
            onUpdateRole={handleUpdateMemberRole}
            onRemoveMember={handleRemoveMember}
            onResendInvite={handleResendInvite}
            brandName={brandName}
            seatsMax={10}
          />
        )}

        {activeTab === "notifications" && (
          <NotificationsTab
            onShowToast={showToast}
            brandName={brandName}
          />
        )}
      </div>

      {/* FLOATING TOAST FEEDBACK NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-2 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        brandName={brandName}
        billingEmail={cardInfo.billingEmail}
      />

      <StripePortalModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        brandName={brandName}
        billingEmail={cardInfo.billingEmail}
        onShowToast={showToast}
      />

      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        currentCard={cardInfo}
        onSave={(newCard) => {
          setCardInfo(newCard);
          showToast(`Default payment card updated to ${newCard.brand} ending in ${newCard.last4}!`);
        }}
      />

      <PlanChangeModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        targetPlan={targetPlanForModal}
        currentPlanName={
          activePlanId === "scale"
            ? "Scale (Commerce) Plan"
            : activePlanId === "pro"
            ? "Pro (Brand) Plan"
            : activePlanId === "starter"
            ? "Starter (Growth) Plan"
            : "Enterprise Plan"
        }
        isAnnual={billingCycle === "annual"}
        onConfirm={handleConfirmPlanChange}
      />

      <AddRegionModal
        isOpen={isAddRegionModalOpen}
        onClose={() => setIsAddRegionModalOpen(false)}
        activeRegions={activeRegions}
        onToggleRegion={handleToggleRegion}
      />

      <AddWorkspaceModal
        isOpen={isAddWorkspaceModalOpen}
        onClose={() => setIsAddWorkspaceModalOpen(false)}
        onAddWorkspace={handleAddWorkspace}
        workspacesUsed={1 + extraWorkspaces}
        workspacesMax={3 + extraWorkspaces}
      />

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteMember}
        brandName={brandName}
      />

      <GenerateApiKeyModal
        isOpen={isGenerateKeyModalOpen}
        onClose={() => setIsGenerateKeyModalOpen(false)}
        onCreated={handleAddApiKey}
      />

      <ConfigureIntegrationModal
        isOpen={isConfigureIntegrationOpen}
        onClose={() => setIsConfigureIntegrationOpen(false)}
        integration={selectedIntegration}
        onSave={handleSaveIntegration}
        onShowToast={showToast}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-500">Loading Settings & Billing...</div>}>
      <SettingsPageContent />
    </Suspense>
  );
}
