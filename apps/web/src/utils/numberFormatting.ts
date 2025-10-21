export interface NumberFormatOptions {
  locale?: "en-IN" | "en-US" | "en-GB";
  useIndianFormat?: boolean;
  maxDecimalPlaces?: number;
  minDecimalPlaces?: number;
  showCurrency?: boolean;
  currency?: "INR" | "USD" | "EUR";
}

const DEFAULT_LOCALE = "en-IN";

export const formatNumber = (
  value: string | number,
  options: NumberFormatOptions = {}
): string => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const {
    locale = DEFAULT_LOCALE,
    useIndianFormat = true,
    maxDecimalPlaces = 2,
    minDecimalPlaces = 0,
    showCurrency = false,
    currency = "INR",
  } = options;

  const numericValue =
    typeof value === "string" ? Number(value.replace(/,/g, "")) : Number(value);

  if (Number.isNaN(numericValue)) {
    return "";
  }

  const formatterOptions: Intl.NumberFormatOptions = {
    maximumFractionDigits: maxDecimalPlaces,
    minimumFractionDigits: minDecimalPlaces,
  };

  if (showCurrency) {
    formatterOptions.style = "currency";
    formatterOptions.currency = currency;
  }

  let formatted = new Intl.NumberFormat(locale, formatterOptions).format(
    numericValue
  );

  if (useIndianFormat && locale === "en-IN" && !showCurrency) {
    formatted = formatted.replace(/₹\s?/, "");
  }

  return formatted;
};

export const parseFormattedNumber = (formattedValue?: string | null): string => {
  if (!formattedValue) {
    return "";
  }

  return formattedValue
    .toString()
    .replace(/[^\d.-]/g, "")
    .replace(/(\..*)\./g, "$1");
};

export const formatNumberForInput = (
  value: string | number,
  options: NumberFormatOptions = {}
): string => {
  return formatNumber(value, {
    ...options,
    showCurrency: false,
    maxDecimalPlaces:
      options.maxDecimalPlaces !== undefined ? options.maxDecimalPlaces : 2,
    minDecimalPlaces:
      options.minDecimalPlaces !== undefined ? options.minDecimalPlaces : 0,
  });
};

export const formatCurrency = (
  value: string | number,
  options: NumberFormatOptions = {}
): string => {
  return formatNumber(value, {
    ...options,
    showCurrency: true,
    currency: options.currency || "INR",
    maxDecimalPlaces:
      options.maxDecimalPlaces !== undefined ? options.maxDecimalPlaces : 2,
    minDecimalPlaces:
      options.minDecimalPlaces !== undefined ? options.minDecimalPlaces : 0,
  });
};

export const isValidNumber = (value: string): boolean => {
  if (value === "") {
    return true;
  }
  const parsed = Number(parseFormattedNumber(value));
  return !Number.isNaN(parsed) && Number.isFinite(parsed);
};

export const getNumericValue = (formattedValue: string): number | null => {
  const cleanValue = parseFormattedNumber(formattedValue);
  if (cleanValue === "") {
    return null;
  }
  const numeric = Number(cleanValue);
  return Number.isNaN(numeric) ? null : numeric;
};

export const FORMATTERS = {
  CURRENCY: { showCurrency: true, currency: "INR" as const },
  CURRENCY_NO_SYMBOL: { useIndianFormat: true, locale: "en-IN" as const },
  PERCENTAGE: { maxDecimalPlaces: 2, minDecimalPlaces: 0 },
  INTEGER: { maxDecimalPlaces: 0, minDecimalPlaces: 0 },
  DECIMAL: { maxDecimalPlaces: 2, minDecimalPlaces: 0 },
  PRICE: {
    useIndianFormat: true,
    locale: "en-IN" as const,
    maxDecimalPlaces: 2,
  },
} as const;
