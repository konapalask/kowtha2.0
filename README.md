# Kowtha - Loan Verification System

A comprehensive loan verification system with mobile app for field operators, web app for verifiers, and backend services.

## Project Structure

```
kowtha/
├── apps/
│   ├── backend/          # NestJS backend API
│   ├── mobile/           # React Native mobile app for field operators
│   └── web/              # Next.js web app for verifiers
├── packages/
│   └── shared/           # Shared types and utilities
├── project-data/
│   ├── kowtha-provided-templates/  # Bank DOCX templates
│   └── html-templates/             # Generated HTML templates
└── scripts/              # Utility scripts
```

## Features

### 🏦 Multi-Bank Support

Supports 27+ banks with dynamic form generation:

- RBL, Axis, Tata, ICICI, HDFC, and more
- Dynamic schema-based forms
- Single source of truth from backend

### 📱 Mobile App (Field Operators)

- Offline-first architecture
- Dynamic form rendering from schemas
- Photo capture and upload
- GPS location tracking
- Real-time sync when online

**Documentation:**

- [Testing Guide](apps/mobile/TESTING.md)
- [Quick Reference](apps/mobile/TESTING_QUICK_REFERENCE.md)

### 🌐 Web App (Verifiers)

- Enhanced dynamic form renderer
- Field operator data verification
- Additional verifier-only fields
- Edit request management
- PDF report generation

### 🔧 Backend Services

- RESTful API with NestJS
- PostgreSQL with Prisma ORM
- JWT authentication
- S3 integration for images
- PDF generation with Puppeteer

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Setup mobile app
cd apps/mobile && npm install

# Setup web app
cd apps/web && npm install

# Setup backend
cd apps/backend && npm install
```

### Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### Running the Apps

```bash
# Backend (from apps/backend)
npm run dev

# Mobile (from apps/mobile)
npm run android  # or npm run ios

# Web (from apps/web)
npm run dev
```

## 🧪 Testing

### Mobile App Testing

Comprehensive automated testing for all 27 banks:

```bash
cd apps/mobile

# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:components
npm run test:integration

# Test all 27 banks (300+ tests)
npm run test:all-banks

# With coverage
npm run test:coverage
```

**Test Coverage:**

- 300+ automated tests
- All 27 banks validated
- Smart mock data generation
- CI/CD integrated

**Documentation:**

- [Complete Testing Guide](apps/mobile/TESTING.md)
- [Quick Reference](apps/mobile/TESTING_QUICK_REFERENCE.md)
- [Implementation Summary](apps/mobile/__tests__/IMPLEMENTATION_SUMMARY.md)

## 📄 Template Converter

Convert bank DOCX templates to HTML for PDF generation:

```bash
# Convert all templates
npm run convert:templates
```

**Features:**

- Converts 22+ bank DOCX templates to HTML
- Preserves tables, headings, and formatting
- Incremental updates (skips up-to-date files)
- Clean, styled HTML output
- Ready for PDF generation with Puppeteer

**Documentation:**

- [DOCX to HTML Converter Guide](scripts/DOCX_TO_HTML_CONVERTER.md)

## 🔑 Key Technologies

### Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Auth
- Puppeteer (PDF generation)
- AWS S3

### Mobile

- React Native
- React Hook Form
- React Navigation
- Axios
- AsyncStorage

### Web

- Next.js
- Ant Design
- React Hook Form
- Axios
- dayjs

### Testing

- Jest
- Testing Library
- json-schema-faker
- @faker-js/faker

## 📊 Project Scripts

### Root Level

```bash
npm run convert:templates    # Convert DOCX to HTML
npm run build               # Build backend
npm run dev                 # Run backend in dev mode
npm run prisma:generate     # Generate Prisma client
npm run prisma:migrate      # Run database migrations
```

### Mobile App

```bash
npm test                    # Run all tests
npm run test:all-banks      # Test all 27 banks
npm run test:coverage       # Generate coverage report
npm run android             # Run on Android
npm run ios                 # Run on iOS
```

### Web App

```bash
npm run dev                 # Development server
npm run build               # Production build
npm run start               # Start production server
```

## 🗂️ Database Schema

Using Prisma ORM with PostgreSQL:

- **Users** - Authentication and roles
- **Loans** - Loan applications
- **Verifications** - FI/PD verification data (JSONB)
- **EditRequests** - Field edit requests
- **Uploads** - S3 image references

**Key Features:**

- JSONB fields for dynamic form data
- Flexible schema for multi-bank support
- Optimized queries with indexes

## 🔄 Dynamic Form System

### Architecture

```
Backend (Single Source of Truth)
    ↓
  API: /loans/get-bank-forms
    ↓
Mobile/Web Apps
    ↓
Dynamic Form Renderer
    ↓
Validation & Submission
```

### Form Schema Format

```typescript
{
  "id": 1,
  "bankName": "RBL",
  "sections": [
    {
      "id": "basicDetails",
      "label": "Basic Details",
      "schema": {
        "type": "object",
        "properties": {
          "applicantName": { "type": "string", "title": "Applicant Name" },
          "phoneNo": { "type": "string", "title": "Phone Number" }
        },
        "required": ["applicantName"]
      }
    }
  ]
}
```

## 📈 Metrics & Performance

### Testing

- **300+ automated tests** for mobile forms
- **95% reduction** in manual testing time
- **< 1 minute** to validate all 27 banks

### Template Conversion

- **22 DOCX templates** converted to HTML
- **~2 seconds per file** conversion time
- **Incremental updates** for fast rebuilds

## 🚀 CI/CD

### GitHub Actions

- **Mobile Tests** - Run on every push/PR
- **Backend Build** - Automated builds
- **Coverage Reports** - Codecov integration
- **PR Comments** - Auto-comment with test results

**Workflows:**

- `.github/workflows/mobile-tests.yml`

## 📝 Documentation

### Testing

- [Mobile Testing Guide](apps/mobile/TESTING.md) - Complete guide (550+ lines)
- [Quick Reference](apps/mobile/TESTING_QUICK_REFERENCE.md) - Common commands
- [Implementation Summary](apps/mobile/__tests__/IMPLEMENTATION_SUMMARY.md)
- [Testing Complete Overview](TESTING_IMPLEMENTATION_COMPLETE.md)

### Template Conversion

- [DOCX to HTML Guide](scripts/DOCX_TO_HTML_CONVERTER.md) - Complete converter docs

### General

- [Backend API Docs](apps/backend/README.md) - API documentation
- [Mobile App Guide](apps/mobile/README.md) - Mobile setup and usage
- [Web App Guide](apps/web/README.md) - Web setup and usage

## 🛠️ Development Workflow

### Adding a New Bank

1. **Backend**: Add schema to `apps/backend/src/modules/loan/forms-schema/`
2. **Template**: Add DOCX to `project-data/kowtha-provided-templates/BANK_NAME/`
3. **Convert**: Run `npm run convert:templates`
4. **Test**: Run `npm run test:all-banks` (auto-includes new bank!)

That's it! No manual coding needed ✨

### Making Changes

1. Create feature branch
2. Make changes
3. Run tests: `npm test`
4. Commit and push
5. Create PR
6. CI/CD validates automatically

## 🤝 Contributing

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting

### Testing

- Write tests for new features
- Maintain > 60% coverage
- All tests must pass before merge

### Documentation

- Update README for new features
- Add inline code comments
- Update API docs

## 📞 Support

For questions or issues:

1. Check relevant documentation
2. Review error messages
3. Check CI/CD logs
4. Contact development team

## 📜 License

Proprietary - All Rights Reserved

---

**Project Status:** ✅ Production Ready  
**Last Updated:** October 10, 2025  
**Version:** 1.0.0
