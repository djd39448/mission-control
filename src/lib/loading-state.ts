/**
 * Loading State Utility
 *
 * Purpose: Provide loading state utilities for async operations
 * Usage: import { useLoading, LoadingState } from '@/lib/loading-state'
 */

import { useState, useCallback } from 'react';

export type LoadingState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

/**
 * Hook for managing loading states
 * @param initialState - Initial data or null
 * @returns Loading state object and loading control functions
 */
export function useLoading<T>(initialState: T | null = null) {
  const [state, setState] = useState<LoadingState<T>>({
    data: initialState,
    loading: false,
    error: null,
  });

  const startLoading = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));
  }, []);

  const finishLoading = useCallback((data: T) => {
    setState({ data, loading: false, error: null });
  }, []);

  const failLoading = useCallback((error: Error) => {
    setState(prev => ({ ...prev, loading: false, error }));
  }, []);

  return {
    ...state,
    startLoading,
    finishLoading,
    failLoading,
  };
}

/**
 * Execute async function with loading state
 * @param asyncFn - Async function to execute
 * @param onSuccess - Callback on success
 * @param onError - Callback on error
 * @returns Loading state
 */
export function executeWithLoading<T>(
  asyncFn: () => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void
) {
  // This is a simplified version - in practice, integrate with useLoading hook
  console.log('[executeWithLoading] Not implemented yet');
}