# Axis Finance UBL (Above 10L) – PDF generation notes

This pilot makes PDF generation deterministic and schema-ready for Axis Finance UBL using the generated PD schema.

## What changed
- Added a lightweight schema loader to read `packages/shared/pd_forms.generated.json` at runtime.
  - File: `PD/schema/pd-schema.ts`
- Added a mapper that converts either legacy PD payloads or schema-shaped payloads into `AxisFinanceUBLInterface` expected by the existing template.
  - File: `PD/mappers/axis-finance-ubl.mapper.ts`
- Updated `PDTemplateService.InterfaceMapping` to always pass mapped data to the existing `axis-finance-ubl.template.ts` (CSS/layout unchanged).
  - File: `pd-templates.service.ts`

## Why
- Keep the current Axis Finance UBL PDF stable (customer-approved CSS/template), while preparing the backend to consume schema-driven data.
- Avoid breaking existing data: if the stored `verificationData` is the old (legacy) shape, the mapper passes it through; if we migrate mobile/web to the new schema, the mapper adapts it.

## How it works
- Service loads images/signature and constructs `html_data` (unchanged).
- `mapAxisUBL(data)` decides:
  - If payload already looks like `AxisFinanceUBLInterface`, return as-is (legacy path).
  - Else, interpret the payload as schema-shaped and map it by field ids to the interface.
- Template `axis-finance-ubl.template.ts` renders with the same deterministic layout/CSS.

## Variant
- Currently hard-wired to `axis_finance_ubl_above_10l` (pilot). Add a resolver if multiple Axis variants are introduced.

## Test locally
1) Ensure the web UI saves PD data for a PD loan with bank `Axis Finance` (or existing bankName).
2) Call preview endpoint:
   - `GET /loans/:id/preview-final-report?type=Business&department=PD`
3) The service calls `PDTemplateService.previewPDVerificationPDF` → `InterfaceMapping` → `axisFinanceUBLTemplate` → Puppeteer → PDF buffer.

## Next steps (optional)
- Migrate mobile/web Axis UBL to use the generated schema (snake_case ids).
- Add field options into the generator for select fields.
- If needed, introduce an explicit variant resolver (by loan amount, product code).

## Notes
- KISS: no heavy libs added; small utilities only.
- Deterministic PDF preserved; bank-specific template remains separate as required.
