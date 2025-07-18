// Performance optimization utilities

// Debounce function to limit function calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function to limit function calls
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoization helper for expensive calculations
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Performance measurement utility
export function measurePerformance<T extends (...args: any[]) => any>(
  name: string,
  func: T
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }) as T;
}

// Lazy loading helper for components
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(importFunc);
}

// Batch state updates to prevent excessive re-renders
export function batchUpdate<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  updates: Partial<T>[]
): void {
  setState(prevState => {
    return updates.reduce((acc, update) => ({ ...acc, ...update }), prevState);
  });
}

// Optimize localStorage operations
export const localStorageOptimizer = {
  // Batch localStorage reads
  batchGet: (keys: string[]) => {
    return keys.reduce((acc, key) => {
      try {
        const value = localStorage.getItem(key);
        if (value !== null) {
          acc[key] = JSON.parse(value);
        }
      } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
      }
      return acc;
    }, {} as Record<string, any>);
  },

  // Batch localStorage writes
  batchSet: (data: Record<string, any>) => {
    Object.entries(data).forEach(([key, value]) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
      }
    });
  },

  // Safe localStorage operations with error handling
  safeGet: (key: string, defaultValue: any = null) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  safeSet: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      return false;
    }
  }
};

// React import for lazy loading
import React from 'react'; 