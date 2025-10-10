import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';

/**
 * Custom render function with providers if needed
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  // Add any providers your app uses (Context, Navigation, etc.)
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Utility to wait for async operations
 */
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock form submission handler
 */
export const createMockSubmitHandler = () => {
  const submitHandler = jest.fn();
  submitHandler.mockResolvedValue({ success: true });
  return submitHandler;
};

/**
 * Helper to simulate form field changes
 */
export function simulateFieldChange(
  form: any,
  fieldName: string,
  value: any
) {
  // This would simulate React Hook Form setValue
  if (form && form.setValue) {
    form.setValue(fieldName, value);
  }
}

/**
 * Assertion helpers for form validation
 */
export const assertFormValid = (validationResult: any) => {
  expect(validationResult.isValid).toBe(true);
  expect(validationResult.errors).toHaveLength(0);
};

export const assertFormInvalid = (
  validationResult: any,
  expectedErrors: string[]
) => {
  expect(validationResult.isValid).toBe(false);
  expect(validationResult.errors.length).toBeGreaterThan(0);
  expectedErrors.forEach((error) => {
    expect(validationResult.errors).toContain(error);
  });
};

/**
 * Helper to create test data for specific field types
 */
export const createTestData = {
  string: (value?: string) => value || 'Test Value',
  number: (value?: number) => value || 12345,
  boolean: (value?: boolean) => (value !== undefined ? value : true),
  date: (value?: string) => value || '2024-01-01',
  enum: (options: string[], index = 0) => options[index],
  array: (items: any[], count = 2) => items.slice(0, count),
  object: (fields: Record<string, any>) => fields,
};

/**
 * Mock navigation for React Navigation tests
 */
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(),
  getState: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
});

/**
 * Mock route for React Navigation tests
 */
export const createMockRoute = (params = {}) => ({
  key: 'test-route',
  name: 'TestScreen',
  params,
});

// Re-export testing library utilities
export * from '@testing-library/react-native';

