# Number Formatting in Forms - Implementation Guide

## Overview

This implementation provides a comprehensive number formatting system for form fields in the mobile app. It supports Indian number system (lakhs, crores) with comma separators and follows React Hook Forms best practices.

## How It Works

### 1. Schema Definition

Add a `formatter` property to any number field in your schema:

```typescript
// In rbl.ts or any schema file
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
```

### 2. Formatter Options

The `formatter` object supports these options:

```typescript
interface NumberFormatOptions {
  locale?: 'en-IN' | 'en-US' | 'en-GB'; // Locale for formatting
  useIndianFormat?: boolean; // Use Indian number system
  maxDecimalPlaces?: number; // Max decimal places (default: 2)
  minDecimalPlaces?: number; // Min decimal places (default: 0)
  showCurrency?: boolean; // Show currency symbol
  currency?: 'INR' | 'USD' | 'EUR'; // Currency type
}
```

### 3. Predefined Formatters

Use common formatter configurations:

```typescript
import { FORMATTERS } from '../utils/numberFormatting';

// In schema:
approxMarketValue: {
  type: "number",
  title: "Approx. Market value",
  formatter: FORMATTERS.CURRENCY_NO_SYMBOL,  // Indian format without ₹
},
```

Available predefined formatters:

- `FORMATTERS.CURRENCY` - With ₹ symbol
- `FORMATTERS.CURRENCY_NO_SYMBOL` - Indian format without symbol
- `FORMATTERS.PRICE` - Standard price formatting
- `FORMATTERS.INTEGER` - No decimal places
- `FORMATTERS.DECIMAL` - 2 decimal places

## User Experience

### What Users See

1. **Input Field**: Shows formatted numbers with commas (e.g., "1,50,000")
2. **Typing**: Users can type normally - formatting happens automatically
3. **Validation**: Only accepts valid numeric input
4. **Keyboard**: Automatically shows numeric keyboard for formatted fields

### Example Flow

1. User types: `150000`
2. Field displays: `1,50,000`
3. Form stores: `150000` (clean numeric value)
4. On submit: Backend receives clean number

## Implementation Details

### InputFormItem Changes

The `InputFormItem` component now:

1. **Detects formatter**: Checks for `data.formatter` property
2. **Formats display**: Uses `formatNumberForInput()` for display
3. **Parses input**: Uses `parseFormattedNumber()` to clean user input
4. **Validates**: Ensures only valid numbers are stored
5. **Sets keyboard**: Automatically uses numeric keyboard for formatted fields

### Data Flow

```
User Input → parseFormattedNumber() → Clean Value → formatNumberForInput() → Display
     ↓
Form State (clean numeric value)
     ↓
Submission (numeric value to backend)
```

## React Hook Forms Integration

This implementation follows React Hook Forms best practices:

1. **Clean Values**: Form state stores clean numeric values (not formatted strings)
2. **Display Formatting**: Formatting only affects display, not form state
3. **Validation**: Works with existing validation rules
4. **Type Safety**: Maintains proper TypeScript types

## Examples

### Basic Currency Field

```typescript
loanAmount: {
  type: "number",
  title: "Loan Amount",
  formatter: {
    useIndianFormat: true,
    locale: "en-IN",
    maxDecimalPlaces: 2,
  },
},
```

### With Currency Symbol

```typescript
loanAmount: {
  type: "number",
  title: "Loan Amount",
  formatter: {
    showCurrency: true,
    currency: "INR",
    maxDecimalPlaces: 2,
  },
},
```

### Integer Only

```typescript
noOfEmployees: {
  type: "integer",
  title: "No. of Employees",
  formatter: FORMATTERS.INTEGER,
},
```

## Testing

To test the formatting:

1. Go to QAFormTesting screen
2. Navigate to "Loans Details" section
3. Try entering values in "Loan amount" or "EMI" fields
4. You should see commas appear as you type
5. Check that the form submits with clean numeric values

## Benefits

1. **Better UX**: Large numbers are easier to read with commas
2. **Indian Format**: Supports lakhs/crores system
3. **Type Safety**: Maintains proper number types
4. **Validation**: Works with existing validation
5. **Flexible**: Easy to add to any number field
6. **Standard**: Follows React Hook Forms patterns

## Migration

To add formatting to existing fields:

1. Add `formatter` property to schema field
2. Optionally change `type` from `"string"` to `"number"` if needed
3. Rebuild the app
4. Test the field behavior

No changes needed to form submission logic - it automatically handles the clean numeric values.

