import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * useFormDraft — auto-saves any form state to localStorage.
 *
 * @param key      Unique localStorage key, e.g. "draft:campaign:camp-123"
 * @param value    The current form value to persist
 * @param onChange Called with the restored value when a saved draft is found on mount
 * @returns        { hasDraft, clearDraft, lastSaved }
 *
 * Auto-saves 800 ms after the last change (debounced).
 * Call `clearDraft()` when the form is successfully submitted.
 */
export function useFormDraft<T>(
  key: string,
  value: T,
  onChange: (restored: T) => void
) {
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const isFirstRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── On mount: restore draft if one exists ──
  useEffect(() => {
    if (!key) return;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as { value: T; savedAt: string };
        if (parsed?.value) {
          onChange(parsed.value);
          setHasDraft(true);
          setLastSaved(new Date(parsed.savedAt));
        }
      }
    } catch {
      // malformed — ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // ── Auto-save: debounced 800ms after any change ──
  useEffect(() => {
    // Skip the very first render (which fires right after restore)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!key) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        const now = new Date();
        localStorage.setItem(key, JSON.stringify({ value, savedAt: now.toISOString() }));
        setHasDraft(true);
        setLastSaved(now);
      } catch {
        // storage full or unavailable — ignore
      }
    }, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [key, value]);

  // ── clearDraft: called after successful save ──
  const clearDraft = useCallback(() => {
    if (!key) return;
    try {
      localStorage.removeItem(key);
    } catch {}
    setHasDraft(false);
    setLastSaved(null);
  }, [key]);

  return { hasDraft, clearDraft, lastSaved };
}
