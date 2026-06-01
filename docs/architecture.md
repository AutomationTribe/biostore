# BioStore Architecture

## Overview

BioStore is a modular monolith built with Next.js 14, designed specifically for African creators to build link-in-bio pages and sell digital products.

## Core Principles

1. **Modular Monolith**: Self-contained modules under `src/modules/` with no cross-module imports
2. **Separation of Concerns**: Repositories (DB), Services (logic), Validators (input), Types (data structures)
3. **Pure Functions**: Services contain business logic without direct SDK calls
4. **Dependency Injection**: All external dependencies passed as arguments
5. **Type Safety**: Strict TypeScript with Zod validation at system boundaries
6. **AI-Powered Onboarding**: Agent pipeline for intelligent user setup

## Directory Structure

### `src/lib/` - Infrastructure Layer
Shared, non-business-logic utilities:
- **env.ts** - Zod-validated environment configuration
- **errors.ts** - Centralized error handling with AppError class
- **supabase/** - Database client factories (browser, server, admin)
- **stripe.ts**, **paystack.ts**, **resend.ts**, **anthropic.ts** - SDK instances

### `src/modules/` - Business Logic Layer
Each module is self-contained with:
- **types.ts** - Data structures and interfaces
- **validators.ts** - Zod schemas for input validation
- **repository.ts** - Database operations (takes Supabase client as first arg)
- **service.ts** - Business logic (pure functions, no SDK calls)
- **index.ts** - Public API exports

#### Available Modules:
- **auth/** - User authentication and session management
- **profile/** - User profiles, links, and themes
- **store/** - Digital products and purchases
- **payments/** - Payment processing (Stripe/Paystack)
- **analytics/** - Tracking and statistics

### `src/agents/` - AI Pipeline Layer
Agent-based onboarding:
- **types.ts** - Agent contracts (input/output types)
- **pipeline.ts** - Orchestrator that runs agents in sequence
- **profileAgent.ts** - Load user context from DB
- **bioAgent.ts** - Generate bio with Claude API
- **themeAgent.ts** - Recommend theme based on category
- **suggestionAgent.ts** - Suggest links to add
- **outputAgent.ts** - Assemble final onboarding result

### `src/app/` - Next.js App Router
- **(auth)/** - Login/signup pages
- **(dashboard)/** - Protected dashboard routes
- **[username]/** - Public profile pages (SSG/ISR)
- **api/** - API routes
- **middleware.ts** - Auth guards and session refresh

## Data Flow

### Authentication Flow
```
POST /api/auth/signup
  → signupSchema validation (validators.ts)
  → signup() service creates user
  → runOnboardingPipeline() triggers agents
  ← returns user + onboarding result
```

### Link Management Flow
```
POST /api/links
  → linkSchema validation
  → saveLink() service with dependency injection
  → upsertLink() repository updates DB
  ← returns Link object
```

### Payment Flow
```
POST /api/payments/checkout
  → checkoutSchema validation
  → getProvider() factory selects Stripe or Paystack
  → createCheckout() calls appropriate provider
  → createPaymentIntent() records intent in DB
  ← returns checkout session (client secret or redirect URL)

Webhook: POST /api/payments/webhooks
  → verifySignature() ensures authenticity
  → handleWebhook() processes payment event
  → recordPurchase() or updateTransactionStatus() updates DB
```

## Agent Pipeline

The onboarding pipeline runs 5 agents in sequence:

```typescript
1. profileAgent(userId)
   ↓ (returns context with user data)
2. bioAgent(context)
   ↓ (calls Claude API, returns generated bio)
3. themeAgent(context, bio)
   ↓ (recommends theme based on category)
4. suggestionAgent(context)
   ↓ (suggests links to add)
5. outputAgent(all results)
   ↓ (assembles final OnboardingResult)
```

If any agent fails, the entire pipeline stops and returns an error.

## Key Design Decisions

### Payment Provider Pattern
Services call `getProvider()` factory that returns "stripe" or "paystack" based on user country/context, not hardcoded conditionals throughout code.

### Repository Dependency Injection
Every repository function takes Supabase client as first argument:
```typescript
export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null>
```

This enables:
- Testing with mock clients
- Flexible client selection (server vs admin)
- Clear function dependencies

### Error Handling
All errors thrown as `AppError` with:
- `code` - Machine-readable error code
- `message` - Human-readable message
- `status` - HTTP status code
- `details` - Additional context

### Validation Strategy
Input validation happens only at system boundaries:
- API route handlers (user input)
- External webhooks
- File uploads

Internal code trusts validated data from its callers.

## Security Considerations

1. **RLS Policies** - Row-level security enforced at database level
2. **API Route Guards** - Middleware protects /dashboard routes
3. **Webhook Verification** - All webhooks verified by signature
4. **Environment Variables** - Validated via Zod, never accessed directly
5. **No Secrets in Code** - All secrets via environment variables

## Testing Strategy

Each module has a `__tests__/` directory with unit tests for:
- Service functions (business logic)
- Validators (edge cases)
- Repository functions (with mock Supabase client)

Use Vitest + React Testing Library for component tests.

## Deployment

- **Database**: Supabase (with migrations in `supabase/migrations/`)
- **Hosting**: Vercel (Next.js optimized)
- **Payments**: Stripe + Paystack webhooks configured
- **Email**: Resend for transactional emails
- **AI**: Anthropic API for Claude

## Adding New Features

1. Create module under `src/modules/[feature]/`
2. Define types in `types.ts`
3. Add Zod validators in `validators.ts`
4. Implement repository in `repository.ts` (takes Supabase client)
5. Implement service in `service.ts` (pure functions)
6. Export public API in `index.ts`
7. Create API route under `src/app/api/`
8. Add corresponding database migration

Never import across modules - use `lib/` for shared utilities only.
