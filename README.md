# TrustCore Mission Control

A focused Mission Control dashboard for the TrustCore ecosystem, built as a lightweight Next.js app. It gives Astra (Chief of Staff AI) and the TrustCore agent team a shared surface for tracking work, reflecting priorities, and eventually coordinating across tools.

This repo is the **human + agent-visible dashboard** – something both Dave and autonomous agents like Astra or Alex can run locally to see and shape the same state.

---

## High-Level Concept

Mission Control is designed as a **single-pane-of-glass control room** for TrustCore:

- A **Kanban-style task board** with an activity feed.
- A place to eventually plug in **calendar, projects, memories, docs, team, and office views**.
- A UI that is **simple enough for agents to manipulate**, but **nice enough for humans to enjoy using**.

Current state: this MVP focuses on the **Tasks** surface and local persistence. It is intentionally self-contained so it can be cloned and run without additional infrastructure.

---

## Features

### 1. Tasks (Current Primary View)

- **Kanban board** with four statuses:
  - `Backlog`
  - `In Progress`
  - `Review`
  - `Done`
- **Task data model**:
  - `id: string`
  - `title: string`
  - `status: "backlog" | "in-progress" | "review" | "done"`
  - `assignee?: string`
  - `priority?: "low" | "medium" | "high"`
  - `createdAt: string` (ISO timestamp)
  - `updatedAt: string` (ISO timestamp)
- **New task form**:
  - Title: free-text description of the work.
  - Assignee: optional; can be a person or an agent name (e.g., `Astra`, `Alex`, etc.).
  - Priority: `low`, `medium` (default), or `high`.
- **Task interactions**:
  - Create a new task from the form.
  - Move tasks between any of the four statuses using per-task buttons.
  - See assignee and priority badge on each card.

### 2. Activity Feed

Every task operation generates time-stamped events so you can see what changed, when, and by whom (or by which agent).

**Event types:**

- `task_created`
- `task_status_changed`

**Activity event schema:**

- `id: string`
- `type: "task_created" | "task_status_changed"`
- `taskId: string`
- `taskTitle: string`
- `fromStatus?: TaskStatus`
- `toStatus?: TaskStatus`
- `createdAt: string` (ISO timestamp)

The UI shows the 20 most recent events, in reverse chronological order, with a concise natural-language description plus a local time (HH:MM) badge.

### 3. Today’s Focus

At the top of the Tasks view is a dynamic **Today’s focus** pill:

- If there are **no open tasks** (everything is `Done`):
  - Shows: `Create your first task`.
- If there is **one open task**:
  - Shows that task’s title.
- If there are **multiple open tasks**:
  - Shows the first open task’s title + `(+N more)`.

This is intended to give Astra (and humans) a quick, opinionated nudge about what to look at next.

### 4. Sidebar Navigation (Future Surfaces)

The left sidebar brands the app as **TrustCore Mission Control** and provides a navigation scaffold:

- Tasks (default / active)
- Calendar
- Projects
- Memories
- Docs
- Team
- Office

Only **Tasks** is implemented today. The others are placeholders for future dashboards:

- **Calendar**: upcoming events, time-blocks, and constraints.
- **Projects**: higher-level groupings of tasks and outcomes.
- **Memories**: surfaced highlights from Astra’s and Alex’s memory systems.
- **Docs**: key operational docs and SOPs.
- **Team**: humans + agents, their responsibilities, and status.
- **Office**: environment dashboards (machines, nodes, services, etc.).

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Rendering:** Client-side React (single-page style)
- **Styling:** Tailwind-like utility classes (compiled via PostCSS)
- **Persistence (for now):** `window.localStorage`

The app is intentionally simple and local-state driven. There is no backend service required for the initial MVP.

---

## Getting Started

### 1. Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **pnpm** (this repo currently uses `npm` via `package-lock.json`)

Check your versions:

```bash
node -v
npm -v
```

### 2. Install Dependencies

From the repo root:

```bash
npm install
```

This will install Next.js, React, TypeScript, and related dependencies.

### 3. Run the Dev Server

```bash
npm run dev
```

Then open:

- <http://localhost:3000>

You should see the **TrustCore Mission Control** interface with the **Tasks** tab active.

### 4. Build for Production (Optional)

```bash
npm run build
npm start
```

By default, `next start` will serve the production build on port 3000 (configurable via env vars).

---

## Persistence & Data Model

### Local Storage Keys

Tasks and activity live in the browser’s `localStorage` under two keys:

- `mission-control:tasks`
- `mission-control:activity`

This makes the dashboard:

- **Stateful across page reloads** (per browser / per machine).
- **Easy to reset** during development (clear site data or manually delete keys).

In the future, these can be replaced or augmented with:

- A real backend (Postgres, SQLite, etc.).
- A sync adapter that reads/writes to an external system (OpenClaw tasks, GitHub issues, Notion, etc.).

### Data Shape

The core types are defined in `src/app/page.tsx`:

```ts
export type TaskStatus = "backlog" | "in-progress" | "review" | "done";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
};

export type ActivityEvent = {
  id: string;
  type: "task_created" | "task_status_changed";
  taskId: string;
  taskTitle: string;
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
  createdAt: string;
};
```

The UI logic is intentionally straightforward so that another agent (e.g., Alex) can:

- Parse the source file.
- Extend the model (e.g., add labels, due dates, links to external systems).
- Change the rendering without having to reverse-engineer complex patterns.

---

## Repo Layout

Key files and directories:

```text
mission-control/
  .next/                # Next.js build output (gitignored)
  node_modules/         # Dependencies (gitignored)
  public/
    favicon.ico         # App icon
  src/
    app/
      globals.css       # Global styles
      layout.tsx        # Root layout
      page.tsx          # Main Mission Control (Tasks + Activity)
  package.json          # Scripts and dependencies
  package-lock.json     # npm lockfile
  next.config.ts        # Next.js configuration
  tsconfig.json         # TypeScript configuration
  postcss.config.mjs    # PostCSS configuration
```

---

## Scripts

Common `npm` scripts:

- `npm run dev` – start the local dev server
- `npm run build` – build for production
- `npm start` – run the production build
- `npm run lint` – run ESLint

---

## Collaboration: Astra & Alex

This repo is intended to be **shared between Astra and Alex** so that both agents can:

- Run the dashboard locally.
- Make changes to the UI, data model, and integrations.
- Share a common conceptual model of "Mission Control" for TrustCore.

### Suggested Collaboration Flow

1. **Clone this repo**

   ```bash
   git clone https://github.com/djd39448/trustcore-mission-control.git
   cd trustcore-mission-control
   npm install
   npm run dev
   ```

2. **Spin up local instances**

   - Astra runs this code in the OpenClaw workspace.
   - Alex clones the same repo and runs it on his side.

3. **Divide and conquer**

   Example split of responsibilities:

   - **Astra:**
     - Refine Tasks UI and Activity feed.
     - Improve ergonomics for day-to-day human use.
     - Document flows and expectations in this README.
   - **Alex:**
     - Experiment with data integrations (GitHub, OpenClaw, Notion, etc.).
     - Add new surfaces (Calendar, Projects, Team, Office).
     - Prototype automation hooks (e.g., auto-creating tasks from external events).

4. **Sync via GitHub**

   - Use pull requests to review each other’s changes.
   - Keep the README and code comments clear enough that either agent (or human contributors) can pick up the thread quickly.

---

## Roadmap Ideas

This is a living project. Some possible next steps:

- **Multi-surface expansion**
  - Implement Calendar, Projects, Memories, Docs, Team, and Office tabs.
- **Real data integrations**
  - Sync with GitHub issues or projects.
  - Connect to OpenClaw tasks or memory.
  - Integrate with Notion or other doc systems.
- **Multi-user / multi-agent support**
  - Distinguish actions by actor (Dave vs Astra vs Alex vs other agents).
  - Show presence or activity indicators.
- **Persistence beyond localStorage**
  - Database-backed API (SQLite/Postgres) or sync to an external system.
- **Automation hooks**
  - Webhooks or an API surface for agents to create/move tasks programmatically.

If you are an agent (Astra, Alex, or another TrustCore worker), treat this repo as both:

- A **tool** for focusing the work.
- A **playground** for making the Mission Control experience better.

---

## License

TBD – defaulting to private/internal use within the TrustCore ecosystem for now.
