

# Mobile App Testing Guide

## Overview

This document describes the comprehensive automated testing setup for the PD (Personal Discussion) forms in the mobile application. The testing framework validates all 27 bank schemas automatically, eliminating the need for manual testing.

## 🎯 Testing Strategy

### Test Pyramid

```
        /\
       /E2E\        ← Planned (Detox)
      /------\
     /  API   \     ← Integration Tests (20%)
    /----------\
   / Component \    ← Component Tests (30%)
  /--------------\
 /   Unit Tests   \ ← Unit Tests (50%)
/------------------\
```

## 📂 Test Structure

```
__tests__/
├── helpers/
│   ├── mockDataGenerator.ts      # Auto-generate form data from schemas
│   ├── schemaLoader.ts            # Load schemas for testing
│   ├── testUtils.tsx              # Common test utilities
│   └── testReporter.ts            # Test report generation
│
├── unit/
│   ├── mockDataGenerator.test.ts # Test data generation logic
│   └── schemaValidation.test.ts  # Test schema validation
│
├── components/
│   └── SchemaSection.test.tsx    # Test form component
│
├── integration/
│   ├── bankSpecific.test.ts      # Tests for 5 priority banks
│   ├── formSubmission.test.ts    # End-to-end form submission tests
│   └── allBanks.test.ts          # Automated tests for all 27 banks
│
└── setup.ts                       # Global test configuration
```

## 🚀 Running Tests

### Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Specific Test Suites

```bash
# Unit tests only
npm run test:unit

# Component tests only
npm run test:components

# Integration tests only
npm run test:integration

# All 27 banks comprehensive test
npm run test:all-banks
```

### CI/CD Mode

```bash
# Run tests as CI would (optimized for CI environment)
npm run test:ci
```

### Debug Mode

```bash
# Run tests with Node debugger
npm run test:debug
```

## 📊 Test Coverage

### Current Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Statements | 60% | - |
| Branches | 50% | - |
| Functions | 50% | - |
| Lines | 60% | - |

### View Coverage Report

```bash
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html
```

## 🏦 Bank Testing

### All 27 Banks Tested Automatically

The test suite validates the following for EACH bank:

1. ✅ Schema loads successfully
2. ✅ Schema has valid structure
3. ✅ Mock data generates correctly
4. ✅ Generated data passes validation
5. ✅ All required fields are populated
6. ✅ Data types are correct
7. ✅ Enum constraints are respected
8. ✅ Phone numbers are valid (if present)
9. ✅ Dates are valid (if present)
10. ✅ Array fields work correctly
11. ✅ Nested objects work correctly

### Supported Banks

1. RBL
2. Axis Finance UBL Above 10L
3. Axis Finance UBL Below 10L
4. Tata UBL
5. Arka Fincap
6. Hero Fincorp
7. ICICI
8. IDFC HL & ML
9. IIFL
10. Niwas Salaried
11. Niwas SENP
12. India Shelter Salaried
13. India Shelter Self Employed
14. Hero Housing Salaried
15. Hero Housing Self Employed
16. Axis Bank
17. Axis Agri
18. Ambit
19. Chola
20. DCB
21. IDFC PL
22. InCred
23. SMFG SME
24. SMFG HL
25. SMFG ML
26. Yes Bank
27. Sammaan

## 🔧 Key Features

### 1. Auto-Generated Mock Data

The test framework automatically generates realistic, valid mock data for any bank schema:

```typescript
import { generateMockDataFromSchema } from './__tests__/helpers/mockDataGenerator';

const schema = await loadSchema('RBL');
const mockData = generateMockDataFromSchema(schema);
// Returns valid data matching the schema structure
```

**Smart Field Generation:**
- Names: Realistic person names
- Phone numbers: Valid 10-digit Indian mobile numbers
- Emails: Valid email addresses
- Addresses: Realistic addresses
- Business names: Company names
- Dates: Valid dates in YYYY-MM-DD format
- Enums: Picks from valid options

### 2. Schema Validation

Automatically validates that generated data matches schema requirements:

```typescript
import { validateGeneratedData } from './__tests__/helpers/mockDataGenerator';

const validation = validateGeneratedData(mockData, schema);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

### 3. Test Reports

Generate comprehensive test reports:

```typescript
import { generateMarkdownReport } from './__tests__/helpers/testReporter';

const report = generateMarkdownReport(testSummary);
// Generates markdown report with all test results
```

## 📝 Writing New Tests

### Example: Adding a Bank-Specific Test

```typescript
describe('My New Bank', () => {
  let schema: any;
  let mockData: any;

  beforeAll(async () => {
    schema = await loadSchemaForTest('My New Bank');
    mockData = generateMockDataFromSchema(schema);
  });

  it('should validate specific business rule', () => {
    // Your test logic here
    expect(mockData.basicDetails.applicantName).toBeDefined();
  });
});
```

### Example: Testing Form Submission

```typescript
it('should submit form data successfully', async () => {
  const schema = await loadSchemaForTest('RBL');
  const mockData = generateMockDataFromSchema(schema);

  const response = await submitForm(mockData);

  expect(response.success).toBe(true);
});
```

## 🔍 Debugging Failed Tests

### Common Issues

**1. Schema Loading Fails**
```bash
# Cause: Schema not found
# Fix: Check schema exists in backend forms-schema directory
```

**2. Validation Fails**
```bash
# Cause: Generated data doesn't match schema
# Fix: Check field types and required fields in schema
```

**3. Mock Data Generation Fails**
```bash
# Cause: Unsupported field type
# Fix: Add support in mockDataGenerator.ts
```

### Debug Tips

```bash
# Run single test file
npm test -- allBanks.test.ts

# Run specific test
npm test -- -t "RBL Bank"

# Run with verbose output
npm test -- --verbose

# Update snapshots
npm test -- -u
```

## 🎨 Best Practices

### 1. Keep Tests Fast
- Use mocks for API calls
- Avoid unnecessary waits
- Run tests in parallel

### 2. Make Tests Independent
- Each test should work in isolation
- Don't depend on test order
- Clean up after tests

### 3. Use Descriptive Names
```typescript
// Good
it('should generate valid phone numbers for RBL schema', () => {});

// Bad
it('test phone', () => {});
```

### 4. Test Behavior, Not Implementation
```typescript
// Good - Tests behavior
it('should submit form when all required fields are filled', () => {});

// Bad - Tests implementation
it('should call handleSubmit function', () => {});
```

## 📈 Performance Benchmarks

| Operation | Target | Current |
|-----------|--------|---------|
| Load schema | < 100ms | - |
| Generate mock data | < 50ms | - |
| Run all unit tests | < 5s | - |
| Run all integration tests | < 30s | - |
| Run all 27 banks tests | < 60s | - |

## 🔄 CI/CD Integration

Tests run automatically on:
- ✅ Every push to main/develop/formfactor
- ✅ Every pull request
- ✅ Manual workflow dispatch

### CI Pipeline Stages

1. **Linting** - Code quality checks
2. **Unit Tests** - Fast, isolated tests
3. **Component Tests** - React component tests
4. **Integration Tests** - API integration tests
5. **All Banks Validation** - Comprehensive validation
6. **Coverage Report** - Generate and upload coverage

### Viewing CI Results

1. Go to GitHub Actions tab
2. Click on latest workflow run
3. View test results and coverage
4. Download artifacts for detailed reports

## 🛠️ Troubleshooting

### Tests Fail Locally But Pass in CI

```bash
# Clear Jest cache
npm test -- --clearCache

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Tests Are Slow

```bash
# Run tests in band (one at a time) to debug
npm test -- --runInBand

# Check for async operations without proper cleanup
```

### Coverage Not Updating

```bash
# Delete coverage directory
rm -rf coverage

# Run coverage again
npm run test:coverage
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Docs](https://testing-library.com/docs/react-native-testing-library/intro/)
- [React Hook Form Testing](https://react-hook-form.com/advanced-usage#TestingForm)
- [Faker.js Documentation](https://fakerjs.dev/)

## 🤝 Contributing

When adding new banks:

1. Add schema to backend `forms-schema/`
2. Tests will automatically run for new bank
3. Check test results: `npm run test:all-banks`
4. No manual test code changes needed! ✨

## 📧 Support

For questions or issues with testing:

1. Check this documentation
2. Review existing tests in `__tests__/` directory
3. Check CI/CD logs in GitHub Actions
4. Contact the development team

---

**Last Updated:** $(date)
**Maintainer:** Development Team

