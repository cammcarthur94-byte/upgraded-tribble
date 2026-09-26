# Recomnd - AI Visibility Tracking SaaS (GEO/AEO)

Recomnd is a B2B SaaS platform for Generative Engine Optimization (GEO) and AI Engine Optimization (AEO), enabling brands to audit, monitor, and optimize their visibility across conversational AI engines (ChatGPT, Copilot, Gemini, Claude, and Perplexity).

## Features Implemented

- **Next.js 14 App Router** with TypeScript and Tailwind CSS.
- **Database & Supabase Integration (Stage 1)**:
  - Prisma ORM schema modeling `User`, `Brand`, `Prompt`, and `PromptResult` with `jsonb` columns for engine responses and citation payloads.
  - Browser and Server Supabase clients with `@supabase/ssr` cookies management.
  - Prisma client singleton in `src/lib/prisma.ts`.
- **Global App Shell & Sidebar**:
  - Top Brand Selector dropdown supporting multiple brands (e.g. "Gymshark", "Nike", "Lululemon").
  - **Reports Section**: Brand insights, Prompt analysis, Citations, AI model insights.
  - **Tools Section**: Prompt management, Growth Opportunities.
  - **Admin / Workspace Section**: Brand Profile, Settings & Billing.
  - **Bottom Profile Card**: User card with name, email, "OWNER" badge, "Sign Out" button, and pulsating green "Live" status dot.
- **Main Content View**:
  - Responsive layout with fixed left sidebar and scrollable main canvas.
  - Header: "Brand Insights Overview" with muted subtitle dynamically bound to the selected brand.
  - 4 KPI metric cards: Share of Voice (`0.0%`), AI Sentiment (`0%`), Websites Citing You (`0`), and Best AI Platform (`—`).
  - 4 Empty-state audit cards for Share of Voice Trajectory, Top Cited Websites, Engine Performance, and Sentiment Distribution.

## Getting Started

### 1. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials and PostgreSQL connection string:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (Supabase pooled connection string)
- `DIRECT_URL` (Supabase direct connection string for migrations)

### 2. Database Migrations

Push the Prisma schema to your Supabase PostgreSQL database:

```bash
npx prisma db push
```

Or generate a migration:

```bash
npx prisma migrate dev --name init
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.
