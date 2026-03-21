// StorageAdapter Interface
// Provides a standardized way to read/write data, making it easy to swap
// localStorage for other backends (file, DB, API) in the future.

export type TaskStatus = "backlog" | "in-progress" | "review" | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string;
  type: "task_created" | "task_status_changed";
  taskId: string;
  taskTitle: string;
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
  createdAt: string;
}

export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}