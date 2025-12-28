# Number Formatting Fix - Complete Implementation

## Problem

The number formatting feature was implemented but wasn't working for fields like `loanAmount` and `emi` in the RBL schema. No commas were appearing in the input fields.

## Root Cause

The `SchemaSection.tsx` component was not passing the `formatter` property from the schema to the `InputFormItem` component. The formatter was defined in the schema, but the rendering logic wasn't forwarding it.

## Solution

### 1. Updated TypeScript Interface

Added `formatter` property to `JsonSchemaProperty` interface in `SchemaSection.tsx`:

```typescript
interface JsonSchemaProperty {
  // ... existing properties
  formatter?: {
    useIndianFormat?: boolean;
    locale?: string;
    maxDecimalPlaces?: number;
    minDecimalPlaces?: number;
    showCurrency?: boolean;
    currency?: string;
  };
}
```

### 2. Fixed Number Field Rendering

Updated three locations in `SchemaSection.tsx` where number fields are rendered:

#### a. Top-level number fields

```typescript
case 'number':
  return (
    <InputFormItem
      data={{
        // ... existing props
        formatter: (property as any).formatter, // ✅ Added this line
      }}
    />
  );
```

#### b. Top-level integer fields

```typescript
case 'integer':
  return (
    <InputFormItem
      data={{
        // ... existing props
        formatter: (property as any).formatter, // ✅ Added this line
      }}
    />
  );
```

#### c. Number fields in nested objects

```typescript
if (subProperty.type === 'number' || subProperty.type === 'integer') {
  return (
    <InputFormItem
      key={subFieldKey}
      data={{
        // ... existing props
        type: subProperty.type,           // ✅ Added
        formatter: (subProperty as any).formatter, // ✅ Added
        trigger,                          // ✅ Added
      }}
    />
  );
}
```

#### d. Number fields in array items

```typescript
return (
  <InputFormItem
    key={subFieldKey}
    data={{
      // ... existing props
      type: subProperty.type,           // ✅ Added
      formatter: (subProperty as any).formatter, // ✅ Added
      trigger,                          // ✅ Added
    }}
  />
);
```

### 3. Added Debug Logging

Added console logging in `InputFormItem.jsx` to verify formatting is working:

```javascript
if (data?.formatter) {
  const formatted = formatNumberForInput(value, data.formatter);
  console.log(
    `[InputFormItem] Formatting field "${data.key}": value="${value}" → formatted="${formatted}"`,
    data.formatter
  );
  return formatted;
}
```

## Testing Steps

1. **Rebuild the mobile app**

   ```bash
   cd apps/mobile
   npm run android
   ```

2. **Navigate to the test form**

   - Open the app
   - Go to "QA Form Testing"
   - Navigate to "Loans Details" section

3. **Test the formatting**

   - Click "Add" to add a loan detail entry
   - Type in the "Loan amount" field: `150000`
   - Expected display: `1,50,000`
   - Type in the "EMI" field: `12500`
   - Expected display: `12,500`

4. **Check console logs**

   - Look for messages like:
     ```
     [InputFormItem] Formatting field "loansDetails[0].loanAmount": value="150000" → formatted="1,50,000"
     ```

5. **Verify submission**
   - Submit the form
   - Backend should receive clean numeric values: `150000` and `12500`

## Files Modified

1. **`apps/mobile/src/components/pd-forms/SchemaSection.tsx`**

   - Added `formatter` to `JsonSchemaProperty` interface
   - Passed `formatter` prop to `InputFormItem` in 4 locations
   - Added `type` and `trigger` props for consistency

2. **`apps/mobile/src/lib/InputFormItem.jsx`**

   - Already had formatting logic
   - Added debug logging

3. **`apps/backend/src/modules/loan/forms-schema/rbl.ts`**
   - Already had formatter definitions (from previous implementation)

## Schema Example

Here's how the fields are defined in the schema:

```typescript
loanAmount: {
  type: "number",
  title: "Loan amount",
  formatter: {
    useIndianFormat: true,
    locale: "en-IN",
    maxDecimalPlaces: 2,
    minDecimalPlaces: 0,
  },
},
emi: {
  type: "number",
  title: "EMI",
  formatter: {
    useIndianFormat: true,
    locale: "en-IN",
    maxDecimalPlaces: 2,
    minDecimalPlaces: 0,
  },
},
```

## Expected Behavior

### User Experience

1. **Input**: User types numbers normally
2. **Display**: Numbers show with Indian-style comma formatting
3. **Storage**: Form stores clean numeric values
4. **Submission**: Backend receives clean numeric values

### Example Flow

```
User types: 150000
         ↓
Display shows: 1,50,000
         ↓
Form stores: "150000"
         ↓
Backend receives: 150000
```

## Debugging

If formatting still doesn't work:

1. **Check console logs** - Should see formatting messages
2. **Verify schema** - Ensure `formatter` object is present
3. **Check imports** - Ensure `numberFormatting.ts` is properly imported
4. **Test other fields** - Try "Approx. Market value" in Net Worth section

## Notes

- Formatting is purely visual - doesn't affect form validation or submission
- Works with both `number` and `integer` field types
- Supports nested objects and array items
- Indian format uses lakhs/crores system (e.g., 1,50,000 not 150,000)
- Backward compatible - fields without formatters work as before

