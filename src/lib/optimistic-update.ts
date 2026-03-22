/**
 * Optimistic Update Hook
 *
 * Purpose: Execute state updates optimistically and revert on failure
 * Usage: import { useOptimisticUpdate } from '@/lib/optimistic-update'
 */

import { useState, useCallback } from 'react';

/**
 * Hook for optimistic updates
 * @param updateFn - Function to execute that returns the new state
 * @param onRevert - Callback to revert state on failure
 */
export function useOptimisticUpdate<T>(
  updateFn: () => T,
  onRevert?: () => void
) {
  const [state, setState] = useState<T | null>(null);

  const commit = useCallback(() => {
    const newState = updateFn();
    setState(newState);
    return newState;
  }, [updateFn]);

  const rollback = useCallback(() => {
    onRevert?.();
  }, [onRevert]);

  return { state, commit, rollback };
}