# Postponed Verification Ordering — Design

**Date:** 2026-04-20
**Owner:** jayakrishna
**Status:** Approved for implementation

## Problem

On `GET /api/loans/field-executive/assigned?status=Pending&department=PD`, a verification postponed to a future date disappears from the list today. When its postpone date arrives, it resurfaces but lands near the top of the list because ordering is `createdAt asc` and the row is old. Field executives lose visibility of postponed work, and postponed work later out-prioritizes newly-assigned work on its due date.

## Goal

For a field executive's Pending queue:

1. Postponed verifications remain visible every day (no time-window exclusion), at the bottom of the list.
2. Within the postponed group, nearest `postponedDate` appears first.
3. Non-postponed verifications are ordered as today: `createdAt` ascending (oldest first).
4. No change to `InProgress` / `Completed` ordering, response shape, pagination, or schema.

## Non-goals

- No retention cap for far-future postponed items (confirmed with user — "we don't have to complicate things").
- No UX indicator changes on the mobile client (response already includes `isPostponed` and `postponedDate`; the client renders whatever it currently renders).
- No changes to the postpone action itself (`POST /verification/retry` flow at `loan.service.ts:3006-3010` is untouched).
- No change to list ordering for endpoints other than `getAssignedLoansWithVerifications`.

## Scope

Single service method: `apps/backend/src/modules/loan/loan.service.ts` → `getAssignedLoansWithVerifications` (lines ~1507–1652).

## Design

### Filter change

Lines 1527–1549 currently contain an OR-block that excludes postponed-to-future rows:

```ts
const where: Prisma.VerificationWhereInput = {
  fieldExecutiveId,
  department: filters.department,
  OR: [
    { postponedDate: { lte: today } },
    { OR: [{ isPostponed: null }, { isPostponed: false }] },
  ],
};
```

Replace with:

```ts
const where: Prisma.VerificationWhereInput = {
  fieldExecutiveId,
  department: filters.department,
};
```

The `today` / `tomorrow` date variables (lines 1520–1525) become dead after this change and should be removed.

Existing `status` and `applicationNumber` filters below remain as-is.

### Sort change

Lines 1571–1594 currently sort by `createdAt` only, with direction flipped by status:

```ts
const sortOrder =
  filters?.status === VerificationStatus.Pending ? "asc" : "desc";

orderBy: { createdAt: sortOrder },
```

Replace with a multi-key `orderBy` branch on status:

```ts
const orderBy: Prisma.VerificationOrderByWithRelationInput[] =
  filters?.status === VerificationStatus.Pending
    ? [
        { isPostponed:   { sort: 'asc', nulls: 'first' } },
        { postponedDate: { sort: 'asc', nulls: 'first' } },
        { createdAt:     'asc' },
      ]
    : [{ createdAt: 'desc' }];
```

Pass `orderBy` into the existing `findMany` call.

### Resulting behavior for `status=Pending`

1. Rows with `isPostponed` null or false appear first, ordered by `createdAt` ascending. This matches today's ordering for non-postponed rows exactly.
2. Rows with `isPostponed = true` appear after all non-postponed rows, ordered by `postponedDate` ascending (nearest first), with `createdAt` ascending as a tiebreaker.

### Pagination

Unchanged. Multi-key ordering is stable; `skip` / `take` arithmetic is unaffected. `total` count is unchanged (still `verification.count({ where })` over the new — broader — `where`).

### Edge cases

- **`isPostponed = true` with `postponedDate = null`** (data anomaly): lands at the top of the postponed group via `nulls: 'first'` on `postponedDate`. Acceptable. If this ever occurs, it's a data integrity issue for the postpone flow, not a display issue.
- **Reset verifications** (retry flow at `loan.service.ts:3253` sets `isPostponed=false, postponedDate=null`): they rejoin the top group with their original `createdAt` — natural.
- **`Completed` / `InProgress` queries:** no change — still `createdAt desc`.
- **`status` filter omitted by client:** falls into the `else` branch and uses `createdAt desc`. Same as today.

## API contract

Response shape unchanged. `items` array contents are identical per row; only their order changes. `meta.total`, `meta.page`, `meta.limit`, `meta.totalPages` unchanged in semantics. No client update required.

## Testing

### Unit test (Jest, backend)

One spec targeting `LoanService.getAssignedLoansWithVerifications`. Seed:

- 3 non-postponed pending verifications with distinct `createdAt` (oldest → newest: V1, V2, V3).
- 2 postponed pending verifications with `postponedDate` in the future, different dates (nearest → farthest: P1, P2).
- 1 postponed pending verification with `isPostponed=true, postponedDate=null` (P0 — data anomaly).

Assert returned order: `V1, V2, V3, P0, P1, P2`.

### Manual verification

Using the 10 dummy PD loans already seeded (application numbers `DUMMY-PD-20260420-001` through `010`, verifications assigned to FE 205):

1. Postpone `DUMMY-PD-20260420-003` to tomorrow.
2. Postpone `DUMMY-PD-20260420-007` to three days from now.
3. Hit `GET /api/loans/field-executive/assigned?page=1&status=Pending&department=PD` as FE 205.
4. Expect: the 8 un-postponed dummies first (in `createdAt` asc order), then `003` (postponed to tomorrow), then `007` (postponed to +3 days).

## Rollout

Single PR. No feature flag. No migration. No environment-specific behavior. Reversible by `git revert`.

## Risks

- **Expanded `where`** returns more rows than before for the same FE. `meta.total` will grow for any FE with postponed-to-future work. Mobile client must not assume `total` shrinks after a postpone action. Low risk — the client just paginates.
- **Prior filter intent** (`Exclude verifications that have retries not for today`, per the deleted comment) is being deliberately reversed per user instruction. The retry history on `VerificationRetries` is unaffected and still available for audit.
