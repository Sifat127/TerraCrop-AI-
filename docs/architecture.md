# Architecture & Security Blueprint: TerraCrop AI

TerraCrop AI is a climate-aware agricultural decision-support platform designed to convert NASA Earth observations into actionable, long-term crop rotation plans.

## System Architecture

```
                    TERRACROP AI WEB CLIENT
              (React 19, TypeScript, Tailwind CSS)
                         |
           +-------------+-------------+
           |                           |
           v                           v
  Browser UI Components      Cloudflare Turnstile
  (Auth, Planner, Game)      (Client Bot Challenge)
           |                           |
           |    Turnstile Token        |
           +───────────┬───────────────+
                       │
                       ▼
            EXPRESS API SERVER (Port 3000)
    ┌──────────────────────────────────────────────┐
    │  • POST /api/auth/verify-turnstile           │
    │  • GET/POST /api/farm                        │
    │  • POST /api/rotation                        │
    │  • POST /api/scenario                        │
    │  • POST /api/ai/chat (Gemini Grounding)      │
    └──────────────────┬───────────────────────────┘
                       │
                       ▼
          SUPABASE POSTGRESQL & AUTH
    ┌──────────────────────────────────────────────┐
    │  • auth.users (PKCE, Session tokens)         │
    │  • Row Level Security (RLS) on all tables    │
    │  • 14 Normalized Domain Tables               │
    │  • Auto-provisioning via DB Triggers         │
    └──────────────────────────────────────────────┘
```

## Security & Bot Defense: Cloudflare Turnstile
Turnstile protects authentication and mutation routes from automated scripts, credential stuffing, and spam without frustrating visual puzzles.
- **Client Widget**: Explicitly renders via `@challenges.cloudflare.com/turnstile/v0/api.js`.
- **Server Verification**: The backend validates tokens against `https://challenges.cloudflare.com/turnstile/v0/siteverify` using the private secret key.
- **Development Testing**: Seamlessly supports official Cloudflare testing sitekeys (`1x00000000000000000000AA`).

## Database Model & Row Level Security (RLS)
Every user-owned record is isolated using PostgreSQL Row Level Security:
- Farmers can only query and mutate their own farms, plots, plans, and game progress.
- Seed crops catalog is accessible read-only to all users.
