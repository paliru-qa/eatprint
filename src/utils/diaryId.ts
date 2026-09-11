const STORAGE_KEY = "eatprint:diaryId";

function generateId(): string {
  // The diary link is effectively the access key, so it needs real
  // cryptographic randomness — not Math.random(), which is not designed to
  // be unpredictable. crypto.randomUUID() is the standard, simplest choice;
  // the getRandomValues() fallback covers the rare browser without it.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Reads the diary id from the URL ("?id=..."), falling back to whatever was
 * used last on this device, generating a brand new one only if neither
 * exists. The URL is always rewritten to include the id afterward, so the
 * address bar itself is the shareable, bookmarkable "account" — there is no
 * password and no server-side auth check. See DiaryLinkBanner for the
 * explicit "save this link" warning shown the first time an id is created.
 *
 * Identity model: the URL's id is the single source of truth whenever it's
 * present — localStorage is never allowed to override it. localStorage is
 * only consulted when the URL has NO id at all, to auto-resume the diary
 * last used on this device rather than silently spinning up a new, empty
 * one (which would look like the previous diary's data had vanished). The
 * moment a diary is resumed this way, the URL is rewritten to include its
 * id, so from then on the URL is authoritative again — localStorage is a
 * convenience for bootstrapping, never a second, competing identity.
 */
export function ensureDiaryId(): { id: string; isNew: boolean } {
  const url = new URL(window.location.href);
  const fromUrl = url.searchParams.get("id");
  if (fromUrl) {
    localStorage.setItem(STORAGE_KEY, fromUrl);
    return { id: fromUrl, isNew: false };
  }

  const fromStorage = localStorage.getItem(STORAGE_KEY);
  const isNew = !fromStorage;
  const id = fromStorage || generateId();
  localStorage.setItem(STORAGE_KEY, id);

  url.searchParams.set("id", id);
  window.history.replaceState({}, "", url.toString());

  return { id, isNew };
}
