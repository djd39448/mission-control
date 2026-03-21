/**
 * Actor Interface
 *
 * Purpose: Distinguish actions by Astra vs Alex vs Dave
 * TODO: Add actor selector UI component
 * TODO: Add actor validation
 * TODO: Add migration logic for existing tasks
 */

/**
 * Available actors in the system
 */
export type Actor = "Astra" | "Alex" | "Dave";

/**
 * Actor selector options for UI
 */
export const ACTORS: Actor[] = ["Astra", "Alex", "Dave"];

/**
 * Get current actor from localStorage
 * TODO: Add preference persistence
 * TODO: Add default actor fallback
 */
export function getCurrentActor(): Actor {
  if (typeof window === "undefined") {
    return "Astra"; // Default for server-side rendering
  }

  try {
    const actor = window.localStorage.getItem("mission-control:actor");
    if (actor && ACTORS.includes(actor as Actor)) {
      return actor as Actor;
    }
  } catch {
    // Ignore errors, return default
  }

  return "Astra"; // Default actor
}

/**
 * Set current actor in localStorage
 * TODO: Add preference persistence
 * TODO: Add validation
 */
export function setCurrentActor(actor: Actor): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem("mission-control:actor", actor);
  } catch {
    // Ignore errors
  }
}

/**
 * Updated Task interface with actor fields
 */
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  createdBy?: Actor;
  updatedBy?: Actor;
  createdAt: string;
  updatedAt: string;
}

/**
 * Updated ActivityEvent interface with actor field
 */
export interface ActivityEvent {
  id: string;
  type: "task_created" | "task_status_changed";
  taskId: string;
  taskTitle: string;
  actor: Actor;
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
  createdAt: string;
}

/**
 * Type for TaskStatus (backward compatible)
 */
export type TaskStatus = "backlog" | "in-progress" | "review" | "done";

/**
 * Check if actor is valid
 * TODO: Add more comprehensive validation
 */
export function isValidActor(actor: string): actor is Actor {
  return ACTORS.includes(actor as Actor);
}

/**
 * Migrate existing tasks to add actor fields
 * TODO: Add migration logic with timestamp
 * TODO: Add migration result reporting
 */
export function migrateTasksWithActors(tasks: Task[]): Task[] {
  return tasks.map((task) => ({
    ...task,
    createdBy: task.createdBy || getCurrentActor(),
    updatedBy: task.updatedBy || getCurrentActor(),
  }));
}

/**
 * Migrate existing activity events to add actor field
 * TODO: Add migration logic with timestamp
 * TODO: Add migration result reporting
 */
export function migrateActivityWithActor(activity: ActivityEvent[]): ActivityEvent[] {
  return activity.map((event) => ({
    ...event,
    actor: event.actor || getCurrentActor(),
  }));
}