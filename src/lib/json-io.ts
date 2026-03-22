/**
 * JSON Import/Export Utilities
 *
 * Purpose: Allow humans/agents to move state across machines
 * TODO: Add file upload handling for import
 * TODO: Add JSON schema validation
 * TODO: Add export with proper formatting and comments
 */

export interface ExportData {
  version: string;
  exportedAt: string;
  tasks: Task[];
  activity: ActivityEvent[];
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "backlog" | "in-progress" | "review" | "done";

export interface ActivityEvent {
  id: string;
  type: "task_created" | "task_status_changed";
  taskId: string;
  taskTitle: string;
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
  createdAt: string;
}

// TODO: Add import/merge strategy (replace vs merge)
// TODO: Add export filename timestamp
// TODO: Add validation for imported data integrity

/**
 * Export tasks and activity to JSON
 * TODO: Format output with proper structure and comments
 */
export function exportToJSON(tasks: Task[], activity: ActivityEvent[]): string {
  const data: ExportData = {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    tasks,
    activity,
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Import from JSON (placeholder for future implementation)
 * TODO: Implement file upload handling
 * TODO: Add validation and error handling
 * TODO: Add merge vs replace strategy
 */
export function importFromJSON(json: string): {
  success: boolean;
  tasks?: Task[];
  activity?: ActivityEvent[];
  error?: string;
} {
  // TODO: Parse JSON and validate structure
  // TODO: Check for required fields
  // TODO: Validate task statuses
  // TODO: Return success with data or error

  try {
    const data: ExportData = JSON.parse(json);

    // TODO: Add validation logic
    if (!data.tasks || !data.activity) {
      return {
        success: false,
        error: "Missing required fields: tasks or activity",
      };
    }

    return {
      success: true,
      tasks: data.tasks,
      activity: data.activity,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

/**
 * Download export data as file
 * TODO: Add proper filename with timestamp
 */
export function downloadExport(data: string, filename?: string): void {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `mission-control-export-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Upload import data from file (placeholder)
 * TODO: Implement file input handler
 */
export function handleFileUpload(event: Event): Promise<{
  success: boolean;
  data?: ExportData;
  error?: string;
}> {
  return new Promise((resolve) => {
    // TODO: Extract file from event
    // TODO: Read file content
    // TODO: Parse and validate
    // TODO: Return result

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      resolve({ success: false, error: "No file selected" });
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = importFromJSON(e.target?.result as string);
      resolve(result);
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: "Failed to read file",
      });
    };

    reader.readAsText(file);
  });
}