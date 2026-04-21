# PD Verifier Draft Reconcile — Design

**Date:** 2026-04-21
**Owner:** jayakrishna
**Status:** Approved for implementation
**Scope:** PD department only. FI left untouched.

## Problem

A PD Verifier on device A opens a loan, edits some fields, and autosaves them to IndexedDB (`editLogs` store, key `${loanId}_${activeTab}`). Later, from a different device, the Verifier returns the loan to the Verification Executive (VE). The VE edits and submits new data via `POST /loans/:id/submit-verification-executive`, which overwrites the server's `Verification.verificationData`.

When the Verifier returns to device A, the API returns the fresh server data — but the verification-details component loads the device-local IndexedDB draft on top, so the Verifier sees their own stale edits instead of the VE's submission. The issue looks to the user like "the Verifier still sees old data after VE re-submitted."

Server-side deletion can't reach into another device's IndexedDB; cross-device invalidation has to be driven by the server state the client already fetches.

## Goal

A PD Verifier returning to a device that holds stale drafts sees the fresh server data automatically, with no manual cache-clear. Fresh drafts the Verifier creates *after* seeing the latest server state are preserved as before.

## Non-goals

- No change to FI behavior. FI flows through the same components continue to use the existing inline IndexedDB read/write logic unchanged.
- No change to `Verification` schema. No new columns.
- No change to `submitVerificationExecutive`, `returnToVerificationExecutive`, or any other backend service. Pure frontend fix.
- No toast or prompt. The reconcile is silent (option A from the brainstorming session).
- No deletion on the VE's device. The VE's device already has its own per-tab IndexedDB behavior that this design doesn't modify.

## Non-bugs (confirmed during investigation)

- The `submitVerificationExecutive` backend path is correct — it persists `verificationData`, `financialAnalysis`, `synopsis`, sets `initialSubmitted=true`, and bumps `updatedAt`.
- `getVerificationData` returns the latest row; no stale filter on the read side.
- `editVerificationData` has a separate quirk (early-return when `financialAnalysis.netProfit > 1,000,000`, routing to an EditRequest instead of persisting the Verification update). That's not on the VE submit path — the VE web flow uses `submit-verification-executive`, the mobile FE uses `submit-verification-report`. Out of scope here.

## Design

### Principle

When the Verifier's device saves a draft to IndexedDB, it also records the server's `Verification.updatedAt` at the moment the draft was based on (`baseUpdatedAt`). When the Verifier's device loads that draft on a later fetch, it compares `server.updatedAt` to `draft.baseUpdatedAt`. If the server has moved on, the draft is silently dropped and the server data is shown.

Since the submit action on any device bumps `Verification.updatedAt`, this comparison alone is enough to detect that a submission happened. No new schema signal is needed — the submit button *is* the signal, and `updatedAt` already carries it.

### Helper — `apps/web/src/utils/draftStore.ts` (new)

Single file that owns the IndexedDB read / write contract for the `editLogs` store. Two exported functions:

```ts
export async function saveDraft(
  loanId: number | string,
  tab: string,
  data: Record<string, unknown>,
  serverUpdatedAt: string | null,
): Promise<void>;

export async function loadDraft(
  loanId: number | string,
  tab: string,
  serverUpdatedAt: string | null,
): Promise<Record<string, unknown> | null>;
```

Storage shape in IndexedDB (extends the existing shape):

```ts
{
  id: `${loanId}_${tab}`,
  timestamp: <epoch ms of last save>,   // existing
  baseUpdatedAt: <server updatedAt ISO>, // new
  ...rest                                 // existing — arbitrary per-field draft values
}
```

`loadDraft` behavior:

1. Open the store. If no record for `${loanId}_${tab}` → return `null`.
2. If `serverUpdatedAt` is null or the record has no `baseUpdatedAt` → treat as stale, `store.delete(...)`, return `null`.
3. If `new Date(serverUpdatedAt) > new Date(record.baseUpdatedAt)` → `store.delete(...)`, return `null`.
4. Else → return `record` with `id`, `timestamp`, `baseUpdatedAt` stripped (matches current consumer shape).

`saveDraft` behavior:

- Opens the store and upserts the record with the new `baseUpdatedAt` value from the caller. Other fields preserved.

Internally, both open the existing `editLogs` database (version 1), transact on the `logs` object store, and close the connection when done. Matches the current pattern so we don't fork the DB.

### Wiring — `BusinessVerificationDetails.tsx` only

This is the only verification-details component a PD Verifier ever opens. Inside its IndexedDB read effect (currently `lines ~449-506`) and any write site, branch on current department:

```ts
if (currentDepartment === "PD") {
  // Use draftStore.loadDraft / saveDraft with serverUpdatedAt
} else {
  // Existing FI-path IndexedDB inline code, unchanged
}
```

`serverUpdatedAt` is `verificationData.verifications[0]?.updatedAt` (for a PD loan there is exactly one Business verification). The component already has access via props.

Existing behavior preserved:
- `hasEditRequest === true` still triggers the immediate delete branch (no reconcile needed — it's already an explicit invalidation).
- FI code path unchanged.
- The write side in the PD branch stamps `baseUpdatedAt` using the same `serverUpdatedAt` value.

### Files not touched

- `VerificationDetails.tsx`, `WorkVerificationDetails.tsx` — FI-only tabs (PermanentAddress, CurrentAddress, Work). Not opened by PD Verifiers.
- `EditFormModal.tsx`, `EditRequestLogs.tsx`, `PDRequestLogs.tsx` — shared components. They interact with the same IndexedDB store, but they're either read-mostly (displaying edit history) or hooked to `hasEditRequest` deletion (which already works correctly). We do not refactor them here.

If implementation finds a PD-facing draft path that routes through one of these files, the fix applies the same department-guarded helper at that site. The scope does not expand to FI branches.

### API contract

No backend changes. No endpoint additions.

## Testing

### Unit (draftStore)

Small Jest-style spec:

- `loadDraft` returns `null` when no record exists.
- `loadDraft` returns `null` and deletes when record lacks `baseUpdatedAt`.
- `loadDraft` returns `null` and deletes when `serverUpdatedAt > record.baseUpdatedAt`.
- `loadDraft` returns the record (minus metadata) when `serverUpdatedAt <= record.baseUpdatedAt`.
- `saveDraft` writes the record with `baseUpdatedAt` and `timestamp`.

### Manual (end-to-end)

1. Open a PD loan in browser A as a Verifier. Edit a Business-tab field — confirm IndexedDB record contains `baseUpdatedAt`.
2. In browser B (incognito or different profile), sign in as the same Verifier or Admin, hit `POST /loans/:id/return-to-ve`.
3. In a third session as VE, hit `POST /loans/:id/submit-verification-executive` with a new payload.
4. Return to browser A, reload the loan page.
5. Expect: VE's new values displayed, no prior local edits overlaid, no toast, no prompt.
6. In browser A, make a fresh edit — confirm IndexedDB record now has a newer `baseUpdatedAt`. Reload the page (without any server change). Expect: the fresh edit is preserved.

### Regression

- FI loans: open any FI tab and confirm draft behavior is unchanged — edits preserved across refresh.
- PD Verifier with no stale drafts: confirm no regression in normal edit flow.
- `hasEditRequest` path still deletes drafts when an EditRequest arrives on the record.

## Rollout

Single PR. No flag. No migration. Reversible via `git revert`.

## Risks

- **Coarse invalidation.** `updatedAt` bumps on any write, not only on VE submit. If some other actor (future feature, reassignment on PD) touches the same `Verification` row without a corresponding server data change the Verifier needs, their PD draft will be dropped. Currently there's no such non-submit path on PD, so this is hypothetical. If it materializes, escalate to the more precise per-signal approach (option B from brainstorming) — add a dedicated `lastVeSubmittedAt` column. Not today.
- **IndexedDB not available** (private browsing in some browsers). The existing code already falls through silently in that case; the helper will do the same.
