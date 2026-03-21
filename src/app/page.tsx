/**
 * Mission Control - Tasks View with Storage Adapter
 *
 * Uses StorageAdapter for persistence instead of direct localStorage calls.
 * TODO: Add error boundaries, loading states, and optimistic updates
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { localStorageAdapter, STORAGE_NAMESPACES } from "@/lib/storage";
import {
  exportToJSON,
  downloadExport,
  importFromJSON,
  handleFileUpload,
  type ExportData,
  type Task,
  type ActivityEvent,
} from "@/lib/json-io";
import {
  getCurrentActor,
  setCurrentActor,
  type Actor,
  ACTORS,
} from "@/lib/actor";
import {
  safeLocalStorageOperation,
  validateTask,
  validateActivityEvent,
  AppError,
} from "@/lib/errors";

// TODO: Add TypeScript strict mode enforcement
// TODO: Consider adding error boundary for localStorage errors
// TODO: Add optimistic updates for better UX

const navItems = [
  { id: "tasks", label: "Tasks" },
  { id: "calendar", label: "Calendar" },
  { id: "projects", label: "Projects" },
  { id: "memories", label: "Memories" },
  { id: "docs", label: "Docs" },
  { id: "team", label: "Team" },
  { id: "office", label: "Office" },
] as const;

const STATUSES = ["backlog", "in-progress", "review", "done"] as const;

const STATUS_LABELS: Record<(typeof STATUSES)[number], string> = {
  "backlog": "Backlog",
  "in-progress": "In Progress",
  "review": "Review",
  "done": "Done",
};

export type TaskStatus = (typeof STATUSES)[number];

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  createdBy?: Actor;
  updatedBy?: Actor;
  createdAt: string;
  updatedAt: string;
};

export type ActivityEvent = {
  id: string;
  type: "task_created" | "task_status_changed";
  taskId: string;
  taskTitle: string;
  actor: Actor;
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
  createdAt: string;
};

// TODO: Add state for import feedback/notifications
// TODO: Add input validation and error handling for import

// TODO: Use STORAGE_NAMESPACES constant instead of magic strings
const STORAGE_KEY_TASKS = "mission-control:tasks";
const STORAGE_KEY_ACTIVITY = "mission-control:activity";

// TODO: Consider adding retry logic for localStorage failures
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export default function Home() {
  // TODO: Use storage adapter instead of direct localStorage calls
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage<Task[]>(STORAGE_KEY_TASKS, [])
  );
  const [activity, setActivity] = useState<ActivityEvent[]>(() =>
    loadFromStorage<ActivityEvent[]>(STORAGE_KEY_ACTIVITY, [])
  );

  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );

  // TODO: Add actor selector UI
  const currentActor = useMemo(() => getCurrentActor(), []);

  // TODO: Add actor selector in Tasks view for changing current actor
  // TODO: Add visual indicator for current actor

  // TODO: Add state for import feedback (success/error messages)
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // TODO: Use adapter.set() instead of direct localStorage.setItem
  useEffect(() => {
    saveToStorage(STORAGE_KEY_TASKS, tasks);
  }, [tasks]);

  // TODO: Use adapter.set() instead of direct localStorage.setItem
  useEffect(() => {
    saveToStorage(STORAGE_KEY_ACTIVITY, activity);
  }, [activity]);

  const tasksByStatus = useMemo(() => {
    return STATUSES.reduce((acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks]);

  // TODO: Add input validation and error handling
  function addTask() {
    const title = newTitle.trim();
    if (!title) return;
    const now = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const task: Task = {
      id,
      title,
      status: "backlog",
      assignee: newAssignee.trim() || undefined,
      priority: newPriority,
      createdBy: currentActor,
      updatedBy: currentActor,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [task, ...prev]);
    setActivity((prev) => [
      {
        id: `act-${id}`,
        type: "task_created",
        taskId: id,
        taskTitle: title,
        actor: currentActor,
        createdAt: now,
      },
      ...prev,
    ]);
    setNewTitle("");
    setNewAssignee("");
    setNewPriority("medium");
  }

  // TODO: Add input validation and error handling
  function moveTask(id: string, toStatus: TaskStatus) {
    setTasks((prev) => {
      const next = [...prev];
      const index = next.findIndex((t) => t.id === id);
      if (index === -1) return prev;
      const task = next[index];
      if (task.status === toStatus) return prev;
      const fromStatus = task.status;
      const updated: Task = {
        ...task,
        status: toStatus,
        updatedBy: currentActor,
        updatedAt: new Date().toISOString(),
      };
      next[index] = updated;
      const event: ActivityEvent = {
        id: `act-${updated.id}-${Date.now()}`,
        type: "task_status_changed",
        taskId: updated.id,
        taskTitle: updated.title,
        actor: currentActor,
        fromStatus,
        toStatus,
        createdAt: updated.updatedAt,
      };
      setActivity((prevActivity) => [event, ...prevActivity]);
      return next;
    });
  }

  // TODO: Add import handler with state updates and error handling
  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const result = await handleFileUpload(event);

    if (result.success && result.tasks && result.activity) {
      // TODO: Add confirmation dialog for merge vs replace
      // TODO: Update state with imported data
      setTasks(result.tasks);
      setActivity(result.activity);
      setImportStatus("Import successful!");

      // TODO: Add auto-save with imported data
    } else {
      setImportStatus(
        result.error || "Failed to import data. Please check the file format."
      );

      // TODO: Show error notification or toast
    }

    // TODO: Clear file input and status after delay
  }

  const todaysFocus = useMemo(() => {
    const openTasks = tasks.filter((t) => t.status !== "done");
    if (openTasks.length === 0) return "Create your first task";
    if (openTasks.length === 1) return openTasks[0].title;
    return `${openTasks[0].title} (+${openTasks.length - 1} more)`;
  }, [tasks]);

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-neutral-800 bg-black/80 px-4 py-6 sm:flex">
        <div className="mb-6 px-2">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            TrustCore
          </div>
          <div className="mt-1 text-lg font-semibold">Mission Control</div>
        </div>
        <nav className="space-y-1 text-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={
                item.id === "tasks"
                  ? "flex w-full items-center justify-between rounded-md bg-neutral-800 px-3 py-2 text-neutral-50"
                  : "flex w-full items-center justify-between rounded-md px-3 py-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
              }
            >
              <span>{item.label}</span>
              {item.id === "tasks" && (
                <span className="rounded-full bg-emerald-500/20 px-2 text-[10px] font-medium text-emerald-400">
                  default
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 text-xs text-neutral-500">
          <div className="mb-2">Current Actor:</div>
          <select
            value={currentActor}
            onChange={(e) => {
              setCurrentActor(e.target.value as Actor);
            }}
            className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none"
          >
            {ACTORS.map((actor) => (
              <option key={actor} value={actor}>
                {actor}
              </option>
            ))}
          </select>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex min-h-screen flex-1 flex-col bg-gradient-to-b from-neutral-950 to-neutral-950/95 px-4 py-4 sm:px-8 sm:py-6">
        {/* Top bar */}
        <header className="mb-4 flex items-center justify-between gap-4 border-b border-neutral-900 pb-3">
          <div>
            <h1 className="text-lg font-semibold text-neutral-50 sm:text-xl">
              Tasks
            </h1>
            <p className="text-xs text-neutral-500 sm:text-sm">
              Kanban + activity feed for Astra and the TrustCore agent team.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 sm:gap-4">
            <span className="hidden sm:inline">Today&apos;s focus:</span>
            <span className="rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-medium text-emerald-400">
              {todaysFocus}
            </span>
            <button
              type="button"
              onClick={() => {
                const exportData = exportToJSON(tasks, activity);
                downloadExport(exportData);
              }}
              className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-[10px] text-neutral-300 hover:border-emerald-500 hover:text-emerald-300 sm:text-xs"
            >
              Export JSON
            </button>
          </div>
        </header>

        {/* Task creation */}
        <section className="mb-4 rounded-lg border border-neutral-900 bg-black/40 p-3 text-xs sm:p-4 sm:text-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
              New task
            </h2>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="What needs to happen next?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 rounded-md border border-neutral-800 bg-neutral-950/70 px-2 py-1 text-xs text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none sm:px-3 sm:py-1.5 sm:text-sm"
            />
            <input
              type="text"
              placeholder="Assignee (optional)"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950/70 px-2 py-1 text-xs text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none sm:w-40 sm:px-3 sm:py-1.5 sm:text-sm"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as any)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950/70 px-2 py-1 text-xs text-neutral-100 focus:border-emerald-500 focus:outline-none sm:w-32 sm:px-3 sm:py-1.5 sm:text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              type="button"
              onClick={addTask}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTask();
                }
              }}
              className="w-full rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-neutral-950 sm:w-auto sm:text-sm"
            >
              Add task
            </button>
            <label className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-emerald-500 hover:text-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-neutral-950 sm:w-auto sm:text-sm">
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            {importStatus && (
              <span
                className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                  importStatus.includes("success")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {importStatus}
              </span>
            )}
          </div>
        </section>

        {/* Task board layout */}
        <section className="flex flex-1 flex-col gap-4 sm:flex-row">
          {/* Kanban columns */}
          <div className="flex min-h-[260px] flex-1 gap-3 rounded-lg border border-neutral-900 bg-black/40 p-3 sm:p-4">
            {STATUSES.map((status) => {
              const columnTasks = tasksByStatus[status];
              return (
                <div key={status} className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-neutral-400">
                    <h2 className="font-semibold">{STATUS_LABELS[status]}</h2>
                    <span className="rounded-full bg-neutral-900 px-1.5 py-0.5 text-[10px] text-neutral-500">
                      {columnTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {columnTasks.length === 0 ? (
                      <div className="rounded-md border border-dashed border-neutral-800 bg-neutral-950/60 p-3 text-xs text-neutral-500">
                        No tasks here yet.
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <article
                          key={task.id}
                          className="group relative rounded-md border border-neutral-800 bg-neutral-950/80 p-3 text-xs text-neutral-100 shadow-sm transition-all hover:border-neutral-700 hover:shadow-md"
                        >
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <h3 className="font-medium text-neutral-50">
                              {task.title}
                            </h3>
                            {task.assignee && (
                              <span className="flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-300">
                                <span>👤</span>
                                <span>{task.assignee}</span>
                              </span>
                            )}
                          </div>
                          <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[10px] text-neutral-400">
                            {task.priority && (
                              <span
                                className="rounded-full px-2 py-0.5 transition-colors"
                                data-priority={task.priority}
                              >
                                {task.priority === "high" && (
                                  <span className="flex items-center gap-1 text-red-400 hover:text-red-300">
                                    <span className="font-bold">●</span>
                                    <span>High</span>
                                  </span>
                                )}
                                {task.priority === "medium" && (
                                  <span className="flex items-center gap-1 text-amber-300 hover:text-amber-200">
                                    <span className="font-bold">●</span>
                                    <span>Medium</span>
                                  </span>
                                )}
                                {task.priority === "low" && (
                                  <span className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200">
                                    <span className="font-bold">●</span>
                                    <span>Low</span>
                                  </span>
                                )}
                              </span>
                            )}
                            <span className="flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-400">
                              <span>🕒</span>
                              <span>
                                {new Date(task.createdAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {STATUSES.filter((s) => s !== task.status).map(
                              (targetStatus) => (
                                <button
                                  key={targetStatus}
                                  type="button"
                                  onClick={() => moveTask(task.id, targetStatus)}
                                  className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-400 transition-colors hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                  → {STATUS_LABELS[targetStatus]}
                                </button>
                              )
                            )}
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity feed */}
          <aside className="min-h-[260px] w-full rounded-lg border border-neutral-900 bg-black/50 p-3 text-xs text-neutral-400 sm:w-72 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                Activity
              </h2>
              <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-500">
                live feed
              </span>
            </div>
            {activity.length === 0 ? (
              <p className="text-xs text-neutral-500">
                No activity yet. As you create and move tasks, events will
                appear here.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {activity.slice(0, 20).map((event) => (
                  <li key={event.id} className="leading-snug">
                    <span className="text-neutral-300">
                      <span className="font-medium">{event.actor}</span>
                    </span>{" "}
                    <span className="text-neutral-100">
                      &ldquo;{event.taskTitle}&rdquo;
                    </span>{" "}
                    {event.type === "task_created" ? (
                      <span>created the task</span>
                    ) : (
                      <span>
                        moved {event.fromStatus ? `from ${STATUS_LABELS[event.fromStatus!]} to ` : "to "}
                        <span className="font-medium text-emerald-300">{STATUS_LABELS[event.toStatus!]}</span>
                      </span>
                    )}
                    <span className="ml-1 text-[10px] text-neutral-500">
                      {new Date(event.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}