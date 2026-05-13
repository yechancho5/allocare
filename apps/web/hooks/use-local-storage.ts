"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      window.localStorage.removeItem(key);
      setValue(fallback);
    } finally {
      setReady(true);
    }
  }, [fallback, key]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, ready, value]);

  return [value, setValue, ready] as const;
}
