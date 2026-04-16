# Project Tasks

## Active Tasks (Doing Now)

### Knot 1 — Schema/Status Changes
- [x] New status for the cases after FV completed - BackendCompleted (when VerificationExecutive submits), Completed (approved/rejected)

### Knot 2 — Sorting & Visibility
- [x] Sort the cases in date order for all the roles
- [x] FE should see all the respective pending cases in chronological order
- [x] Reassigned case is not visible in FE login (bug fix)

### Knot 3 — Role-based UI/Permissions
- [x] Hide the assistant verifier and verifier fields for OperationsExecutive, OperationsExecutive (follow-up) should see them but they shouldn't be mandatory
- [ ] Pending cases should be available for VerificationExecutive and Verifier for OperationsExecutive (follow-up)
- [x] Reassign option for Verifier to be sent back to VerificationExecutive
- [x] 6am to 11am attendance freeze

### Knot 4 — Field Verifier / Mobile
- [x] For Field Verifier - Loan amount and Type of loan should be editable in app

### Knot 5 — Communication & External
- [x] Add a feature to send SMS to applicant when FE goes to his location for verifying
- [x] Auto follow up messages/mails to banks when applicant is not available for meeting, OperationsExecutive (follow-up) should update this
- [x] Closed date field should be tied to generating report (already implemented in Footer.tsx and pd-templates.service.ts)

## Omitted (Needs Clarification)

- [ ] AI should read the mails from appd and tspd mailboxes instead of opspd (AWS Lambda env var `USER_EMAIL` change — not a code change)
- [ ] Auto forwarding from Gmail to Outlook for Piramal (email provider config — not a code change)

## Recently Completed

- [x] PD/LIP tag and Branch fields available in create/edit loan page for Admin/OpsExec (Loan Tag enum PD/LIP, Branch max 30 chars — schema, DTOs, service, form all wired up)
- [x] Admin and OpsExec can export loans as CSV with date range, status, and bank name filters (GET /loans/export endpoint, Export button on /loans page)
- [x] BackendCompleted status hidden from FI department filters

## Not Doing Now

- [ ] Admin approval required for login post freeze time
- [ ] Team structure should be built only for follow-up
- [ ] Flagging previously applied cases from a different bank

## Notes

- **Initiator** = OperationsExecutive
- **FollowUp** = OperationsExecutive
- **OpsExec** = OperationsExecutive
- **AssistantVerifier** = VerificationExecutive
- All roles map to existing `UserRole` enums — no new roles needed
- **BackendCompleted** = VerificationExecutive submits a loan (status between FVCompleted and Approved/Rejected)
