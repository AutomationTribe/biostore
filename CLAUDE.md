# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Run all tests:**
```bash
npm run test
```

**Run single test file:**
```bash
npm run test src/modules/auth/__tests__/auth.service.test.ts
```

**Run tests with UI:**
```bash
npm run test:ui
```

**Lint code (fails on warnings):**
```bash
npm run lint
```

**Format code:**
```bash
npm run format
```

**Type check:**
```bash
npm run type-check
```

## Architecture Overview

BioStore is a **modular monolith** with strict separation of concerns. Understanding the three core layers is essential:

### Layer 1: Modules (`src/modules/`)
Self-contained business domains with zero cross-module imports. Each module follows this structure:
- `types.ts` — Data structures and types
- `validators.ts` — Zod input validation schemas
- `repository.ts` — Database operations (all take Supabase client as first parameter)
- `service.ts` — Business logic (pure functions, no SDK calls)
- `index.ts` — Public API exports only

**Critical rule: Modules may ONLY import from `src/lib/` and `src/agents/`, never from other modules.**

Available modules: `auth`, `profile`, `store`, `payments`, `analytics`

### Layer 2: Infrastructure (`src/lib/`)
Shared, non-business utilities:
- `env.ts` — Zod-validated environment variables (never access `process.env` directly)
- `errors.ts` — `AppError` class with error codes and HTTP status
- `supabase/` — Client factories (`client.ts`, `server.ts` for SSR)
- `stripe.ts`, `paystack.ts`, `resend.ts`, `anthropic.ts` — SDK instances

### Layer 3: Routes & AI (`src/app/` and `src/agents/`)
- **API routes**: Validate input with Zod → call one service function → return response (no business logic in routes)
- **Agent pipeline**: Pure async functions with typed input/output; run in sequence; fail fast on any error

## Key Design Patterns

### 1. Dependency Injection (Repository Layer)
Every repository function takes a Supabase client as its first argument:
```typescript
export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null>
```

This enables testing, mock injection, and explicit function dependencies. Always follow this pattern.

### 2. Provider Factory (Payments)
Payment services call `getProvider()` to select Stripe or Paystack based on user context, not hardcoded conditionals:
```typescript
const provider = getProvider(user.country); // returns "stripe" | "paystack"
return provider === "stripe" 
  ? createStripeCheckout(...)
  : createPaystackCheckout(...);
```

### 3. Error Handling
All errors thrown as `AppError`:
```typescript
throw new AppError(
  "NOT_FOUND",
  "Profile not found",
  404,
  { userId }
);
```

Never throw plain `Error` or `new Error()`.

### 4. Validation at Boundaries
Input validation (Zod) happens **only** at:
- API route handlers
- External webhooks
- File uploads

Internal functions trust validated data from callers; add no extra validation.

## Module Import Rules

✅ **ALLOWED:**
```typescript
// From same module
import { profileSchema } from "./validators";
import { getProfile } from "./repository";

// From lib (infrastructure)
import { AppError } from "@/lib/errors";
import { supabaseServer } from "@/lib/supabase/server";

// From agents
import { runOnboardingPipeline } from "@/agents/pipeline";
```

❌ **FORBIDDEN:**
```typescript
// Cross-module imports
import { signup } from "@/modules/auth/service"; // ← NO
import { getProducts } from "@/modules/store/service"; // ← NO
```

If you need logic from another module, extract it to `src/lib/` as a shared utility.

## Agent Pipeline

The onboarding pipeline runs 5 agents sequentially. Each agent:
- Takes typed input
- Returns typed output
- Throws `AgentExecutionError` on failure (stops pipeline)
- Must be pure (no side effects except logging)

```typescript
// src/agents/pipeline.ts orchestrates:
1. profileAgent(userId) → context
2. bioAgent(context) → bio + confidence
3. themeAgent(context, bio) → theme recommendation
4. suggestionAgent(context) → suggested links
5. outputAgent(all results) → final OnboardingResult
```

See `docs/agent-pipeline.md` for implementation details.

## Coding Standards

1. **No `any` types** — use `unknown` with type guards
2. **JSDoc on all exports** — one-line comments on public functions/types
3. **Type safety** — TypeScript strict mode; no implicit `any`
4. **Environment variables** — always access via `env.ts` validation, never `process.env`
5. **Naming** — follow existing patterns (camelCase for functions/variables, PascalCase for types)
6. **Testing** — all service functions have unit tests in `__tests__/` directories

## Common Workflows

### Adding a New Module
1. Create `src/modules/[feature]/` with `types.ts`, `validators.ts`, `repository.ts`, `service.ts`, `index.ts`
2. Implement repository (takes Supabase client), then service (pure functions)
3. Add database migration in `supabase/migrations/`
4. Create API route(s) in `src/app/api/[feature]/`
5. Export public API from `index.ts` only

### Modifying Validation
1. Update Zod schema in `[module]/validators.ts`
2. Update corresponding types in `[module]/types.ts`
3. Update repository and service signatures if schema structure changed
4. Update tests

### Extending Agent Pipeline
1. Create new agent file in `src/agents/[newAgent].ts` with input/output types
2. Update `src/agents/types.ts` with new type definitions
3. Add agent to `pipeline.ts` orchestration
4. Update `outputAgent` to include new result
5. Add unit tests

## Database & Migrations

- Schema defined in `supabase/migrations/` SQL files
- Migrations are cumulative; never modify existing migrations
- Row-level security (RLS) enforced at database level for multi-tenant safety
- All table names are lowercase; columns use `snake_case`

## Payments Integration

Two providers supported: Stripe and Paystack

- Provider selection logic in `src/modules/payments/service.ts`
- Provider-specific implementations in `src/modules/payments/providers/`
- Webhook verification required for both providers (signature validation)
- All payment state tracked in `payment_intents` table

## Testing

- **Unit tests**: Service functions, validators, repository functions
- **Test file location**: `[module]/__tests__/[module].service.test.ts`
- **Framework**: Vitest + React Testing Library
- **Mock Supabase**: Create mock client in tests; repository functions accept it as first arg

Run tests during development to catch regressions early.

## Deployment Notes

- Environment variables must be set in deployment platform (Vercel dashboard)
- Database migrations applied automatically on deploy
- Payment webhooks (Stripe, Paystack) must be configured with production URLs
- Next.js build must pass (no TypeScript errors, ESLint warnings)

See `README.md` for environment variable reference and `.env.local.example` for local setup.
