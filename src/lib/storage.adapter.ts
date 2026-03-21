/**
 * Local Storage Adapter Implementation
 *
 * Implements StorageAdapter using browser localStorage
 *
 * @module storage
 */

import type { StorageAdapter, STORAGE_NAMESPACES } from './storage';

/**
 * LocalStorage adapter implementation
 */
export class LocalStorageAdapter implements StorageAdapter {
  /**
   * Get value from localStorage
   */
  get<T = unknown>(namespace: string, key: string, fallback: T): T {
    if (typeof window === 'undefined') {
      return fallback;
    }

    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        return fallback;
      }
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Failed to parse ${key}:`, error);
      return fallback;
    }
  }

  /**
   * Set value in localStorage
   */
  set<T>(namespace: string, key: string, value: T): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Failed to save ${key}:`, error);
    }
  }

  /**
   * Remove value from localStorage
   */
  remove(namespace: string, key: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Failed to remove ${key}:`, error);
    }
  }

  /**
   * Clear all values from a namespace
   */
  clear(namespace: string): void {
    const keysToClear = Object.keys(window.localStorage).filter((k) =>
      k.startsWith(namespace)
    );

    keysToClear.forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn(`[LocalStorageAdapter] Failed to remove ${key}:`, error);
      }
    });
  }
}

/**
 * Default storage instances
 */
export const localStorageAdapter = new LocalStorageAdapter();