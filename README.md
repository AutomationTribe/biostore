# BioStore

**Link-in-bio platform with digital product storefront for African creators**

Build your creator business with BioStore: Create a beautiful link-in-bio page, sell digital products, and track your success with built-in analytics.

## Features

- 🔗 **Link-in-Bio Pages** - Create a professional profile page with customizable links
- 🛍️ **Digital Store** - Sell e-books, courses, art, music, and more
- 🎨 **Themes & Customization** - AI-powered theme recommendations
- 📊 **Real-time Analytics** - Track views, clicks, and revenue
- 💰 **Multiple Payment Methods** - Accept payments via Stripe and Paystack
- 🤖 **AI Onboarding** - Intelligent setup wizard powered by Claude
- 🌍 **Built for Africa** - Tailored for African creators and payment methods

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Payments**: Stripe + Paystack
- **Email**: Resend
- **AI**: Anthropic SDK (Claude)
- **Testing**: Vitest + React Testing Library

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe/Paystack account (for payments)
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/biostore.git
cd biostore
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Fill in your credentials
```

4. Run database migrations:
```bash
npx supabase migration up
```

5. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
biostore/
├── src/
│   ├── app/                 # Next.js App Router (pages, API routes)
│   ├── modules/             # Business logic (auth, profile, store, payments, analytics)
│   ├── agents/              # AI onboarding pipeline
│   ├── lib/                 # Infrastructure (SDK clients, errors, utilities)
│   ├── components/          # React components (UI, layouts, forms)
│   ├── hooks/               # Custom React hooks
│   └── middleware.ts        # Auth middleware
├── supabase/
│   └── migrations/          # Database migration files
├── docs/                    # Documentation
│   ├── architecture.md      # System design and principles
│   ├── agent-pipeline.md    # AI agent documentation
│   └── api.md              # API endpoint reference
└── public/                  # Static assets
```

## Architecture

BioStore follows a **modular monolith** architecture with clear separation of concerns:

- **Modules** (`src/modules/`) - Self-contained business domains (auth, profile, store, payments, analytics)
- **Infrastructure** (`src/lib/`) - Shared utilities and SDK clients
- **Agents** (`src/agents/`) - AI-powered intelligent features
- **Routes** (`src/app/`) - User-facing pages and API endpoints

Each module contains:
- `types.ts` - Data structures
- `validators.ts` - Input validation (Zod schemas)
- `repository.ts` - Database operations
- `service.ts` - Business logic
- `index.ts` - Public exports

See [docs/architecture.md](docs/architecture.md) for detailed information.

## API Documentation

Full API documentation available in [docs/api.md](docs/api.md)

### Key Endpoints

```
POST   /api/auth/signup              # Create account
POST   /api/auth/login               # Authenticate
GET    /api/profile                  # Get user profile
POST   /api/links                    # Create link
GET    /api/products                 # List products
POST   /api/products                 # Create product
POST   /api/payments/checkout        # Create payment session
POST   /api/payments/webhooks        # Payment webhooks
GET    /api/analytics                # Dashboard stats
POST   /api/agents/onboarding        # Trigger AI setup
```

## Agent Pipeline

BioStore uses AI agents to provide intelligent onboarding:

1. **Profile Agent** - Load user context
2. **Bio Agent** - Generate personalized bio with Claude
3. **Theme Agent** - Recommend theme based on creator type
4. **Suggestion Agent** - Suggest links to add
5. **Output Agent** - Assemble final result

See [docs/agent-pipeline.md](docs/agent-pipeline.md) for details.

## Database

Database schema includes:
- Users and authentication
- Profiles with themes and bios
- Links with analytics
- Products and purchases
- Payment intents and transactions
- Page views and click events

All tables use row-level security (RLS) for fine-grained access control.

## Development

### Running Tests
```bash
npm run test              # Run all tests
npm run test:ui          # Open test UI
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking
```

### Building
```bash
npm run build            # Create production build
npm start                # Run production build
```

## Environment Variables

Required environment variables (see `.env.local.example`):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
PAYSTACK_SECRET_KEY
PAYSTACK_WEBHOOK_SECRET

# Resend (Email)
RESEND_API_KEY

# Anthropic (Claude API)
ANTHROPIC_API_KEY

# App
NEXT_PUBLIC_APP_URL
NODE_ENV
```

## Deployment

Deploy to Vercel (recommended for Next.js):

```bash
vercel deploy
```

Set environment variables in Vercel dashboard, then deploy.

Configure webhooks in your payment provider:
- Stripe: `https://yourdomain.com/api/payments/webhooks`
- Paystack: `https://yourdomain.com/api/payments/webhooks`

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

- 📧 Email: support@biostore.com
- 💬 Discord: [Join our community](https://discord.gg/biostore)
- 📖 Docs: [Read the documentation](./docs)

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Custom domains
- [ ] Advanced analytics dashboard
- [ ] Email list building
- [ ] Affiliate program
- [ ] Multi-currency support
- [ ] Team collaboration
- [ ] API for developers

## Acknowledgments

Built with ❤️ for African creators by creators.

Special thanks to:
- Supabase for database infrastructure
- Anthropic for Claude API
- Stripe and Paystack for payment processing
