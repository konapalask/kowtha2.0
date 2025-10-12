/**
 * Number formatting utilities for form fields
 * Supports Indian number system (lakhs, crores) and international formatting
 */

export interface NumberFormatOptions {
  locale?: 'en-IN' | 'en-US' | 'en-GB';
  useIndianFormat?: boolean;
  maxDecimalPlaces?: number;
  minDecimalPlaces?: number;
  showCurrency?: boolean;
  currency?: 'INR' | 'USD' | 'EUR';
}

/**
 * Format a number with commas for thousands separators
 * @param value - The number or string to format
 * @param options - Formatting options
 * @returns Formatted string
 */
export const formatNumber = (
  value: string | number,
  options: NumberFormatOptions = {},
): string => {
  if (!value && value !== 0) return '';

  const {
    locale = 'en-IN',
    useIndianFormat = true,
    maxDecimalPlaces = 2,
    minDecimalPlaces = 0,
    showCurrency = false,
    currency = 'INR',
  } = options;

  // Convert to number
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return '';

  // Create Intl.NumberFormat options
  const formatOptions: Intl.NumberFormatOptions = {
    maximumFractionDigits: maxDecimalPlaces,
    minimumFractionDigits: minDecimalPlaces,
  };

  if (showCurrency) {
    formatOptions.style = 'currency';
    formatOptions.currency = currency;
  }

  let formatted = new Intl.NumberFormat(locale, formatOptions).format(numValue);

  // For Indian format, ensure lakhs/crores are displayed properly
  if (useIndianFormat && locale === 'en-IN' && !showCurrency) {
    // Remove currency symbols if any and ensure proper Indian formatting
    formatted = formatted.replace(/₹\s?/, '');
  }

  return formatted;
};

/**
 * Parse a formatted number string back to a clean number string
 * Removes commas, currency symbols, and other formatting
 * @param formattedValue - The formatted string
 * @returns Clean number string
 */
export const parseFormattedNumber = (formattedValue: string): string => {
  if (!formattedValue) return '';

  // Remove all non-numeric characters except decimal point and minus sign
  return formattedValue.replace(/[^\d.-]/g, '').replace(/(\..*)\./g, '$1'); // Remove multiple decimal points
};

/**
 * Format number for display in input fields (with commas)
 * @param value - The value to format
 * @param options - Formatting options
 * @returns Formatted string for display
 */
export const formatNumberForInput = (
  value: string | number,
  options: NumberFormatOptions = {},
): string => {
  return formatNumber(value, {
    ...options,
    showCurrency: false,
    maxDecimalPlaces: 2,
    minDecimalPlaces: 0,
  });
};

/**
 * Format currency for display (with ₹ symbol and commas)
 * @param value - The value to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: string | number,
  options: NumberFormatOptions = {},
): string => {
  return formatNumber(value, {
    ...options,
    showCurrency: true,
    currency: 'INR',
    maxDecimalPlaces: 2,
    minDecimalPlaces: 0,
  });
};

/**
 * Validate if a string is a valid number
 * @param value - The string to validate
 * @returns True if valid number
 */
export const isValidNumber = (value: string): boolean => {
  if (!value) return true; // Empty values are considered valid
  const parsed = parseFloat(parseFormattedNumber(value));
  return !isNaN(parsed) && isFinite(parsed);
};

/**
 * Get the raw numeric value from a formatted string
 * @param formattedValue - The formatted string
 * @returns The numeric value or null if invalid
 */
export const getNumericValue = (formattedValue: string): number | null => {
  const cleanValue = parseFormattedNumber(formattedValue);
  const numeric = parseFloat(cleanValue);
  return isNaN(numeric) ? null : numeric;
};

// Common formatter configurations
export const FORMATTERS = {
  CURRENCY: {showCurrency: true, currency: 'INR' as const},
  CURRENCY_NO_SYMBOL: {useIndianFormat: true, locale: 'en-IN' as const},
  PERCENTAGE: {maxDecimalPlaces: 2, minDecimalPlaces: 0},
  INTEGER: {maxDecimalPlaces: 0, minDecimalPlaces: 0},
  DECIMAL: {maxDecimalPlaces: 2, minDecimalPlaces: 0},
  PRICE: {useIndianFormat: true, locale: 'en-IN' as const, maxDecimalPlaces: 2},
} as const;

