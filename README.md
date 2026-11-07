# Vegas AI Influencer Management Studio

An enterprise-grade, multi-user social media operations platform purpose-built for managing three AI-generated female influencer personas across Instagram and TikTok (6 social channels).

---

## 1. System Architecture & Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing across entities)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a luxury dark-mode theme (`#080B14`, `#0C101D`, `#12182B`)
- **Database**: PostgreSQL with [Supabase](https://supabase.com/) & Row Level Security (RLS)
- **AI Intelligence**: Google Gemini API via `@google/genai` (Gemini 2.5) with built-in Persona Studio algorithmic fallback
- **Data Visualization**: [Recharts](https://recharts.org/) for comparative analytics, retention curves, and format breakdowns
- **Date Engine**: `date-fns` for collision detection, scheduling matrices, and calendar math

---

## 2. The Three Independent AI Personas & Six Accounts

Each persona is strictly isolated with independent voice/tone guidelines, visual rendering boundaries, content pillars, and compliance disclaimers:

### Persona 1: High-Roller Host (`Victoria Sterling`)
- **Archetype**: `high_roller`
- **Color Theme**: Amber / Gold (`#F59E0B`)
- **Positioning**: Las Vegas luxury lifestyle, VIP casino salons (`Salon Privé`), presidential suites ($45k/night), bespoke dining, and private aviation.
- **Voice & Tone**: Aristocratic, commanding, measured pacing, whisper-quiet authority.
- **Managed Accounts**:
  - Instagram: `@victoria.highroller`
  - TikTok: `@victoriarolls`

### Persona 2: Nightlife Insider (`Sloane Vance`)
- **Archetype**: `nightlife_insider`
- **Color Theme**: Purple / Indigo (`#8B5CF6`)
- **Positioning**: Las Vegas nightlife, secret speakeasies, unmarked doors, master craft mixology, unwritten nightlife etiquette, afterhours.
- **Voice & Tone**: Electric, underground cool, 1.2-second hook rhythm, witty and secretive.
- **Managed Accounts**:
  - Instagram: `@sloane.afterdark`
  - TikTok: `@sloanenightlife`

### Persona 3: Poolside Specialist (`Maya Cruz`)
- **Archetype**: `poolside_specialist`
- **Color Theme**: Cyan / Teal (`#06B6D4`)
- **Positioning**: Luxury cabanas, dayclubs, DJ residencies, eternal summer lifestyle, daybed economics, sunscreen & festival glam.
- **Voice & Tone**: High-energy, buoyant, sun-drenched, aspirational summer luxury.
- **Managed Accounts**:
  - Instagram: `@maya.poolside`
  - TikTok: `@mayacruzdaze`

---

## 3. Multi-User Collaboration & Row-Level Security

- **Dual-Administrator Co-Piloting**: Allows instant switching between **Justin (Admin)** and **Sarah Partner (Co-Admin)** with full mutual authority.
- **Invitation Engine**: Invite new team members (Partners, Editors, Analysts) with role-based permissions.
- **Audit Logging**: Every action (creating content, changing status, approving scripts, publishing, or logging metrics) is stamped with `user_id`, `user_name`, and timestamp in PostgreSQL audit logs.
- **PostgreSQL RLS Policies**: Workspaces enforce tenant isolation using `is_workspace_member()` functions.

---

## 4. Key Functional Modules

### 1. Executive Dark-Mode Dashboard (`/`)
- Unified and Persona-filtered views.
- Total followers, weekly follower velocity, total views, and average engagement rate across all 6 accounts.
- Dual-admin **Pending Review Queue** with 1-click approvals.
- **Upcoming Scheduled Publishing** feed and shared **Team Tasks**.

### 2. Content Pipeline & CMS (`/content`)
- Full 8-stage operational pipeline:
  `IDEA → PLANNED → IN PRODUCTION → REVIEW → APPROVED → SCHEDULED → PUBLISHED → ANALYZED`
- Kanban board & full sortable Table view.
- Complete content modal: Title, opening hook, caption, hashtags, pillar, media attachments, format, scheduled timestamp, and production specifications.
- Instant AI assistance for brainstorming hooks and captions directly inside the creation modal.
- Duplicate, edit, archive, and manual metric entry operations.

### 3. Content Publishing Calendar (`/calendar`)
- Daily, Weekly, and Monthly scheduling grids.
- Color-coded persona badges (Amber, Purple, Cyan) and platform markers (IG vs TikTok).
- **Scheduling Collision Detector**: Flags any posts scheduled within 60 minutes across accounts to prevent self-cannibalization.
- **Empty Slot Warning Engine**: Identifies days where any persona lacks a scheduled post to ensure daily algorithmic presence.

### 4. Viral Research Engine (`/trends`)
- Short-form video trend scout querying TikTok & Instagram Reels.
- Structured trend cards with:
  - Source URL and popularity evidence
  - Psychological driver explanation ("Why it gains attention")
  - Fit matching to the ideal persona
  - Three concrete adaptation ideas
  - Tested 3-second opening hook
  - Viral potential gauge (1-100)
  - Clear distinction between **Verified Observations** vs **Strategic AI Hypotheses**
- **1-Click "Convert into Content Draft"**: Pushes the trend directly into the pipeline!

### 5. AI Content Generator Studio (`/generator`)
- Strict persona guardrails: Victoria never sounds like Sloane; Maya never copies Victoria.
- Modes: Video Concept, 3-Second Hooks Suite, Full Script & Avatar Direction, Caption & Hashtags.
- Automated compliance tag: Includes mandatory AI disclosure statement (`"Created with AI. Virtual Host & Digital Creator based in Las Vegas"`).
- Direct "Add to Content Pipeline" export.

### 6. Performance Analytics (`/analytics`)
- Recharts visualizations:
  - Follower count and total views by channel.
  - Content pillar performance matrix (reach vs saves).
  - Video format distribution (Short-form video vs Carousels).
  - Hook retention and save velocity comparison table.
  - Optimal posting times heatmap (concentrated between 6:30 PM and 9:30 PM PST).
- Manual metric recording modal with automatic Engagement Rate computation.
- Schema pre-wired for official Instagram Graph API & TikTok Content Marketing API integrations.

### 7. AI Weekly Strategist (`/strategist`)
- Mathematical 7-point audit of past 7-day performance:
  1. What worked (evidence-based metrics)
  2. What failed (root cause analysis)
  3. Which content formats are improving
  4. Topics deserving more attention
  5. Practices to stop immediately
  6. 5 concrete empirical experiments with verifiable hypotheses and KPIs
  7. Next week's proposed 7-day multi-persona content calendar
- **"Apply Proposed Calendar to Pipeline"**: 1-click batch scheduler!

### 8. Workspace Settings & Governance (`/settings`)
- Collaborator list and invitation manager.
- Supabase PostgreSQL connection status and SQL schema file reference.
- Google Gemini API key configuration.
- Real-time audit trail inspector.
- Factory seed data reset control.

---

## 5. Getting Started & Running Locally

### Step 1: Navigate to the Studio Directory
```bash
cd influencer-studio
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your optional keys:
- `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Get from your Supabase project.

*(Note: The studio includes a high-fidelity local state engine and built-in persona intelligence engine, so it runs immediately out-of-the-box even before cloud keys are added!)*

### Step 4: Run Database Migrations (Supabase)
Run the SQL script located in `supabase/schema.sql` inside your Supabase SQL Editor. This sets up all tables, foreign keys, RLS policies, and triggers.

### Step 5: Start the Application
```bash
npm run dev
# or for production
npm run build && npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
