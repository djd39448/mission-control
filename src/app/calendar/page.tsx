/**
 * Calendar View - Tasks and Events Display
 *
 * Displays tasks in a calendar grid format with month navigation.
 * Shows active tasks for each day and allows date selection.
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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // TODO: Add time-block visualization for events
  // TODO: Add event creation modal
  // TODO: Handle task clicking to navigate to Tasks view

  // Generate calendar days for current month
  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    // Generate previous month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevDays = Array.from(
      { length: startDayOfWeek },
      (_, i) => prevMonthLastDay - startDayOfWeek + 1 + i
    );

    // Generate current month days
    const currentDays = Array.from({ length: totalDays }, (_, i) => i + 1);

    // Generate next month padding days
    const nextDaysNeeded = Math.max(
      0,
      (7 - ((startDayOfWeek + totalDays) % 7)) % 7
    );
    const nextDays = Array.from({ length: nextDaysNeeded }, (_, i) => i + 1);

    return [...prevDays, ...currentDays, ...nextDays];
  }, [currentMonth]);

  // Get month and year display strings
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Get day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Filter tasks for selected date
  const selectedDateTasks = useMemo(() => {
    return tasks.filter((t) => t.status !== "done");
  }, [tasks]);

  // Find tasks due on a specific date
  const tasksDueOnDate = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return tasks.filter((t) => t.createdAt.startsWith(dateStr));
  }, [tasks, selectedDate]);

  // Check if a date has tasks
  const hasTasksOnDate = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return tasks.some((t) => t.createdAt.startsWith(dateStr));
  }, [tasks, selectedDate]);

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
                setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
              }}
              className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-[10px] text-neutral-300 hover:border-emerald-500 hover:text-emerald-300 sm:text-xs"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
              }}
              className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-[10px] text-neutral-300 hover:border-emerald-500 hover:text-emerald-300 sm:text-xs"
            >
              Next →
            </button>
          </div>
        </header>

        {/* Calendar Grid */}
        <section className="mb-4 rounded-lg border border-neutral-900 bg-black/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span>Today: {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Day Headers */}
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wide text-neutral-500">
            {dayNames.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayDate = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day
              );
              const dateStr = dayDate.toISOString().split("T")[0];
              const dayTasks = tasks.filter((t) => t.createdAt.startsWith(dateStr));
              const isToday =
                dayDate.toDateString() === new Date().toDateString();
              const isSelected = dayDate.toDateString() === selectedDate.toDateString();

              if (day < 1) {
                // Previous month padding
                return (
                  <div key={`prev-${index}`} className="min-h-[80px] rounded-md border border-neutral-900 bg-neutral-950/30 p-2 text-center text-xs text-neutral-600">
                    {day}
                  </div>
                );
              }

              if (day > new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()) {
                // Next month padding
                return (
                  <div key={`next-${index}`} className="min-h-[80px] rounded-md border border-neutral-900 bg-neutral-950/30 p-2 text-center text-xs text-neutral-600">
                    {day}
                  </div>
                );
              }

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDate(dayDate)}
                  className={`min-h-[80px] rounded-md border p-2 text-center transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-neutral-900 bg-neutral-950/50 hover:border-neutral-700"
                  } ${isToday ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : ""}`}
                >
                  <div className={`text-sm font-medium ${isSelected || isToday ? "font-bold" : ""}`}>
                    {day}
                  </div>
                  {dayTasks.length > 0 && (
                    <div className="mt-1 flex flex-wrap justify-center gap-1">
                      <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] text-emerald-400">
                        {dayTasks.length}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Events List */}
        <section className="flex flex-1 flex-col gap-4 sm:flex-row">
          {/* TODO: Render tasks for selected date */}
          {/* TODO: Render activity events for selected date */}
          <aside className="min-h-[260px] w-full rounded-lg border border-neutral-900 bg-black/50 p-3 text-xs text-neutral-400 sm:w-72 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                Selected Date Tasks
              </h2>
              <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-500">
                {tasksDueOnDate.length} tasks
              </span>
            </div>
            {tasksDueOnDate.length === 0 ? (
              <p className="text-xs text-neutral-500">
                No tasks for {selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {tasksDueOnDate.slice(0, 20).map((task) => (
                  <li
                    key={task.id}
                    className="rounded-md border border-neutral-800 bg-neutral-950/80 p-2 text-xs text-neutral-100 hover:border-emerald-500/50 hover:bg-neutral-950/90 transition-colors"
                  >
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <span className="font-medium">{task.title}</span>
                      {task.priority === "high" && (
                        <span className="text-[9px] rounded-full bg-red-500/20 px-1.5 py-0.5 text-red-400">High</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-[10px] text-neutral-500">
                      {task.assignee && (
                        <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-300">
                          {task.assignee}
                        </span>
                      )}
                      {task.priority === "medium" && (
                        <span className="text-[9px] text-amber-300">● Medium</span>
                      )}
                      {task.priority === "low" && (
                        <span className="text-[9px] text-emerald-300">● Low</span>
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