# PDF Preview Implementation for QA Testing

## Overview

Added PDF generation and preview functionality to the mobile QA Testing screen, allowing testers to view generated PDFs after successful form submission.

## Features Implemented

### 1. **View PDF Button**

- Orange "View PDF" button appears after successful form submission
- Only visible when a loan ID is available (after QA loan creation)
- Located below the "Submit QA Test Form" button

### 2. **PDF Generation**

- Calls the same backend endpoint used by the web app: `GET /api/loans/:loanId/preview-final-report`
- Passes `type=Business` and `department=PD` as query parameters
- Receives PDF as blob response
- Converts blob to base64 data URL for mobile handling

### 3. **PDF Preview Modal**

- Full-screen modal displays after PDF generation
- Shows success message with "Open PDF" button
- Taps "Open PDF" to launch external PDF viewer (system default app)
- Close button (X) in top-right to dismiss modal
- Loading state while PDF is being generated

### 4. **Backend Changes**

- Modified `/loans/:id/preview-final-report` endpoint to use `@Roles(All)` instead of `@Roles(UserRole.Admin, UserRole.Verifier)`
- This allows field executives to access PDF preview during QA testing

## User Flow

1. **Load Form**

   - Field executive logs in (e.g., 9912994742)
   - Opens QA Testing screen
   - Selects a bank (e.g., RBL)

2. **Submit Form**

   - Fills in auto-generated test data
   - Taps "Submit QA Test Form"
   - Toast message: "Form submitted! Tap 'View PDF' button to preview."

3. **View PDF**

   - Orange "View PDF" button appears
   - Tap to generate PDF
   - Toast: "Generating PDF... Please wait"
   - Modal opens with success message

4. **Open PDF**
   - Tap "Open PDF" button in modal
   - System opens PDF in default viewer (e.g., Adobe Reader, Google PDF Viewer)
   - Can zoom, scroll, share, download, etc.

## Technical Details

### Frontend (Mobile)

**File**: `apps/mobile/src/screens/QAFormTesting.tsx`

**New State Variables**:

```typescript
const [showPdfPreview, setShowPdfPreview] = useState(false);
const [pdfUrl, setPdfUrl] = useState<string | null>(null);
```

**PDF Generation Function**:

```typescript
const handleViewPdf = async () => {
  const response = await axiosInstance.get(
    `/loans/${item.loanId}/preview-final-report`,
    {
      params: { type: "Business", department: "PD" },
      responseType: "blob",
    }
  );

  // Convert blob to base64 data URL
  const blob = response.data;
  const fileReaderInstance = new FileReader();
  fileReaderInstance.readAsDataURL(blob);
  fileReaderInstance.onload = () => {
    setPdfUrl(fileReaderInstance.result as string);
    setShowPdfPreview(true);
  };
};
```

**New Imports**:

- `Modal` - For full-screen PDF preview modal
- `Linking` - To open PDF in external app

**New Styles**:

- `pdfButton` - Orange button with PDF icon
- `pdfModal` - Full-screen modal container
- `pdfModalHeader` - Header with title and close button
- `pdfContainer` - Success message container
- `openPdfButton` - Blue button to launch PDF
- `pdfLoading` - Loading spinner and text

### Backend

**File**: `apps/backend/src/modules/loan/loan.controller.ts`

**Change**:

```typescript
// Before:
@Roles(UserRole.Admin, UserRole.Verifier)

// After:
@Roles(All) // Allow all roles including field executives for QA testing
```

This allows field executives (who are logged in during QA testing) to access the PDF preview endpoint.

## Testing Instructions

### 1. Restart Backend

```bash
cd /Users/shashank/projects/kowtha/apps/backend
pkill -f "nest start"
npm run start:dev
```

### 2. Reload Mobile App

The app should already be running from previous build. If not:

```bash
cd /Users/shashank/projects/kowtha/apps/mobile
npm run android
```

Or just press 'r' in the Metro bundler terminal to reload.

### 3. Test PDF Generation

1. Open QA Testing screen (tap floating PDF icon)
2. Select "RBL" bank
3. Wait for form to load with auto-populated data
4. Scroll down and tap "Submit QA Test Form"
5. After success message, tap orange "View PDF" button
6. Wait for "Generating PDF..." toast
7. Modal opens with "PDF Generated Successfully!"
8. Tap "Open PDF" to launch in external viewer
9. Verify PDF shows correctly with all form data

### 4. Monitor Logs

```bash
cd /Users/shashank/projects/kowtha
./capture-android-logs.sh
```

**Expected logs**:

```
🔵 QA LOAN CREATION: Calling API
✅ QA LOAN RESPONSE DATA: ...
Toast: Form submitted! Tap "View PDF" button to preview.
Toast: Generating PDF... Please wait
// PDF opens in external app
```

## Benefits for QA

1. **End-to-End Testing**: Verify entire flow from form submission to PDF generation
2. **Visual Verification**: See exactly how data appears in final PDF
3. **Template Testing**: Ensure RBL template (and other banks) render correctly
4. **Field Mapping**: Verify all schema fields map to correct PDF positions
5. **Quick Iteration**: Submit → View PDF → Adjust schema → Repeat

## Next Steps (Optional Enhancements)

1. **In-App PDF Viewer**: Install `react-native-pdf` for in-app viewing (requires native rebuild)
2. **PDF Download**: Add option to save PDF to device
3. **Share PDF**: Add share button to send via WhatsApp, email, etc.
4. **PDF Cache**: Cache PDFs to avoid regenerating on every view
5. **Other Verification Types**: Support Address1, Address2, Work verification PDFs

## Notes

- PDF opens in external app for better user experience (zoom, scroll, share)
- FileReader API converts blob to base64 for React Native compatibility
- Linking API handles opening PDFs in system default viewer
- Backend endpoint now allows field executives (not just admins/verifiers)
- This is **only for QA testing** - production PDFs should remain admin/verifier only
- Consider reverting `@Roles(All)` to `@Roles(UserRole.Admin, UserRole.Verifier)` before production

## Files Modified

**Mobile**:

- `apps/mobile/src/screens/QAFormTesting.tsx` - PDF generation and preview UI

**Backend**:

- `apps/backend/src/modules/loan/loan.controller.ts` - Endpoint permission change

**Built**: Backend rebuilt and ready to test!
