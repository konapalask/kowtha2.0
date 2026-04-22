# Postpone Follow-Up Buttons — Design

**Date:** 2026-04-21
**Owner:** jayakrishna
**Status:** Approved for implementation
**Scope:** PD only

## Problem

Today, when a field executive postpones a PD verification, the backend automatically:
1. Sends an SMS to the applicant ("has been postponed and will be rescheduled")
2. Replies to the originating PD email thread so the bank sees the postponement

Both actions fire on every postpone, including cases where a follow-up isn't the right next step (e.g., the FE wants to quietly reschedule). The team wants Ops Executives and Admins to drive those notifications manually, from the loan detail drawer, after they've reviewed the postponement.

## Goal

Replace the auto-send behavior with two manual buttons on the loan detail drawer. Each button triggers one channel independently. Either role (Admin or OperationsExecutive) can use them. Either button can be clicked repeatedly — every click sends again.

## Non-goals

- No FI support. PD-only.
- No history table or "last sent at" tracking. No schema changes.
- No confirmation modal before send.
- No change to the postpone action itself (still writes `isPostponed`, `postponedDate`, `postponedReason`) other than removing the two auto-send calls.
- No change to the existing `sendPdEmailReply` manual-reply endpoint or any other email flow.

## Scope

**Backend** (`apps/backend`):
- `src/modules/loan/loan.service.ts` — `createVerificationRetry` (lines ~2975-3063) loses its auto-send blocks.
- `src/modules/loan/loan.controller.ts` — two new POST routes.
- The existing helpers `sendPostponementEmailReply` and `SMSUtils.sendVerificationStatus` are reused verbatim.

**Frontend** (`apps/web`):
- `src/components/loans/LoanEditDrawer.tsx` — conditional buttons in the drawer footer.

**Mobile:** no changes. The mobile app doesn't trigger postponement emails; it doesn't need these buttons.

## Design

### Backend — remove auto-sends

In `createVerificationRetry`, delete:

1. The SMS block at lines 3001-3017 (the `try / catch` that constructs `SMSUtils` and calls `sendVerificationStatus`).
2. The `sendPostponementEmailReply(...)` call at lines 3019-3035 (the `.catch(...)` wrapper included).

Nothing else in the method changes. Postpone continues to update `isPostponed`, `postponedDate`, `postponedReason` on the verification and return the retry record.

### Backend — new endpoints

Both routes live on the existing `LoanController` (`loan.controller.ts`), both guarded by `@Roles(UserRole.Admin, UserRole.OperationsExecutive)`.

#### `POST /loans/:id/follow-up/bank`

1. Load the loan with `verifications` where `isPostponed = true AND status = 'Pending'`.
2. If none: return `400 { success: false, message: "Loan is not in a postponed state" }`.
3. Pick the postponed verification (PD always has one). Read its `postponedDate` and `postponedReason`.
4. Call existing `sendPostponementEmailReply(loanId, postponedDate, reason)`.
5. Return `{ success, message }` from the helper.

The helper already returns `{ success: false, message: "No PD email log found for this loan; skipping reply" }` when the loan has no `pdEmailLogs`. Surface that to the client as an error toast.

#### `POST /loans/:id/follow-up/applicant`

1. Load the loan with its postponed pending verification (same guard as above).
2. If the loan has no `applicantMobile`: return `{ success: false, message: "No mobile number on file for applicant" }`.
3. Instantiate `new SMSUtils(this.loggingService)` and call `sendVerificationStatus(loan.applicantMobile, "postponed and will be rescheduled", loan.applicationNumber || String(loan.id))`.
4. Return `{ success: true, message: "Follow-up SMS sent to applicant" }` on success; `{ success: false, message: <reason> }` on SMS failure.

Neither endpoint needs a request body.

### Frontend — drawer footer buttons

In `LoanEditDrawer.tsx`:

1. Compute `isLoanPostponed = loanDetails?.verifications?.some(v => v.isPostponed && v.status === 'Pending')`.
2. Read current user role. Compute `canFollowUp = isLoanPostponed && (role === 'Admin' || role === 'OperationsExecutive')`.
3. When `canFollowUp`, render two AntD `<Button>`s in the drawer footer (lines 331-337) before the existing Close button:

```tsx
footer={
  <div className="flex-end">
    {canFollowUp && (
      <>
        <Button onClick={handleNotifyBank} loading={bankLoading}>
          Notify Bank
        </Button>
        <Button onClick={handleNotifyApplicant} loading={applicantLoading}>
          Notify Applicant
        </Button>
      </>
    )}
    <Button onClick={handleSaveAndClose} type="primary">
      Close
    </Button>
  </div>
}
```

4. `handleNotifyBank` / `handleNotifyApplicant` POST to their respective endpoints, track a local `loading` boolean each, and dispatch `message.success(res.message)` or `message.error(res.message)` based on `response.data.success`. Errors from the network layer surface as `message.error("Failed to send follow-up")`.

Button text: "Notify Bank" and "Notify Applicant". No confirmation modal.

### Behavior matrix

| Click | Precondition | Toast |
|---|---|---|
| Notify Bank | Postponed + `pdEmailLogs` present | "Postponement email reply sent successfully" (success) |
| Notify Bank | Postponed + no `pdEmailLogs` | "No PD email log found for this loan; skipping reply" (error) |
| Notify Bank | Not postponed | Buttons not rendered (no click possible) |
| Notify Applicant | Postponed + mobile present | "Follow-up SMS sent to applicant" (success) |
| Notify Applicant | Postponed + no mobile | "No mobile number on file for applicant" (error) |
| Either | Role ≠ Admin or OpsExec | 403 from backend (buttons also not rendered) |

### Role enforcement

- **UI:** `canFollowUp` hides the buttons for other roles.
- **Server:** `@Roles(UserRole.Admin, UserRole.OperationsExecutive)` on each endpoint — the canonical gate. UI hide is a courtesy, not security.

## API contract

Response shape (both endpoints):

```ts
{
  status: 200 | 400,
  success: boolean,
  message: string
}
```

No change to existing endpoints or response shapes elsewhere.

## Testing

### Backend unit

One spec per endpoint on `LoanService` (or `LoanController` if cleaner):

- **Notify Bank**
  - Happy path: returns `{ success: true }` and invokes `sendPostponementEmailReply` once.
  - No postponed verification on loan: returns 400.
  - No `pdEmailLogs`: returns `{ success: false, message: "No PD email log..." }` (the helper's behavior, asserted via mock).

- **Notify Applicant**
  - Happy path: returns `{ success: true }` and invokes `SMSUtils.sendVerificationStatus` with the correct args.
  - No postponed verification: returns 400.
  - Loan without `applicantMobile`: returns `{ success: false, message: "No mobile number..." }`.

### Manual

1. Postpone an existing PD dummy loan (`DUMMY-PD-20260420-007`).
2. Open the drawer as an Admin user — verify both buttons appear in the footer.
3. Click each — verify toast appears and corresponding integration fires (check `PDEmailLog` response, Fast2SMS request).
4. Sign in as a Verifier or FieldExecutive — verify buttons don't render.
5. Open a non-postponed loan — verify buttons don't render for any role.

## Rollout

Single PR. No feature flag. No migration. No schema change. Reversible via `git revert`.

## Risks

- **Double-sends.** Every click sends again. An Ops member could accidentally spam the bank. We accept this given the low rate of postponements and the conscious-click model (no auto-retry). If spam becomes a problem, the future fix is option B from brainstorming (throttle / last-sent-at tracking).
- **Auto-send removal breaks existing expectation.** Any ops team member used to the automatic behavior now has to explicitly click. This is the intended change but worth communicating in the release note.
- **`sendPostponementEmailReply` failures** are swallowed by the helper today. The endpoint surfaces the helper's own `{ success: false, message }` rather than throwing, matching the existing contract. Client shows error toast in that case.
