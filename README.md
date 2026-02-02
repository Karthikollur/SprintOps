# SprintOps

An internal operations dashboard for startup founders and small product teams. SprintOps helps you track execution, blockers, and progress in one place.

## Core Question

> "Is execution healthy right now?"

Everything in SprintOps exists to answer this question at a glance.

## Features

- **Dashboard Overview** - Sprint completion, active tasks, blocked tasks, and open bugs at a glance
- **Task Management** - Full CRUD with status tracking (To-do, In Progress, Blocked, Done)
- **Bug Tracker** - Track bugs separately with severity levels and optional task linking
- **Blockers View** - Dedicated view for blocked tasks with time-blocked tracking
- **Analytics** - Tasks completed per day, bugs opened vs fixed, sprint progress over time
- **Team Management** - Basic team member management with Admin/Member roles

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Auth**: NextAuth.js (Credentials provider)
- **Styling**: Tailwind CSS
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd sprintops
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your values:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-change-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Initialize the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) and create an account.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── analytics/
│   │   ├── blockers/
│   │   ├── bugs/
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   └── team/
│   ├── api/              # API routes
│   ├── login/
│   └── signup/
├── components/
│   ├── ui/               # Reusable UI components
│   ├── DashboardLayout.tsx
│   ├── Providers.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── auth-utils.ts    # Auth utilities
│   └── prisma.ts        # Prisma client
└── types/
    └── next-auth.d.ts   # NextAuth type extensions
```

## What's NOT Included (Intentionally)

- Roadmaps
- Sprint planning
- OKRs
- Time tracking
- Notifications
- Integrations

This is an execution health dashboard, not a PM suite.

## License

MIT
