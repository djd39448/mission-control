/**
 * Storage Adapter Interface
 *
 * Purpose: Decouple storage operations from implementation for easy future swap
 * to file/db/sync/etc. Uses namespace-based storage keys.
 *
 * @module storage
 */

/**
 * Storage adapter interface
 * Defines contract for storage operations
 */
export interface StorageAdapter {
  /**
   * Get value from storage by key and namespace
   * @param namespace - Storage namespace (e.g., 'tasks', 'activity')
   * @param key - Key within namespace
   * @param fallback - Fallback value if key doesn't exist
   * @returns Stored value or fallback
   */
  get<T = unknown>(namespace: string, key: string, fallback: T): T;

  /**
   * Set value in storage by key and namespace
   * @param namespace - Storage namespace
   * @param key - Key within namespace
   * @param value - Value to store
   */
  set<T>(namespace: string, key: string, value: T): void;

  /**
   * Remove value from storage by key and namespace
   * @param namespace - Storage namespace
   * @param key - Key within namespace
   */
  remove(namespace: string, key: string): void;

  /**
   * Clear all values from a namespace
   * @param namespace - Storage namespace to clear
   */
  clear(namespace: string): void;
}

/**
 * Default storage key prefixes
 */
export const STORAGE_NAMESPACES = {
  TASKS: 'mission-control:tasks',
  ACTIVITY: 'mission-control:activity',
} as const;

/**
 * Generate a full storage key from namespace and key
 * @param namespace - Storage namespace
 * @param key - Key within namespace
 * @returns Full storage key
 */
export function buildStorageKey(namespace: string, key: string): string {
  return `${namespace}:${key}`;
}