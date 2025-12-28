# PD Forms Testing - Quick Reference

## 🚀 Common Commands

```bash
# Development
npm test                          # Run all tests
npm run test:watch               # Watch mode
npm run test:coverage            # With coverage

# Specific Suites
npm run test:unit                # Unit tests only
npm run test:components          # Component tests only
npm run test:integration         # Integration tests only
npm run test:all-banks           # All 27 banks

# CI/CD
npm run test:ci                  # CI optimized
npm run test:debug               # Debug mode
```

## 📊 Test Structure

```
Unit Tests (50%)          → Basic functionality
Component Tests (30%)     → UI components
Integration Tests (20%)   → End-to-end flows
```

## ✅ All 27 Banks Auto-Tested

Each bank automatically tests:
- ✅ Schema loads
- ✅ Valid structure
- ✅ Mock data generates
- ✅ Data validates
- ✅ Required fields populated
- ✅ Correct data types
- ✅ Enum constraints
- ✅ Phone/date validation
- ✅ Arrays/objects work

## 🔧 Debug Commands

```bash
# Single test file
npm test -- allBanks.test.ts

# Specific test
npm test -- -t "RBL Bank"

# Verbose output
npm test -- --verbose

# Clear cache
npm test -- --clearCache
```

## 📈 Coverage Targets

| Metric | Target |
|--------|--------|
| Statements | 60% |
| Branches | 50% |
| Functions | 50% |
| Lines | 60% |

## 🎯 Quick Tips

1. **Tests too slow?** → Check for uncleared timers/promises
2. **Validation failing?** → Check schema required fields
3. **Mock data wrong?** → Update mockDataGenerator.ts
4. **CI failing locally passing?** → Clear cache & reinstall

## 📝 Add New Bank

1. Add schema to `backend/forms-schema/`
2. Run `npm run test:all-banks`
3. **That's it!** Tests run automatically ✨

## 🔍 View Results

```bash
# Local
npm run test:coverage
open coverage/lcov-report/index.html

# CI
GitHub Actions → View workflow → Download artifacts
```

## 🆘 Common Errors

| Error | Fix |
|-------|-----|
| "Schema not found" | Check backend schema exists |
| "Validation failed" | Check required fields match |
| "Timeout" | Increase jest timeout in config |
| "Module not found" | Run `npm install` |

---

**Need help?** See [TESTING.md](./TESTING.md) for full documentation

