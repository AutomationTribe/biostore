# Claude Code Setup Prompt
## Link-in-bio & Digital Storefront — Modular Monolith

Paste the entire contents of this file into Claude Code to scaffold the project.

---

## PROMPT

You are a senior software architect. Scaffold a production-ready Next.js 14 application called **BioStore** — a link-in-bio platform with a built-in digital product storefront targeting African creators.

### Architecture rules (follow strictly)
- Modular monolith using Next.js 14 App Router
- Each domain is a self-contained module under `src/modules/`
- No module may import from another module — only from `src/lib/` and `src/agents/`
- All business logic lives in `service.ts` files — never in route handlers
- All database queries live in `repository.ts` files — never in services
- All types are co-located in `types.ts` per module
- All external input is validated with Zod in `validators.ts` before reaching services
- Agent pipeline: each agent is a pure async function with typed input/output
- Follow SOLID principles, DRY, and single responsibility throughout
- Write JSDoc comments on every exported function

---

### Tech stack
- **Framework**: Next.js 14 (App Router, TypeScript strict mode)
- **Database + Auth**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Payments**: Stripe + Paystack
- **Email**: Resend
- **AI**: Anthropic SDK (`@anthropic-ai/sdk`)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

---

### Directory structure to scaffold

```
biostore/
├── .env.local.example
├── .eslintrc.json
├── .prettierrc
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── package.json
│
├── public/
│   └── logo.svg
│
├── src/
│   │
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx            # Dashboard shell with sidebar
│   │   │   ├── dashboard/page.tsx    # Stats overview
│   │   │   ├── links/page.tsx        # Manage links
│   │   │   ├── store/page.tsx        # Manage products
│   │   │   ├── appearance/page.tsx   # Themes & customisation
│   │   │   └── settings/page.tsx     # Account & billing
│   │   ├── [username]/
│   │   │   └── page.tsx              # Public profile page (SSG)
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   └── signup/route.ts
│   │       ├── profile/
│   │       │   └── route.ts
│   │       ├── links/
│   │       │   └── route.ts
│   │       ├── products/
│   │       │   └── route.ts
│   │       ├── payments/
│   │       │   ├── checkout/route.ts
│   │       │   └── webhooks/route.ts
│   │       ├── analytics/
│   │       │   └── route.ts
│   │       └── agents/
│   │           └── onboarding/route.ts  # Triggers agent pipeline
│   │
│   ├── modules/                      # Domain modules — core business logic
│   │   │
│   │   ├── auth/
│   │   │   ├── index.ts              # Public exports only
│   │   │   ├── types.ts              # User, Session, AuthError types
│   │   │   ├── validators.ts         # Zod schemas: loginSchema, signupSchema
│   │   │   ├── repository.ts         # DB queries: findByEmail, createUser
│   │   │   ├── service.ts            # Business logic: login(), signup(), logout()
│   │   │   └── __tests__/
│   │   │       └── auth.service.test.ts
│   │   │
│   │   ├── profile/
│   │   │   ├── index.ts
│   │   │   ├── types.ts              # Profile, Link, Theme types
│   │   │   ├── validators.ts         # profileSchema, linkSchema
│   │   │   ├── repository.ts         # getProfile, updateProfile, getLinks, upsertLink
│   │   │   ├── service.ts            # updateProfile(), reorderLinks(), toggleLink()
│   │   │   └── __tests__/
│   │   │       └── profile.service.test.ts
│   │   │
│   │   ├── store/
│   │   │   ├── index.ts
│   │   │   ├── types.ts              # Product, Purchase types
│   │   │   ├── validators.ts         # productSchema
│   │   │   ├── repository.ts         # createProduct, getProducts, getPurchase
│   │   │   ├── service.ts            # createProduct(), generateDownloadUrl()
│   │   │   └── __tests__/
│   │   │       └── store.service.test.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── index.ts
│   │   │   ├── types.ts              # PaymentIntent, Webhook, Provider types
│   │   │   ├── validators.ts         # checkoutSchema, webhookSchema
│   │   │   ├── repository.ts         # createTransaction, updateTransactionStatus
│   │   │   ├── service.ts            # createCheckout(), handleWebhook(), getPayout()
│   │   │   ├── providers/
│   │   │   │   ├── stripe.ts         # Stripe-specific logic
│   │   │   │   └── paystack.ts       # Paystack-specific logic
│   │   │   └── __tests__/
│   │   │       └── payments.service.test.ts
│   │   │
│   │   └── analytics/
│   │       ├── index.ts
│   │       ├── types.ts              # PageView, ClickEvent, RevenueStats types
│   │       ├── validators.ts
│   │       ├── repository.ts         # recordView, recordClick, getStats
│   │       ├── service.ts            # trackPageView(), trackLinkClick(), getDashboardStats()
│   │       └── __tests__/
│   │           └── analytics.service.test.ts
│   │
│   ├── agents/                       # AI agent pipeline
│   │   ├── pipeline.ts               # Orchestrator: runs agents in sequence
│   │   ├── types.ts                  # AgentInput, AgentOutput, PipelineContext types
│   │   │
│   │   ├── profileAgent.ts           # Reads user signup data → builds context object
│   │   ├── bioAgent.ts               # Context → calls Claude API → returns generated bio
│   │   ├── themeAgent.ts             # Bio + context → returns recommended theme ID
│   │   ├── suggestionAgent.ts        # Context → returns suggested links to add
│   │   └── outputAgent.ts            # Assembles all agent outputs → final onboarding result
│   │
│   ├── lib/                          # Shared infrastructure (no business logic)
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Supabase client (SSR)
│   │   │   └── middleware.ts         # Auth session refresh middleware
│   │   ├── stripe.ts                 # Stripe SDK instance
│   │   ├── paystack.ts               # Paystack SDK instance
│   │   ├── resend.ts                 # Resend SDK instance
│   │   ├── anthropic.ts              # Anthropic SDK instance
│   │   └── errors.ts                 # AppError class, error codes
│   │
│   ├── components/                   # Shared React components
│   │   ├── ui/                       # Primitives: Button, Input, Card, Badge, Modal
│   │   ├── layout/                   # Sidebar, Navbar, PageShell
│   │   └── profile/                  # LinkCard, ThemePicker, ProfilePreview
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useProfile.ts
│   │   ├── useLinks.ts
│   │   └── useAnalytics.ts
│   │
│   └── middleware.ts                 # Next.js middleware — auth guard on /dashboard routes
│
├── supabase/
│   └── migrations/
│       ├── 001_users.sql
│       ├── 002_profiles.sql
│       ├── 003_links.sql
│       ├── 004_products.sql
│       ├── 005_purchases.sql
│       └── 006_analytics.sql
│
└── docs/
    ├── architecture.md
    ├── agent-pipeline.md
    └── api.md
```

---

### Agent pipeline implementation

Scaffold `src/agents/pipeline.ts` with this exact pattern:

```typescript
// Each agent is a pure function: (input: T) => Promise<U>
// The output of one agent becomes the input of the next
// If any agent throws, the pipeline stops and returns an error

export async function runOnboardingPipeline(
  userId: string
): Promise<OnboardingResult> {
  const context = await profileAgent({ userId });         // step 1
  const bioResult = await bioAgent({ context });          // step 2 — uses step 1 output
  const themeResult = await themeAgent({ context, bio: bioResult.bio }); // step 3
  const suggestions = await suggestionAgent({ context }); // step 4
  return outputAgent({ context, bioResult, themeResult, suggestions }); // step 5
}
```

---

### Coding standards to enforce

1. **No `any` types** — use `unknown` and narrow with type guards
2. **All errors thrown as `AppError`** with a code, message, and HTTP status
3. **Every repository function** takes a Supabase client as its first argument (dependency injection)
4. **Every service function** is pure — no direct SDK calls, only through `lib/`
5. **Payments provider pattern** — `service.ts` calls a `getProvider()` factory that returns either Stripe or Paystack based on the user's country, not hardcoded conditionals scattered through code
6. **Environment variables** — accessed only through a validated `src/lib/env.ts` file using Zod, never via `process.env` directly in components or services
7. **API routes** — only validate input, call one service function, return response. No logic in route handlers.

---

### Files to generate with full implementation (not just stubs)

1. `src/lib/env.ts` — Zod-validated environment config
2. `src/lib/errors.ts` — AppError class with codes
3. `src/agents/types.ts` — all agent input/output types
4. `src/agents/pipeline.ts` — full orchestrator
5. `src/agents/profileAgent.ts` — reads Supabase user record
6. `src/agents/bioAgent.ts` — calls Claude API to generate bio
7. `src/modules/payments/providers/stripe.ts` — Stripe checkout creation
8. `src/modules/payments/providers/paystack.ts` — Paystack checkout creation
9. `src/middleware.ts` — auth guard
10. `supabase/migrations/001_users.sql` through `006_analytics.sql`

Generate all other files as well-structured stubs with JSDoc comments indicating what each function should do.
