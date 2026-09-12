# ⚔️ LIFE RPG — Turn Your Real Life Into An Epic Adventure

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

> A full-stack, production-grade **Dark Cyber-Fantasy** life progression system that converts mundane daily habits and chores into an addictive RPG character advancement loop with immediate dopamine gratification.

---

## 🌟 Vision & The Core Problem

Traditional to-do apps and productivity dashboards feel like chores. They suffer from the **"delayed gratification problem"**: reading a technical textbook, completing a 10km run, or grinding algorithms takes months before real-world results materialize.

**Life RPG** bridges this chasm by applying proven game-design psychology:
- **Instant Dopamine Feedback Loops**: Completing a task yields instant harmonic chimes, floating XP & Gold banners, celebratory confetti, and attribute boosts.
- **Authoritative RPG Progression**: Non-linear leveling formula where subsequent levels require progressively greater dedication.
- **5 Core Attributes**: Real-world discipline directly enhances virtual character stats (`Strength`, `Intellect`, `Agility`, `Wisdom`, `Discipline`).
- **The Grand Armory & Vault**: Earn Gold to acquire blades, cloaks, visors, and celestial auras, dynamically rendered on your hero's avatar.
- **Unbroken Daily Streaks**: Consecutively conquer quests to fuel your flame multiplier.
- **Zero-Fake Data Guarantee**: Relational database persistence with full cross-device isolation and JWT authentication.

---

## 🎨 Visual Identity: Dark Cyber-Fantasy

Built with a curated aesthetic designed to captivate:
- **Void Abyss Background**: `#070A12` with radial atmospheric lighting.
- **Dark Citadel & Obsidian Surfaces**: `#0D1220` and `#12192A` with subtle glassmorphism (`backdrop-blur-md`).
- **Neon Accents**: Cyber Violet (`#8B5CF6`), Neon Cyan (`#22D3EE`), Gold/Amber (`#F59E0B`), and Emerald (`#22C55E`).
- **RPG Typography**: Google Fonts hierarchy featuring *Cinzel* (heroic titles), *Orbitron* (HUD metrics), and *Inter* (interface readability).
- **Web Audio API Synthesizer**: Pure in-browser sound engine synthesizing tactile clicks, quest victory chimes, coin clinks, and level-up fanfares (no missing MP3 files!).

---

## 📐 System Architecture

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Relational database models (SQLite / Postgres)
│   │   └── seed.ts             # 16 Armory items & 10 Core Achievements seed
│   ├── src/
│   │   ├── config/             # Database client & environment validation
│   │   ├── controllers/        # Auth, Quests, Character, Shop, Inventory, History
│   │   ├── middleware/         # JWT requireAuth, errorHandler, Zod validators
│   │   ├── routes/             # RESTful API endpoints
│   │   ├── services/           # Authoritative RPGEngine, StreakService, ShopService
│   │   ├── types/              # TypeScript contracts
│   │   ├── app.ts              # Express setup, Helmet, CORS, Rate-limiting
│   │   └── index.ts            # Server entrypoint
│   └── tests/                  # Vitest integration test suite (25 test cases)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── character/      # AvatarVisualizer, AttributeBars, XPProgressBar, StreakBadge
│   │   │   ├── common/         # EmptyState, Skeleton loaders
│   │   │   ├── effects/        # CelebrationModal, FlyingRewards
│   │   │   ├── layout/         # Navbar, Sidebar, MobileNav, AppLayout
│   │   │   └── quests/         # QuestCard, QuestModal
│   │   ├── context/            # AuthContext, SoundContext, ToastContext
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Quests, Character, Shop, Inventory, Achievements, History, Settings
│   │   ├── services/           # api.ts (fetch client), audioService.ts (Web Audio Synth)
│   │   └── types/              # Frontend types
│   ├── index.html              # SEO metadata, OpenGraph tags, Google Fonts
│   ├── tailwind.config.js      # Cyber-Fantasy design tokens
│   └── vite.config.ts          # Vite configuration with API proxy
├── .env.example                # Configuration template
└── README.md                   # Full documentation
```

---

## 🧮 RPG Engine Math & Progression Formulas

### 1. Non-Linear Leveling Formula
To advance from level $L$ to $L + 1$, the required experience points follow the power curve:
$$\text{requiredXP}(L) = \lfloor 100 \times L^{1.5} \rfloor$$

| Level | Required XP | Cumulative XP | Title Unlocked |
|:-----:|:-----------:|:-------------:|:--------------:|
| 1     | 100 XP      | 100 XP        | Novice Adventurer |
| 2     | 282 XP      | 382 XP        | Novice Adventurer |
| 3     | 519 XP      | 901 XP        | Novice Adventurer |
| 5     | 1,118 XP    | 2,819 XP      | Apprentice of Destiny |
| 10    | 3,162 XP    | 12,648 XP     | Cyber Vanguard |
| 15    | 5,809 XP    | 34,710 XP     | Shadow Weaver |
| 20    | 8,944 XP    | 71,289 XP     | Master of Realms |
| 25+   | 12,500 XP   | 124,560 XP    | Grandmaster Sovereign |

*Carryover XP & Multi-Level Ups*: If a large quest bounty surpasses multiple level thresholds, the backend calculates all level increments and assigns residual XP to the next tier.

### 2. Quest Bounty Matrix
All rewards are calculated **authoritatively on the server** to prevent client manipulation:

| Difficulty | Base XP | Base Gold | Attribute Boost | Description |
|:----------:|:-------:|:---------:|:---------------:|:------------|
| **Easy**   | +50 XP  | +20 Gold  | +2              | Quick everyday chore (< 20 mins) |
| **Medium** | +100 XP | +40 Gold  | +4              | Standard focused session (45-60 mins) |
| **Hard**   | +175 XP | +70 Gold  | +7              | Arduous intellectual or physical trial (2+ hours) |
| **Epic**   | +300 XP | +120 Gold | +12             | Milestone achievement or major breakthrough |

### 3. Attribute Domain Mapping
- **Intellect** 🧠 $\leftarrow$ *Coding, Study & Academics*
- **Strength** 💪 $\leftarrow$ *Fitness, Weightlifting & Athletics*
- **Agility** ⚡ $\leftarrow$ *Health, Nutrition, Running & Reflexes*
- **Wisdom** 🧘 $\leftarrow$ *Reading, Meditation, Lore & Mindfulness*
- **Discipline** 🔥 $\leftarrow$ *Career, Work, Personal Habits & Routine*

### 4. Streak Calibration Policy
- Consecutive calendar day completion: $+1$ to `currentStreak`.
- Same-day multiple completions: preserves current streak without duplicate counting.
- Gaps $> 1$ calendar day: resets `currentStreak` to $1$.
- `longestStreak` is recorded and preserved forever.

---

## 🗄️ Database Schema (Prisma)

The application uses a strict relational structure with 9 models:
- **`User`**: Account identity, unique email, unique username, bcrypt password hash (`salt: 10`).
- **`Character`**: Character stats (`level`, `xp`, `gold`, `strength`, `intellect`, `agility`, `wisdom`, `discipline`, `currentStreak`, `longestStreak`, `lastActivityDate`, `avatarColor`, equipped gear IDs).
- **`Task` (Quests)**: User-owned tasks with difficulty, category, rewards, and completion status.
- **`TaskCompletion`**: Historical log of completed quests with exact XP, Gold, and attribute earned.
- **`Item`**: Shop armory items with rarity tiers (*Common, Rare, Epic, Legendary*), stat bonus, price, and visual icon.
- **`Inventory`**: User ownership records with equipped status (`isEquipped: boolean`).
- **`Achievement`**: Global milestone achievements with requirements, bonus XP, and Gold rewards.
- **`UserAchievement`**: Unlocked milestones per user.
- **`ActivityLog`**: Immutable audit timeline of events (`QUEST_COMPLETE`, `LEVEL_UP`, `ITEM_PURCHASED`, `ITEM_EQUIPPED`, `ACHIEVEMENT_UNLOCKED`).

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/life-rpg.git
cd life-rpg
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Generate Prisma Client & initialize SQLite database
npx prisma generate
npx prisma db push

# Seed Shop Items and Core Achievements
npm run prisma:seed

# Run automated tests
npm test

# Start Backend Server (Port 5000)
npm run dev
```

### 3. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install

# Start Vite Development Server (Port 5173)
npm run dev
```

Open `http://localhost:5173` in your browser to start your journey!

---

## 🧪 Automated Testing

The backend includes a comprehensive test suite powered by **Vitest** and **Supertest**:
```bash
cd backend
npm test
```

### What Is Tested:
- **`rpgEngine.test.ts`**: Non-linear level thresholds, carryover XP across multiple level-ups, attribute mapping, difficulty reward matrix.
- **`streakService.test.ts`**: Calendar day diff calculation, same-day idempotency, consecutive day increment, broken streak reset.
- **`api.test.ts`**:
  - User registration & password hashing
  - Login authentication & JWT validation
  - Duplicate email / username rejection
  - Quest creation & server-authoritative reward calculation
  - Strict user isolation (User B cannot read or complete User A's quests)
  - Quest completion transaction (XP, Gold, Level Up, Streak, Activity log)
  - Preventing double completion of the same quest
  - Shop item browsing & purchasing
  - Insufficient gold rejection
  - Inventory equip/unequip mechanics & character profile sync
  - Health check endpoint (`GET /api/health`)

---

## 🔒 Security & Data Isolation

1. **Authentication**: Signed JSON Web Tokens (JWT) verified on every private endpoint via `requireAuth` middleware.
2. **Password Security**: Passwords hashed with `bcryptjs` using 10 rounds of salt. Plain-text passwords are never logged or stored.
3. **Strict Account Isolation**: Every database query explicitly filters by `userId` extracted directly from the verified token payload. Changing IDs in requests returns `404 Not Found`.
4. **Authoritative Backend**: Clients cannot submit arbitrary XP, Gold, or Level values. The server derives rewards solely from the stored task record.
5. **Rate Limiting**: Integrated `express-rate-limit` on `/api/auth` endpoints to prevent brute-force attacks.
6. **SQL Injection Protection**: Fully parameterized queries via Prisma ORM.
7. **Security Headers**: Powered by `helmet` with strict CORS configuration.

---

## 🌐 Production Deployment Guide

### Option A: Deploy Backend to Render / Railway / Fly.io
1. Set the environment variables in your hosting dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string (from Supabase, Neon, or Railway).
   - `JWT_SECRET`: A strong random string.
   - `CORS_ORIGIN`: Your production frontend URL (e.g., `https://life-rpg.vercel.app`).
   - `NODE_ENV`: `production`
2. Update `backend/prisma/schema.prisma` datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Run migrations and seed:
   ```bash
   npx prisma migrate deploy
   npm run prisma:seed
   ```
4. Build and start:
   ```bash
   npm run build
   npm start
   ```

### Option B: Deploy Frontend to Vercel / Netlify
1. Connect your repository to Vercel/Netlify.
2. Set the Root Directory to `frontend`.
3. Set Build Command to `npm run build` and Output Directory to `dist`.
4. Add environment variable or proxy:
   - `VITE_API_URL`: Your production backend URL (e.g. `https://life-rpg-api.onrender.com`).

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|:------:|:---------|:------------|:-------------:|
| `GET`  | `/api/health` | Service health status | No |
| `POST` | `/api/auth/register` | Create account & starting character | No |
| `POST` | `/api/auth/login` | Authenticate & issue JWT token | No |
| `GET`  | `/api/auth/me` | Fetch active user session | Yes |
| `POST` | `/api/auth/logout` | Disconnect session | Yes |
| `GET`  | `/api/quests` | List user quests (filters: category, difficulty, status) | Yes |
| `POST` | `/api/quests` | Forge new quest with calculated rewards | Yes |
| `GET`  | `/api/quests/:id` | Get quest details | Yes |
| `PUT`  | `/api/quests/:id` | Modify uncompleted quest | Yes |
| `DELETE`| `/api/quests/:id` | Banish quest from ledger | Yes |
| `POST` | `/api/quests/:id/complete` | Claim quest completion & level up | Yes |
| `GET`  | `/api/character` | Fetch hero stats, attributes, and equipped gear | Yes |
| `PUT`  | `/api/character/appearance` | Update avatar aura color resonance | Yes |
| `GET`  | `/api/shop/items` | List available armory items & owned status | Optional |
| `POST` | `/api/shop/items/:itemId/purchase` | Purchase item with gold | Yes |
| `GET`  | `/api/inventory` | List owned equipment in vault | Yes |
| `POST` | `/api/inventory/:id/equip` | Equip item to active character slot | Yes |
| `POST` | `/api/inventory/:id/unequip` | Unequip item | Yes |
| `GET`  | `/api/achievements` | List all milestones & unlock status | Optional |
| `GET`  | `/api/history` | Paginated chronological activity log | Yes |

---

## 🏆 Demonstration Walkthrough Video

A 90–180 second screen recording demonstrating:
1. **Hero Registration & Character Manifestation**: Starting at Level 1 with 50 starting Gold.
2. **Forging a Quest**: Categorizing as Fitness (+100 XP, +40 Gold, +4 Strength).
3. **Tactile Quest Completion**: Instant floating rewards, sound chime, and **Level Up Celebration Modal** (LVL 1 $\rightarrow$ LVL 2).
4. **Armory Purchase & Equipment**: Buying the *Cloth Robe* / *Novice Blade* in the shop and equipping it in the vault.
5. **Database Persistence**: Refreshing the browser and logging out/in to prove 100% database persistence.

*Hosted directly in the repository `/docs/walkthrough.mp4` or via public link in the release.*

---

## 📜 License
MIT License. Crafted with passion for gamified human potential.
