# Array Change Tracking System

This document describes the implementation of the foolproof array change tracking system across mobile, web, and backend applications.

## Overview

The system provides:

- ✅ **Unique ID Management**: All array items have persistent unique IDs
- ✅ **Granular Change Tracking**: Track row-level and field-level changes
- ✅ **Visual Diff Display**: Clear admin approval UI showing what changed
- ✅ **Backend Validation**: Robust data integrity checks
- ✅ **Seamless Migration**: Gradual adoption for existing data

## Architecture

```
Mobile App (Field Executive)
    ↓ Submits array data with unique IDs
Backend API (Validation & Storage)
    ↓ Stores in verification.verificationData
Web App (Verifier/Assistant Verifier)
    ↓ Edits arrays, creates EditRequest with change metadata
Backend API (Admin Approval)
    ↓ Validates and applies changes
Database (Updated array data)
```

## Mobile App Implementation

### Array Utilities (`src/helpers/arrayUtils.ts`)

```typescript
import {
  generateArrayItemId,
  ensureArrayItemsHaveIds,
} from "../helpers/arrayUtils";

// Generate unique ID for new array item
const newId = generateArrayItemId();

// Ensure all items in array have IDs
const arrayWithIds = ensureArrayItemsHaveIds(familyMembers);
```

### SchemaSection Component

The `SchemaSection` component automatically:

- Generates unique IDs for new array items
- Preserves existing IDs when editing
- Validates array integrity before submission
- Cleans empty items while preserving structure

**No changes needed in mobile forms** - the system works transparently.

## Backend Implementation

### Array Validation Service (`src/modules/loan/services/array-validation.service.ts`)

```typescript
@Injectable()
export class ArrayValidationService {
  // Validate array data structure
  validateArrayData(arrayData: any, fieldName: string, schema?: any);

  // Ensure all items have unique IDs
  ensureArrayHasIds(arrayData: any[]);

  // Detect changes between old and new arrays
  detectArrayChanges(oldArray: any[], newArray: any[]);

  // Validate entire verification object
  validateVerificationArrays(verificationData: any);
}
```

### Edit Request Service Integration

The `EditRequestService` now:

- Validates array data when edit requests are created
- Generates change metadata for admin review
- Fixes missing IDs automatically
- Validates before applying approved changes

## Web App Implementation

### Array Utilities (`src/utils/arrayUtils.ts`)

```typescript
import { findArrayChanges, ensureArrayItemsHaveIds } from "@/utils/arrayUtils";

// Find differences between arrays
const changes = findArrayChanges(oldArray, newArray);
console.log(changes.added, changes.removed, changes.modified);

// Ensure arrays have proper IDs
const cleanedArray = ensureArrayItemsHaveIds(userInput);
```

### ArrayDiffDisplay Component

```tsx
import { ArrayDiffDisplay } from "@/components/verify/ArrayDiffDisplay";

<ArrayDiffDisplay
  fieldName="familyMembers"
  fieldLabel="Family Members"
  currentArray={currentData}
  changedArray={editedData}
  arraySchema={fieldSchema}
  showSideBySide={false}
/>;
```

**Features:**

- 🟢 Green highlighting for added items
- 🔴 Red highlighting for removed items
- 🟡 Yellow highlighting for modified items
- Field-level change display (old value → new value)
- Expandable detailed view
- Change summary statistics

### DynamicEditModal Enhancement

The modal now:

- Automatically assigns IDs to new array items
- Validates array structure before saving
- Preserves IDs during editing operations
- Cleans empty items while maintaining structure

## Usage Examples

### Mobile App - Adding Family Member

```typescript
// Mobile app automatically handles IDs
const newMember = {
  // _id is automatically generated
  name: "New Family Member",
  relation: "Child",
  age: 10,
};
// ID is added by SchemaSection component
```

### Web App - Editing Array Field

```typescript
// In verification detail component
const handleEditArray = (sectionId: string) => {
  setEditModalVisible(true);
  setCurrentEditSection(sectionId);
};

// DynamicEditModal handles array editing with ID preservation
```

### Backend - Processing Edit Request

```typescript
// Edit request automatically includes change metadata
const editRequest = {
  changes: {
    familyMemberDetails: [...], // Full updated array
    _arrayChangesMetadata: {
      familyMemberDetails: {
        summary: { added: 1, removed: 0, modified: 2 },
        details: { /* detailed change info */ }
      }
    }
  }
};
```

## Database Migration

### Running Migration Script

```bash
# Dry run to see what would be changed
npx ts-node src/scripts/migrate-array-ids.ts --dry-run

# Migrate specific department
npx ts-node src/scripts/migrate-array-ids.ts --department PD

# Migrate specific verification
npx ts-node src/scripts/migrate-array-ids.ts --verification-id 123

# Full migration with custom batch size
npx ts-node src/scripts/migrate-array-ids.ts --batch-size 50
```

### Migration Features

- ✅ **Dry Run Mode**: Preview changes without modifying data
- ✅ **Batch Processing**: Handle large datasets efficiently
- ✅ **Progress Tracking**: Real-time progress indicators
- ✅ **Error Recovery**: Graceful error handling with detailed logs
- ✅ **Rollback Capability**: Backup creation before changes
- ✅ **Validation**: Pre and post migration data validation

## Testing

### Running Tests

```bash
# Mobile tests
cd apps/mobile
npm test arrayUtils.test.ts
npm test SchemaSection.integration.test.tsx

# Backend tests
cd apps/backend
npm test array-validation.service.spec.ts
npm test array-change-workflow.integration.spec.ts
npm test migrate-array-ids.test.ts

# Web tests
cd apps/web
npm test arrayUtils.test.ts
```

### Test Coverage

- ✅ **Unit Tests**: All utility functions
- ✅ **Integration Tests**: Full workflow testing
- ✅ **Component Tests**: UI component behavior
- ✅ **Performance Tests**: Large dataset handling
- ✅ **Error Handling**: Edge cases and failure scenarios

## Deployment Checklist

### Before Deployment

1. **Run Tests**: Ensure all tests pass

   ```bash
   npm run test
   ```

2. **Test Migration**: Run dry-run migration

   ```bash
   npx ts-node src/scripts/migrate-array-ids.ts --dry-run
   ```

3. **Backup Database**: Create full database backup

4. **Validate Schemas**: Ensure all bank schemas are valid

### Deployment Steps

1. **Deploy Backend**: New validation service and edit request logic
2. **Run Migration**: Migrate existing array data
   ```bash
   npx ts-node src/scripts/migrate-array-ids.ts
   ```
3. **Deploy Web App**: New diff display and array editing
4. **Deploy Mobile App**: UUID generation and array handling
5. **Validate**: Test edit request workflow end-to-end

### Post-Deployment Monitoring

- Monitor edit request creation for validation errors
- Check array change metadata generation
- Verify approval workflow functions correctly
- Watch for performance issues with large arrays

## Troubleshooting

### Common Issues

**Q: Array items are missing IDs after migration**

```bash
# Re-run migration for specific verification
npx ts-node src/scripts/migrate-array-ids.ts --verification-id <ID>
```

**Q: Duplicate IDs detected in arrays**

```bash
# The migration script automatically fixes duplicates
# Run validation to check current state
npx ts-node src/scripts/validate-array-ids.ts --verification-id <ID>
```

**Q: Web app shows "Invalid array data" error**

- Check browser console for specific validation errors
- Ensure all array items have unique `_id` fields
- Verify array structure matches expected schema

**Q: Mobile app not generating IDs**

- Check that `react-native-uuid` package is installed
- Verify imports in `SchemaSection.tsx`
- Check console logs for array utility warnings

### Debug Mode

Enable detailed logging:

```typescript
// Backend
console.log(
  "Array validation:",
  arrayValidationService.validateArrayData(data, "field")
);

// Frontend
console.log("Array changes:", findArrayChanges(oldArray, newArray));
```

## Performance Considerations

- **Large Arrays**: Migration script processes in batches (default: 100)
- **Memory Usage**: Array utilities use minimal memory footprint
- **Database**: JSON field updates are atomic
- **UI Rendering**: Virtual scrolling for arrays >50 items (TODO)

## Security Considerations

- **ID Generation**: UUIDs prevent ID prediction/collision
- **Validation**: Server-side validation prevents malformed data
- **Access Control**: Edit requests require proper permissions
- **Audit Trail**: All changes are logged with metadata

## Future Enhancements

- [ ] Real-time conflict detection for concurrent edits
- [ ] Partial array updates (change only modified items)
- [ ] Array field versioning for better conflict resolution
- [ ] Advanced diff algorithms for better change detection
- [ ] Export/import functionality for array data
- [ ] Automated data integrity monitoring

---

For questions or issues, please refer to the test files for detailed usage examples or contact the development team.
