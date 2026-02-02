# SprintOps

![MIT License](https://img.shields.io/badge/license-MIT-green)
![Next.js 15](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

**A lightweight execution health dashboard for startup founders and small product teams.**

![SprintOps Dashboard](./assets/dashboard.jpeg)

> **Is execution healthy right now?**
> SprintOps answers this question at a glance.

---

## Why SprintOps?

Most project management tools are bloated with features you don't need. SprintOps focuses on one thing: **execution visibility**.

- **See sprint health at a glance** — Know instantly if your team is on track or falling behind
- **Surface blockers before they snowball** — Dedicated view for blocked tasks with time tracking
- **Understand execution risk** — Visual analytics show trends before they become problems
- **Keep your team aligned** — Everyone sees the same source of truth

---

## Demo

> **Try it yourself!**

```
Email: demo@sprintops.com
Password: sprintops123
```

<!-- Uncomment when deployed -->
<!-- [Live Demo](https://sprintops.vercel.app) -->

---

## Screenshots

### Dashboard
See sprint health at a glance — active tasks, blockers, bugs, and completion percentage.

![Dashboard](./assets/dashboard.jpeg)

### Tasks
Full task management with status, priority, assignees, and due dates.

![Tasks](./assets/tasks.jpeg)

### Blockers
Dedicated view for blocked tasks with reasons and time-blocked tracking.

![Blockers](./assets/blockers.jpeg)

### Bug Tracker
Track bugs by severity with optional task linking.

![Bugs](./assets/bugs.jpeg)

### Analytics
Visualize execution trends — tasks completed, bugs opened vs fixed, sprint progress.

![Analytics](./assets/analytics.jpeg)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | SQLite + Prisma ORM |
| **Auth** | NextAuth.js (Credentials) |
| **Styling** | Tailwind CSS |
| **Charts** | Recharts |

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Karthikollur/SprintOps.git
cd SprintOps

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Initialize the database
npm run db:push

# Seed demo data (optional but recommended)
npm run db:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and login with the demo credentials above.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio |

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── analytics/     # Sprint analytics & charts
│   │   ├── blockers/      # Blocked tasks view
│   │   ├── bugs/          # Bug tracking
│   │   ├── dashboard/     # Main dashboard
│   │   ├── tasks/         # Task management
│   │   └── team/          # Team members
│   ├── api/               # RESTful API routes
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/
│   ├── ui/                # Reusable UI components
│   ├── DashboardLayout.tsx
│   ├── Providers.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── auth-utils.ts      # Auth utilities
│   └── prisma.ts          # Prisma client singleton
└── types/
    └── next-auth.d.ts     # NextAuth type extensions
```

---

## What's NOT Included (Intentionally)

SprintOps is **not** a full PM suite. We intentionally exclude:

- Roadmaps & sprint planning
- OKRs & goal tracking
- Time tracking
- Notifications & integrations
- Gantt charts & dependencies

**This is an execution health dashboard.** Nothing more, nothing less.

---

## Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Karthikollur/SprintOps)

---

## License

MIT License - feel free to use this for your own projects.

---

**Built with focus by [Karthik Kollur](https://github.com/Karthikollur)**
