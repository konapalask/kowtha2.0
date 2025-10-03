## Axis Finance UBL (Above 10L) – Pilot Refactor Context

Audience: Developers continuing the PD pilot across backend, web, and mobile.

### Goals
- Keep PDF deterministic (bank-approved layout/CSS) while enabling schema-driven data across layers.
- Pilot on Axis Finance UBL Above 10L only; do not impact other banks yet.
- KISS: minimal changes, no heavy deps, additive and backward-compatible.

### Shared Source of Truth
- Generated schema: `packages/shared/pd_forms.generated.json` (large JSON from Excel)
- Form id for pilot: `axis_finance_ubl_above_10l`
- IDs: snake_case for sections/fields. We adapt to legacy camelCase where needed.

### Backend (apps/backend)
- Deterministic PDF engine: Puppeteer (`LoanService.PDFBufferGeneration`)
- PD preview route: `GET /loans/:id/preview-final-report?type=Business&department=PD`
- Template service: `apps/backend/src/modules/loan/templates/pd-templates.service.ts`
  - Builds `html_data` (signature image, imagesData, status, etc.)
  - Now calls a mapper before rendering Axis UBL template.
- Files added:
  - `apps/backend/src/modules/loan/templates/PD/schema/pd-schema.ts` – loads `pd_forms.generated.json` and resolves the Axis variant (currently default).
  - `apps/backend/src/modules/loan/templates/PD/mappers/axis-finance-ubl.mapper.ts` – maps either legacy or schema-shaped payloads to `AxisFinanceUBLInterface` required by `axis-finance-ubl.template.ts`.
  - `apps/backend/src/modules/loan/templates/PD/README_AXIS_UBL.md` – backend-focused notes.
- Files updated:
  - `apps/backend/src/modules/loan/templates/pd-templates.service.ts` – integrates mapper; template/CSS unchanged.

Behavior
- If `verification.verificationData` already matches legacy Axis interface, passthrough.
- If it is schema-shaped (snake_case sections/fields), map to the legacy interface, then render.
- Result: PDF layout remains identical, but backend is schema-ready.

### Web (apps/web)
- Verifier displays and edits PD data; PDF preview uses backend endpoint above.
- Files added:
  - `apps/web/src/utils/pdAxisSchemaAdapter.ts` – adapts Axis UBL schema-shaped payload to the legacy view shape.
- Files updated:
  - `apps/web/src/components/verify/BusinessVerificationDetails.tsx`
    - For Axis banks: if schema-shaped data detected, adapt via `pdAxisSchemaAdapter` before rendering.
    - Otherwise, fall back to existing `bankConfigs.ts` transformers.

Behavior
- Verifier can see Axis UBL data regardless of whether it’s saved legacy-style or schema-style.
- Edits still go through existing `EditFormModal` -> `verifierEditApi` flow.

### Mobile (apps/mobile)
- Field agent captures PD data.
- Files added:
  - `apps/mobile/src/components/pd-forms/schema/pdSchema.ts` – stub loader (returns empty for now) and variant resolver.
  - `apps/mobile/src/components/pd-forms/SchemaSection.tsx` – minimal generic section renderer.
- Files updated:
  - `apps/mobile/src/screens/PD.tsx` – when bank includes “Axis” and schema is available, render sections via `SchemaSection` from the schema; else fall back to existing component list from `bankFormConfigs.ts`.

Behavior
- Pilot path renders Axis UBL sections generically if schema load is wired; otherwise, existing screens remain unchanged.
- Draft persistence and submission unchanged.

### What’s NOT changed
- Customer-approved Axis UBL HTML/CSS template remains exactly the same.
- Other banks’ flows remain unchanged.

### Testing the Pilot
1) Backend running.
2) Web: open a PD loan with Axis Finance bank, review data; edit some fields; generate preview PDF via UI (or cURL the preview endpoint).
3) Mobile (optional for now): run Axis UBL flow; confirm sections render (if schema wired), save draft, submit.

### Next Work (when ready)
- Mobile: wire schema loader to actually fetch/bundle `pd_forms.generated.json` and support select options.
- Web: optional move to full schema-driven render/edit instead of per-bank transformers.
- Backend: if new Axis variants are added, implement a runtime resolver for form id.

### Design Choices
- Backward compatible mapping so existing data and UI keep working.
- KISS: small utilities; no framework-wide rewrites.

### Handy Paths
- Backend mapper: `apps/backend/src/modules/loan/templates/PD/mappers/axis-finance-ubl.mapper.ts`
- Backend schema loader: `apps/backend/src/modules/loan/templates/PD/schema/pd-schema.ts`
- Web adapter: `apps/web/src/utils/pdAxisSchemaAdapter.ts`
- Web Axis integration: `apps/web/src/components/verify/BusinessVerificationDetails.tsx`
- Mobile schema section: `apps/mobile/src/components/pd-forms/SchemaSection.tsx`
- Mobile PD wiring: `apps/mobile/src/screens/PD.tsx`


