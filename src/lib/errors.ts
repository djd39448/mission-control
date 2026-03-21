/**
 * Error Types and Utilities
 *
 * Purpose: Provide consistent error handling for localStorage operations and UI
 * TODO: Add comprehensive error boundary component
 * TODO: Add error notification toast component
 * TODO: Add error recovery strategies (retry, fallback, rollback)
 */

/**
 * Error types for localStorage operations
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly operation: "get" | "set" | "remove" | "clear",
    public readonly key?: string
  ) {
    super(message);
    this.name = "StorageError";
  }
}

/**
 * Error types for application logic
 */
export class TaskError extends Error {
  constructor(
    message: string,
    public readonly operation: "create" | "update" | "delete" | "move",
    public readonly taskId?: string
  ) {
    super(message);
    this.name = "TaskError";
  }
}

/**
 * Error types for activity feed
 */
export class ActivityError extends Error {
  constructor(
    message: string,
    public readonly operation: "add" | "remove" | "clear"
  ) {
    super(message);
    this.name = "ActivityError";
  }
}

/**
 * General application error
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Try-catch wrapper for localStorage operations with error logging
 * TODO: Add retry logic with exponential backoff
 * TODO: Add error recovery (fallback to in-memory storage)
 */
export function safeLocalStorageOperation<T>(
  operation: () => T,
  operationName: string
): T | null {
  try {
    return operation();
  } catch (error) {
    console.error(`[MissionControl] ${operationName} failed:`, error);
    return null;
  }
}

/**
 * Try-catch wrapper for state updates with error handling
 * TODO: Add optimistic update rollback on error
 * TODO: Add error boundary integration
 */
export function safeStateUpdate<T>(
  setState: (value: T) => void,
  updateFn: () => T,
  operationName: string
): void {
  try {
    setState(updateFn());
  } catch (error) {
    console.error(`[MissionControl] ${operationName} failed:`, error);
    // TODO: Show error message to user
  }
}

/**
 * Validate task data before saving
 * TODO: Add comprehensive validation rules
 * TODO: Add validation for task title length
 * TODO: Add validation for priority values
 */
export function validateTask(task: any): task is Task {
  if (!task || typeof task !== "object") {
    return false;
  }

  const t = task as any;
  return (
    typeof t.id === "string" &&
    typeof t.title === "string" &&
    t.title.trim().length > 0 &&
    typeof t.status === "string" &&
    ["backlog", "in-progress", "review", "done"].includes(t.status) &&
    (t.assignee === undefined || typeof t.assignee === "string") &&
    (t.priority === undefined || ["low", "medium", "high"].includes(t.priority)) &&
    typeof t.createdAt === "string" &&
    typeof t.updatedAt === "string"
  );
}

/**
 * Validate activity event data before saving
 * TODO: Add comprehensive validation rules
 * TODO: Add validation for actor field
 */
export function validateActivityEvent(event: any): event is ActivityEvent {
  if (!event || typeof event !== "object") {
    return false;
  }

  const e = event as any;
  return (
    typeof e.id === "string" &&
    typeof e.type === "string" &&
    ["task_created", "task_status_changed"].includes(e.type) &&
    typeof e.taskId === "string" &&
    typeof e.taskTitle === "string" &&
    e.taskTitle.trim().length > 0 &&
    typeof e.createdAt === "string"
  );
}

/**
 * Export data with validation and error handling
 * TODO: Add JSON schema validation
 * TODO: Add export error handling
 */
export function exportWithErrorHandling<T>(
  data: T,
  exportFn: (data: T) => string
): { success: boolean; error?: string } {
  try {
    const json = exportFn(data);
    return { success: true };
  } catch (error) {
    console.error("[MissionControl] Export failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Import data with validation and error handling
 * TODO: Add JSON schema validation
 * TODO: Add import merge strategy (replace vs merge)
 * TODO: Add import error handling
 */
export function importWithErrorHandling<T>(
  jsonString: string,
  importFn: (data: string) => { success: boolean; data?: T; error?: string }
): { success: boolean; data?: T; error?: string } {
  try {
    return importFn(jsonString);
  } catch (error) {
    console.error("[MissionControl] Import failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Task type definition (backward compatible)
 */
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

/**
 * Activity event type definition (backward compatible)
 */
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

/**
 * Task status type
 */
export type TaskStatus = "backlog" | "in-progress" | "review" | "done";

/**
 * Actor type
 */
export type Actor = "Astra" | "Alex" | "Dave";