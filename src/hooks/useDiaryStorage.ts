import { useEffect, useRef, useState } from "react";
import type { EntriesByDate } from "../types";

function localKey(id: string): string {
  return `eatprint:diary:${id}`;
}

function readLocal(id: string): EntriesByDate {
  try {
    const raw = localStorage.getItem(localKey(id));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocal(id: string, data: EntriesByDate): void {
  try {
    localStorage.setItem(localKey(id), JSON.stringify(data));
  } catch {
    // Storage full or unavailable — nothing more we can do client-side.
  }
}

/**
 * Loads a diary by id from /api/diary (Vercel Function → Upstash Redis) and
 * saves back to it on every change, debounced. localStorage is always kept
 * as a mirror: if the API is unreachable (local `vite dev` without
 * `vercel dev`, Upstash not configured yet, or a network hiccup), the diary
 * still loads and keeps working from the local copy — same "optional cloud
 * layer, not a foundation" principle used for AI. `syncError` is exposed so
 * the UI can show a small, non-blocking note when the last save didn't
 * reach the server.
 *
 * MVP save model (intentionally simple — documented, not accidental):
 *  - the ENTIRE diary blob is saved on every update, not a diff/patch
 *  - there is no merge logic between concurrent writers
 *  - if two tabs or devices edit around the same time, the LAST write to
 *    reach the server wins and silently overwrites the other's changes
 *  - this is acceptable for a single-person MVP diary, but would need a
 *    real conflict strategy (versioning, per-entry storage, etc.) before
 *    this could safely support simultaneous multi-device editing
 */
export function useDiaryStorage(id: string) {
  const [entriesByDate, setEntriesByDate] = useState<EntriesByDate>({});
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    hasLoadedRef.current = false;

    fetch(`/api/diary?id=${encodeURIComponent(id)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`status ${res.status}`))))
      .then((data: { entriesByDate?: EntriesByDate }) => {
        if (cancelled) return;
        const loaded = data.entriesByDate ?? readLocal(id);
        setEntriesByDate(loaded);
        writeLocal(id, loaded);
      })
      .catch(() => {
        if (!cancelled) setEntriesByDate(readLocal(id));
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          hasLoadedRef.current = true;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!hasLoadedRef.current) return; // skip the save triggered by the initial load itself
    writeLocal(id, entriesByDate);

    const timeout = setTimeout(() => {
      fetch(`/api/diary?id=${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entriesByDate }),
      })
        .then((res) => setSyncError(!res.ok))
        .catch(() => setSyncError(true));
    }, 600); // debounce so rapid edits don't fire a request per keystroke

    return () => clearTimeout(timeout);
  }, [entriesByDate, id]);

  return { entriesByDate, setEntriesByDate, loading, syncError };
}
