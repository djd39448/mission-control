/**
 * Projects View - Projects and Task Groupings
 *
 * Displays projects with task groupings and progress indicators.
 * Shows project outcomes and completion status.
 */

"use client";

import { useState, useMemo } from "react";
import type { Task, ActivityEvent } from "../lib/json-io";

const EVENTS_PER_DAY = 3;
const MAX_EVENTS = 7;

export type Project = {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
  status: "active" | "completed" | "on-hold";
  priority?: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  targetDate?: string;
};

export type ProjectsViewProps = {
  tasks: Task[];
  activity: ActivityEvent[];
};

// TODO: Add project creation modal
// TODO: Add project editing capabilities
// TODO: Add project deletion with confirmation
// TODO: Add project tagging system
// TODO: Add project filtering and search

export default function ProjectsView({ tasks, activity }: ProjectsViewProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Add time-block visualization for project milestones
  // TODO: Add project progress tracking (completion percentage)
  // TODO: Add project dependencies visualization
  // TODO: Add project team member assignment

  // Generate projects from tasks
  const projects = useMemo(() => {
    // Group tasks by title as project groups for MVP
    const projectMap = new Map<string, Project>();

    tasks.forEach((task) => {
      if (task.status === "done") return;

      const title = task.title.split(":")[0].trim() || "Untitled Project";

      if (!projectMap.has(title)) {
        projectMap.set(title, {
          id: `proj-${title.toLowerCase().replace(/\s+/g, "-")}`,
          title,
          description: `${task.title}`,
          tasks: [],
          status: "active",
          priority: task.priority,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        });
      }

      const project = projectMap.get(title);
      if (project) {
        project.tasks.push(task);
      }
    });

    return Array.from(projectMap.values());
  }, [tasks]);

  // Filter projects by search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;

    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  // Calculate project completion percentage
  const getProjectProgress = useMemo(() => {
    return (project: Project) => {
      if (project.tasks.length === 0) return 0;
      const completedTasks = project.tasks.filter((t) => t.status === "done").length;
      return Math.round((completedTasks / project.tasks.length) * 100);
    };
  }, []);

  // Get active tasks for selected project
  const selectedProjectTasks = useMemo(() => {
    if (!selectedProject) return [];
    return tasks.filter((t) => t.status !== "done" && t.title.includes(projects.find((p) => p.id === selectedProject)?.title));
  }, [tasks, selectedProject, projects]);

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
                item.id === "projects"
                  ? "flex w-full items-center justify-between rounded-md bg-neutral-800 px-3 py-2 text-neutral-50"
                  : "flex w-full items-center justify-between rounded-md px-3 py-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
              }
            >
              <span>{item.label}</span>
              {item.id === "projects" && (
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
              Projects
            </h1>
            <p className="text-xs text-neutral-500 sm:text-sm">
              Project management and task groupings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none sm:w-48 sm:px-3 sm:py-1.5 sm:text-sm"
            />
            <button
              type="button"
              className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-[10px] text-neutral-300 hover:border-emerald-500 hover:text-emerald-300 sm:text-xs"
            >
              New Project
            </button>
          </div>
        </header>

        {/* Projects List */}
        <section className="mb-4">
          <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full rounded-lg border border-dashed border-neutral-800 bg-neutral-950/60 p-8 text-center text-neutral-500">
                <p className="text-sm">
                  {searchQuery
                    ? `No projects found matching "${searchQuery}"`
                    : "Create tasks to see project groups"}
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const progress = getProjectProgress(project);
                const completedTasks = project.tasks.filter((t) => t.status === "done").length;
                const activeTasks = project.tasks.length - completedTasks;

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedProject(project.id)}
                    className={`group rounded-lg border p-3 text-left transition-all ${
                      selectedProject === project.id
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-neutral-900 bg-neutral-950/50 hover:border-neutral-700"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="font-medium text-neutral-100 text-sm">
                        {project.title}
                      </h3>
                      {project.priority === "high" && (
                        <span className="text-[10px] rounded-full bg-red-500/20 px-1.5 py-0.5 text-red-400">High</span>
                      )}
                    </div>
                    {project.description && (
                      <p className="mb-3 text-xs text-neutral-500">
                        {project.description}
                      </p>
                    )}
                    <div className="mb-3">
                      <div className="mb-1 flex items-center justify-between text-[10px] text-neutral-400">
                        <span>Progress</span>
                        <span>{completedTasks}/{project.tasks.length} tasks</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-neutral-800">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <span className="rounded-full bg-neutral-900 px-1.5 py-0.5 text-[10px] text-neutral-300">
                          {activeTasks} active
                        </span>
                      </span>
                      {project.status === "active" && (
                        <span className="text-emerald-400">Active</span>
                      )}
                      {project.status === "completed" && (
                        <span className="text-amber-400">Completed</span>
                      )}
                      {project.status === "on-hold" && (
                        <span className="text-neutral-400">On Hold</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* Project Details */}
        {selectedProject && (
          <section className="flex flex-1 flex-col gap-4 sm:flex-row">
            {/* Project Tasks */}
            <div className="flex min-h-[260px] flex-1 rounded-lg border border-neutral-900 bg-black/40 p-3 sm:p-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-neutral-400">
                  <h2 className="font-semibold">Project Tasks</h2>
                  <span className="rounded-full bg-neutral-900 px-1.5 py-0.5 text-[10px] text-neutral-500">
                    {selectedProjectTasks.length} tasks
                  </span>
                </div>
                {selectedProjectTasks.length === 0 ? (
                  <div className="rounded-md border border-dashed border-neutral-800 bg-neutral-950/60 p-3 text-xs text-neutral-500">
                    No active tasks for this project.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedProjectTasks.map((task) => (
                      <article
                        key={task.id}
                        className="group rounded-md border border-neutral-800 bg-neutral-950/80 p-2 text-xs text-neutral-100 shadow-sm"
                      >
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <h3 className="font-medium text-neutral-50">
                            {task.title}
                          </h3>
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
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Project Outcomes */}
            <aside className="min-h-[260px] w-full rounded-lg border border-neutral-900 bg-black/50 p-3 text-xs text-neutral-400 sm:w-72 sm:p-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                  Project Outcomes
                </h2>
                <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-500">
                  {projects.find((p) => p.id === selectedProject)?.tasks.filter((t) => t.status === "done").length} done
                </span>
              </div>
              {selectedProjectTasks.length === 0 ? (
                <p className="text-xs text-neutral-500">
                  Complete tasks to track outcomes.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {projects
                    .find((p) => p.id === selectedProject)
                    ?.tasks.filter((t) => t.status === "done")
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
                          <span className="text-[9px] text-emerald-400">✓ Completed</span>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </aside>
          </section>
        )}

        {!selectedProject && filteredProjects.length > 0 && (
          <section className="flex flex-1 flex-col gap-4 sm:flex-row">
            <aside className="min-h-[260px] w-full rounded-lg border border-neutral-900 bg-black/50 p-3 text-xs text-neutral-400 sm:w-72 sm:p-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                  Project Summary
                </h2>
                <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-500">
                  {filteredProjects.length} projects
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Select a project to view details and outcomes.
              </p>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}