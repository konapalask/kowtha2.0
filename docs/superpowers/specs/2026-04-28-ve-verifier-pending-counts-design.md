# VE & Verifier Pending Counts on /loans Assignment — Design

**Date:** 2026-04-28
**Owner:** jayakrishna
**Status:** Approved for implementation

## Problem

On the `/loans` page, when assigning a loan, the Field Executive (FE) dropdown shows each FE's pending workload as a `P: N` tag — useful for picking a less-loaded executive. The Verification Executive (VE) and Verifier dropdowns on the same page show only the user's name; reviewers have no visibility into who is overloaded when distributing PD work.

## Goal

Show a comparable `P: N` pending-count tag on the VE and Verifier dropdowns in the `/loans` assignment UI, with semantics that reflect the PD verification workflow.

## Definitions

The pending count per role is the number of verification records the user owns that are not yet completed by them:

| Role | Prisma relation on `User` | `where` predicate on `Verification` |
|---|---|---|
| FieldExecutive *(unchanged)* | `verifications` (relation `VerificationFieldExecutive`) | `status = 'Pending'` |
| VerificationExecutive | `assistantVerifications` (relation `AssistantVerifier`) | `status != 'Completed' AND department = 'PD' AND initialSubmitted = false` |
| Verifier | `verificationsVerifier` (relation `VerificationVerifier`) | `status != 'Completed' AND department = 'PD' AND initialSubmitted = true` |

The PD `initialSubmitted` partition mirrors the existing work-list logic at `apps/backend/src/modules/loan/loan.service.ts:976-987`: a PD verification is in the VE's queue while `initialSubmitted = false`, and shifts to the Verifier's queue once `initialSubmitted = true`. This avoids double-counting a single verification across both roles.

## Non-goals

- No change to the FE pending-count definition or the FE dropdown.
- No FI-department workload counts for VE/Verifier (per user clarification: VE/Verifier roles operate on PD only).
- No new endpoints, no new DTOs, no schema changes, no caching.
- No `availabletoday` Badge on the VE/Verifier dropdown rows — attendance is an FE-only concept.

## Scope

Two files touched:

1. `apps/backend/src/modules/accounts/accounts.service.ts` — `listUsers` method (the `/accounts/users` handler), lines ~489–563.
2. `apps/web/src/pages/loans/index.tsx` — the two existing fetch sites that build VE and Verifier dropdown options (lines ~195–207 and ~230–242).

`apps/web/src/components/loans/FieldAssignmentForm.tsx` is **not** modified — it already passes `verificationExecutives` and `verifiers` arrays through as `options` to its `<Select>` controls, so changing the option shape upstream is sufficient.

## Design

### Backend: role-aware `_count` in `listUsers`

Today the `findMany` always counts the FE relation:

```ts
_count: {
  select: {
    verifications: { where: { status: 'Pending' } }
  }
}
```

Replace with a role-driven `_count.select` block. The role is already known via `filters.role` (the existing query param). Build the select dynamically:

```ts
const pendingCountSelect =
  filters?.role === 'VerificationExecutive'
    ? {
        assistantVerifications: {
          where: {
            status: { not: VerificationStatus.Completed },
            department: Department.PD,
            initialSubmitted: false,
          },
        },
      }
    : filters?.role === 'Verifier'
    ? {
        verificationsVerifier: {
          where: {
            status: { not: VerificationStatus.Completed },
            department: Department.PD,
            initialSubmitted: true,
          },
        },
      }
    : {
        verifications: { where: { status: VerificationStatus.Pending } },
      };
```

Pass this into the existing `select._count.select` slot.

In the transform at line 556, read from the matching key per role and surface it under the same field name:

```ts
const pendingVerifications =
  filters?.role === 'VerificationExecutive'
    ? user._count.assistantVerifications
    : filters?.role === 'Verifier'
    ? user._count.verificationsVerifier
    : user._count.verifications;
```

The response keeps emitting `pendingVerifications: number` on each user — the API contract is unchanged.

### Frontend: enrich VE & Verifier dropdown options

Two fetch sites in `apps/web/src/pages/loans/index.tsx` currently build plain options:

```ts
// VE — line 230
getAllVerificationExecutivesApi().then(res => {
  const options = res?.data?.data?.map(item => ({ label: item.name, value: item.id }));
  setVerificationExecutives(options);
});

// Verifier — line 195
getVerifiersApi().then(res => {
  const options = res?.data?.data?.map(item => ({ label: item.name, value: item.id }));
  setVerifiers(options);
});
```

Replace each `label` with a Row that includes the name, the employee-code Tag, and the pending-count Tag — modeled on the FE label at lines 249–281, but **without** the `availabletoday` Badge column:

```tsx
label: (
  <Row gutter={[0, 5]} style={{ width: "100%" }}>
    <Col xs={24} sm={12} md={9} xl={11} style={{ wordWrap: "break-word" }}>
      <Typography.Text>{item?.name}</Typography.Text>
    </Col>
    <Col xs={24} sm={6} md={6} xl={9}>
      <Tag color="blue">{item?.employeeCode}</Tag>
    </Col>
    <Col xs={24} sm={6} md={9} xl={4}>
      <Tag color="blue">P: {item?.pendingVerifications}</Tag>
    </Col>
  </Row>
);
```

The columns absorb the width that the FE row gives to the Badge (`md={1} xl={1}`); other column widths are unchanged.

The `value` continues to be `item?.id` so form behavior in `FieldAssignmentForm` is unaffected.

### Why no change to FieldAssignmentForm

`FieldAssignmentForm` (lines 643, 684) renders the dropdowns with `options={verificationExecutives}` and `options={verifiers}` — whatever shape the parent passes is what AntD `Select` renders. Filter and selection behavior already keys off `option.label` and `option.value`, both of which remain valid.

## API contract

`GET /accounts/users?role=VerificationExecutive` and `GET /accounts/users?role=Verifier` already return user lists. After this change, each user object in the response will additionally include `pendingVerifications: number` — same field name, same shape as the FE response today. No new query params, no new endpoints.

Other consumers of `/accounts/users` for VE/Verifier roles (e.g., admin lists) will start receiving a non-null `pendingVerifications` field. They were already receiving the field as `0` for FE counts; surfacing the new role-specific count is additive and unused fields are ignored by existing readers.

## Testing

### Manual verification

Pre-seed (or pick existing) PD loans with VEs and Verifiers assigned. On `/loans`:

1. Open the assignment form for any PD loan.
2. Open the **Verification Executive** dropdown — every option should display a `P: N` tag.
3. Open the **Verifier** dropdown — every option should display a `P: N` tag.
4. Open the **Field Executive** dropdown — its tag and `availabletoday` Badge should be unchanged from today's behavior.

For a VE with id `X`, expected count equals:

```sql
SELECT COUNT(*) FROM "Verification"
WHERE "assistantVerifierId" = X
  AND status != 'Completed'
  AND department = 'PD'
  AND "initialSubmitted" = false;
```

Analogous query with `verifierId = X` AND `initialSubmitted = true` for Verifier.

### Spot checks

- A PD verification with both VE and Verifier set, `status=InProgress`, `initialSubmitted=false` → counts toward VE only, not Verifier.
- Toggle that record's `initialSubmitted` to `true` → flips to Verifier's count, drops from VE's.
- A PD verification with `status=Completed` → not counted for either role.
- An FI verification → not counted for either VE or Verifier, regardless of `assistantVerifierId` / `verifierId`.
- FE pending count for the same loan set is unchanged.

## Rollout

Single PR. No migration, no feature flag, no env-specific behavior. Reversible by `git revert`.

## Risks

- **Query cost.** The added `_count` predicates run against the `Verification` table, which is the existing FE pattern's hot table. Indexes on `assistantVerifierId`, `verifierId`, `status`, `department`, `initialSubmitted` would help; the existing FE count already implicitly relies on `fieldExecutiveId` + `status` index behavior. If query plans regress on a populated DB, follow-up work would add composite indexes — not blocking for this design.
- **Same `pendingVerifications` field name across three different semantic definitions.** Acceptable because each fetch is role-scoped; the role context disambiguates. Future readers should not assume the number is comparable across roles.
- **`assistantVerifications` and `verificationsVerifier` relation names** are derived from the existing Prisma schema (`schema.prisma` lines 30, 33). Verify spelling against `node_modules/.prisma/client` types during implementation.
