/**
 * Per-tab verification draft storage in IndexedDB (`editLogs` / `logs`).
 *
 * The verification-details components autosave drafts under the key
 * `${loanId}_${tab}`. This helper adds a server `updatedAt` stamp
 * (`baseUpdatedAt`) alongside the existing `timestamp` so that a draft
 * created on one device can be recognized as stale when the server row
 * has moved on (e.g. a VE has re-submitted on another device).
 *
 * Currently used by the PD verifier flow; FI paths continue to use the
 * existing inline IndexedDB calls.
 */

const DB_NAME = "editLogs";
const DB_VERSION = 1;
const STORE_NAME = "logs";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

function draftKey(loanId: number | string, tab: string): string {
  return `${loanId}_${tab}`;
}

/**
 * Load the saved draft for `${loanId}_${tab}`. If the server has moved
 * on since the draft was saved (`server.updatedAt > draft.baseUpdatedAt`)
 * or the draft predates this stamping scheme (no `baseUpdatedAt`), drop
 * the record and return null. Otherwise return the section map with
 * internal fields (id, timestamp, baseUpdatedAt) stripped.
 */
export async function loadDraft(
  loanId: number | string,
  tab: string,
  serverUpdatedAt: string | null | undefined
): Promise<Record<string, unknown> | null> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const key = draftKey(loanId, tab);

    const record = await new Promise<any>((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (!record) return null;

    const baseUpdatedAt = record.baseUpdatedAt as string | undefined;
    const stale =
      !baseUpdatedAt ||
      (serverUpdatedAt
        ? new Date(serverUpdatedAt).getTime() >
          new Date(baseUpdatedAt).getTime()
        : false);

    if (stale) {
      await new Promise<void>((resolve, reject) => {
        const del = store.delete(key);
        del.onsuccess = () => resolve();
        del.onerror = () => reject(del.error);
      });
      return null;
    }

    const { id: _id, timestamp: _ts, baseUpdatedAt: _base, ...rest } = record;
    return rest;
  } finally {
    db.close();
  }
}

/**
 * Upsert `sectionId → sectionData` into the draft record for
 * `${loanId}_${tab}`, refreshing `timestamp` and `baseUpdatedAt`.
 */
export async function saveDraftSection(
  loanId: number | string,
  tab: string,
  sectionId: string,
  sectionData: unknown,
  serverUpdatedAt: string | null | undefined
): Promise<void> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const key = draftKey(loanId, tab);

    const existing = await new Promise<any>((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    const record = {
      ...(existing ?? {}),
      id: key,
      [sectionId]: sectionData,
      timestamp: new Date().toISOString(),
      baseUpdatedAt: serverUpdatedAt ?? null,
    };

    await new Promise<void>((resolve, reject) => {
      const put = store.put(record);
      put.onsuccess = () => resolve();
      put.onerror = () => reject(put.error);
    });
  } finally {
    db.close();
  }
}

/**
 * Delete the draft record for `${loanId}_${tab}` (e.g. when an
 * EditRequest arrives on the verification).
 */
export async function deleteDraft(
  loanId: number | string,
  tab: string
): Promise<void> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await new Promise<void>((resolve, reject) => {
      const del = store.delete(draftKey(loanId, tab));
      del.onsuccess = () => resolve();
      del.onerror = () => reject(del.error);
    });
  } finally {
    db.close();
  }
}
