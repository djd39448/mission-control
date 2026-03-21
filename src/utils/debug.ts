/**
 * Mission Control Debugging Utilities
 *
 * Purpose: Centralized logging and debugging utilities for consistent debugging across the application.
 * Usage: import { log, error, debug } from '@/utils/debug'
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const DEBUG_PREFIX = '[MissionControl]';

/**
 * Log info message
 * @param message - The message to log
 * @param data - Optional additional data to log
 */
export function log(message: string, data?: unknown) {
  console.log(`${DEBUG_PREFIX} ${message}`, data || '');
}

/**
 * Log warning message
 * @param message - The warning message to log
 * @param data - Optional additional data to log
 */
export function warn(message: string, data?: unknown) {
  console.warn(`${DEBUG_PREFIX} ${message}`, data || '');
}

/**
 * Log error message
 * @param message - The error message to log
 * @param error - Optional error object for stack trace
 */
export function error(message: string, error?: unknown) {
  console.error(`${DEBUG_PREFIX} ${message}`, error || '');
}

/**
 * Log debug message (only in development)
 * @param message - The debug message to log
 * @param data - Optional additional data to log
 */
export function debug(message: string, data?: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`${DEBUG_PREFIX} ${message}`, data || '');
  }
}

/**
 * Validate task data
 * @param task - Task to validate
 * @returns True if valid, false otherwise
 */
export function isValidTask(task: unknown): task is Task {
  if (!task || typeof task !== 'object') return false;

  const t = task as Task;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.status === 'string' &&
    ['backlog', 'in-progress', 'review', 'done'].includes(t.status) &&
    (t.assignee === undefined || typeof t.assignee === 'string') &&
    (t.priority === undefined || ['low', 'medium', 'high'].includes(t.priority)) &&
    typeof t.createdAt === 'string' &&
    typeof t.updatedAt === 'string'
  );
}

/**
 * Validate activity event
 * @param event - Event to validate
 * @returns True if valid, false otherwise
 */
export function isValidActivityEvent(event: unknown): event is ActivityEvent {
  if (!event || typeof event !== 'object') return false;

  const e = event as ActivityEvent;
  return (
    typeof e.id === 'string' &&
    typeof e.type === 'string' &&
    typeof e.taskId === 'string' &&
    typeof e.taskTitle === 'string' &&
    (e.fromStatus === undefined || typeof e.fromStatus === 'string') &&
    (e.toStatus === undefined || typeof e.toStatus === 'string') &&
    typeof e.createdAt === 'string'
  );
}