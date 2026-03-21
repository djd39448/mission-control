/**
 * Mission Control Storage Utilities
 *
 * Re-exports for convenience
 */

export type { StorageAdapter, STORAGE_NAMESPACES } from './storage';
export type { LocalStorageAdapter } from './storage.adapter';
export { localStorageAdapter } from './storage.adapter';
export { buildStorageKey } from './storage';

// Re-exports for JSON I/O
export {
  exportToJSON,
  downloadExport,
  importFromJSON,
  handleFileUpload,
  type ExportData,
  type Task,
  type ActivityEvent,
} from './json-io';

// Re-exports for Actor identity
export {
  getCurrentActor,
  setCurrentActor,
  type Actor,
  ACTORS,
} from './actor';

// Re-exports for error handling
export {
  StorageError,
  TaskError,
  ActivityError,
  AppError,
  safeLocalStorageOperation,
  safeStateUpdate,
  validateTask,
  validateActivityEvent,
  exportWithErrorHandling,
  importWithErrorHandling,
} from './errors';