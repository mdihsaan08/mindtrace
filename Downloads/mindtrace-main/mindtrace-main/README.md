# MindTrace 🧠
### AI Mental Health Journal & Emotional Pattern Detector

> Write freely. Let AI find your patterns.

MindTrace is a Next.js web application that uses Claude AI to analyze daily journal entries, detect emotional patterns, and surface compassionate, personalized insights over time.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Anthropic Claude API (`claude-opus-4-5`) |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth.js v5 (credentials) |
| Charts | Recharts |
| Deployment | Vercel (frontend) + Railway (database) |

---

## Project Structure

```
mindtrace/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts       # Claude AI analysis endpoint
│   │   ├── entries/route.ts       # Journal entries CRUD
│   │   └── auth/
│   │       ├── [...nextauth]/     # NextAuth handler
│   │       └── register/route.ts  # User registration
│   ├── dashboard/
│   │   ├── layout.tsx             # Auth-gated layout with sidebar
│   │   └── page.tsx               # Write page
│   ├── history/page.tsx           # Entry history
│   ├── patterns/page.tsx          # Mood trends & pattern insights
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── layout.tsx                 # Root layout (fonts, metadata)
│   ├── page.tsx                   # Landing page
│   └── globals.css
├── components/
│   ├── journal/
│   │   ├── MoodSelector.tsx       # Mood tag buttons
│   │   └── EntryCard.tsx          # Entry history card
│   └── layout/
│       └── Sidebar.tsx            # Navigation sidebar
├── lib/
│   ├── anthropic.ts               # Claude AI client + analyzeJournalEntry()
│   ├── auth.ts                    # NextAuth config
│   ├── prisma.ts                  # Prisma singleton client
│   └── utils.ts                   # Helpers (mood colors, dates, trends)
├── prisma/
│   └── schema.prisma              # Database schema (User, JournalEntry)
├── .env.example                   # Environment variable template
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/YOUR_USERNAME/mindtrace.git
cd mindtrace
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env

DATABASE_URL=postgresql://...       # Your PostgreSQL connection string
NEXTAUTH_SECRET=...                 # Run: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

### 3. Set up the database

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to your database
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live!

---

## Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/signin` | Sign in (NextAuth) |
| POST | `/api/analyze` | Analyze a journal entry with Claude AI |
| GET | `/api/entries` | Fetch paginated journal entries |
| DELETE | `/api/entries?id=xxx` | Delete an entry |

---

## Database Schema

Two core models:

- **User** — id, name, email, hashed password, timestamps
- **JournalEntry** — content, selectedMood, moodScore (1–10), moodLabel, emotions[], themes[], insight, keywords[], linked to User

---

## Deployment

### Frontend → Vercel
```bash
# Install Vercel CLI
npm i -g vercel
vercel
```
Add all `.env.local` values as environment variables in the Vercel dashboard.

### Database → Railway
1. Create a new PostgreSQL service at [railway.app](https://railway.app)
2. Copy the connection string into `DATABASE_URL`
3. Run `npm run db:push` with the production URL

---

## Environment Variables Reference

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `DATABASE_URL` | Railway, Supabase, Neon, or local PostgreSQL |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` in your terminal |
| `NEXTAUTH_URL` | `http://localhost:3000` (dev) or your production URL |

---


