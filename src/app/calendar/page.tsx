/**
 * Calendar View - Tasks and Events Display
 *
 * TODO: Implement calendar grid with current month
 * TODO: Add event cards for tasks
 * TODO: Add time-block visualization
 * TODO: Add event creation modal
 */

"use client";

import { useState, useMemo } from "react";
import type { Task, ActivityEvent } from "../lib/json-io";

const EVENTS_PER_DAY = 3;
const MAX_EVENTS = 7;

export type CalendarViewProps = {
  tasks: Task[];
  activity: ActivityEvent[];
};

export default function CalendarView({ tasks, activity }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // TODO: Generate calendar days for current month
  // TODO: Filter tasks by date or activity events
  const days = useMemo(() => {
    // Placeholder: return empty array
    return [];
  }, [selectedDate]);

  // TODO: Render calendar grid
  // TODO: Render event cards
  // TODO: Handle task clicking to navigate to Tasks view

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Sidebar navigation - reuse from main page */}
      <aside className="hidden w-64 flex-col border-r border-neutral-800 bg-black/80 px-4 py-6 sm:flex">
        <div className="mb-6 px-2">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            TrustCore
          </div>
          <div className="mt-1 text-lg font-semibold">Mission Control</div>
        </div>
        <nav className="space-y-1 text-sm">
          {[
            { id: "tasks", label: "Tasks" },
            { id: "calendar", label: "Calendar" },
            { id: "projects", label: "Projects" },
            { id: "memories", label: "Memories" },
            { id: "docs", label: "Docs" },
            { id: "team", label: "Team" },
            { id: "office", label: "Office" },
          ].map((item) => (
            <button
              key={item.id}
              className={
                item.id === "calendar"
                  ? "flex w-full items-center justify-between rounded-md bg-neutral-800 px-3 py-2 text-neutral-50"
                  : "flex w-full items-center justify-between rounded-md px-3 py-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
              }
            >
              <span>{item.label}</span>
              {item.id === "calendar" && (
                <span className="rounded-full bg-emerald-500/20 px-2 text-[10px] font-medium text-emerald-400">
                  default
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 text-xs text-neutral-500">
          Astra
          <span className="text-neutral-600">·</span> Chief of Staff
        </div>
      </aside>

      <main className="flex min-h-screen flex-1 flex-col bg-gradient-to-b from-neutral-950 to-neutral-950/95 px-4 py-4 sm:px-8 sm:py-6">
        <header className="mb-4 flex items-center justify-between gap-4 border-b border-neutral-900 pb-3">
          <div>
            <h1 className="text-lg font-semibold text-neutral-50 sm:text-xl">
              Calendar
            </h1>
            <p className="text-xs text-neutral-500 sm:text-sm">
              Tasks and events for today and upcoming days.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                // TODO: Navigate to previous month
              }}
              className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-[10px] text-neutral-300 hover:border-emerald-500 hover:text-emerald-300 sm:text-xs"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => {
                // TODO: Navigate to next month
              }}
              className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-[10px] text-neutral-300 hover:border-emerald-500 hover:text-emerald-300 sm:text-xs"
            >
              Next →
            </button>
          </div>
        </header>

        {/* Calendar Grid */}
        <section className="mb-4 rounded-lg border border-neutral-900 bg-black/40 p-4">
          {/* TODO: Render month header */}
          {/* TODO: Render day headers */}
          {/* TODO: Render calendar grid with days and events */}
          <div className="rounded-md border border-dashed border-neutral-800 bg-neutral-950/60 p-8 text-center text-neutral-500">
            <p className="text-sm">Calendar view in development.</p>
          </div>
        </section>

        {/* Events List */}
        <section className="flex flex-1 flex-col gap-4 sm:flex-row">
          {/* TODO: Render tasks for selected date */}
          {/* TODO: Render activity events for selected date */}
          <aside className="min-h-[260px] w-full rounded-lg border border-neutral-900 bg-black/50 p-3 text-xs text-neutral-400 sm:w-72 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                Today&apos;s Events
              </h2>
              <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-500">
                {tasks.filter((t) => t.status !== "done").length} tasks
              </span>
            </div>
            {tasks.filter((t) => t.status !== "done").length === 0 ? (
              <p className="text-xs text-neutral-500">
                No tasks for today. Create a task to get started.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {tasks
                  .filter((t) => t.status !== "done")
                  .slice(0, 20)
                  .map((task) => (
                    <li
                      key={task.id}
                      className="rounded-md border border-neutral-800 bg-neutral-950/80 p-2 text-xs text-neutral-100"
                    >
                      <div className="mb-1">
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 text-[10px] text-neutral-500">
                        {task.assignee && (
                          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-300">
                            {task.assignee}
                          </span>
                        )}
                        {task.priority && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px]"
                            data-priority={task.priority}
                          >
                            {task.priority === "high" && (
                              <span className="text-red-400">●● High</span>
                            )}
                            {task.priority === "medium" && (
                              <span className="text-amber-300">● Medium</span>
                            )}
                            {task.priority === "low" && (
                              <span className="text-emerald-300">● Low</span>
                            )}
                          </span>
                        )}
                      </div>
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