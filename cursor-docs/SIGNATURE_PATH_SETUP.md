# Signature Path Configuration for PDF Generation

## Changes Made

Updated the signature loading logic in `apps/backend/src/modules/loan/templates/pd-templates.service.ts` to use a more flexible path resolution:

### Before:

```typescript
const imagePath = path.resolve(
  process.env.SIGNATURE_PATH || "/home/ubuntu/kowtha/new_sign.jpg"
);
```

### After:

```typescript
const signaturePath = path.resolve(process.cwd(), process.env.SIGNATURE_PATH);
```

## What Changed

1. **Renamed variable**: `imagePath` → `signaturePath` (more descriptive)
2. **Base path**: Now uses `process.cwd()` (current working directory)
3. **Relative path**: `SIGNATURE_PATH` is now relative to project root
4. **No fallback**: Removed hardcoded `/home/ubuntu/kowtha/new_sign.jpg` fallback

## Environment Variable Setup

The signature image is already in the repository at:

```
/Users/shashank/projects/kowtha/apps/backend/src/images/new_sign.jpg
```

### Set the Environment Variable

Add this to your backend `.env` file (or set in your environment):

```bash
SIGNATURE_PATH=src/images/new_sign.jpg
```

**Important Notes:**

- Path is relative to `apps/backend/` directory (where backend runs)
- `process.cwd()` returns `/Users/shashank/projects/kowtha/apps/backend` when backend is running
- Final resolved path: `/Users/shashank/projects/kowtha/apps/backend/src/images/new_sign.jpg`

### Example .env File

If you don't have a `.env` file in `apps/backend/`, create one:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kowtha_dev

# JWT
JWT_SECRET=your-secret-key

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket

# Signature for PDF
SIGNATURE_PATH=src/images/new_sign.jpg

# Other variables...
```

## Testing

1. **Restart backend** (important!):

   ```bash
   cd /Users/shashank/projects/kowtha/apps/backend
   pkill -f "nest start"
   npm run start:dev
   ```

2. **Generate a PDF**:

   - Use the mobile QA Testing screen
   - Submit a form for RBL bank
   - Tap "View PDF" button
   - Verify signature appears in the PDF

3. **Check logs**:
   If signature is missing or PDF generation fails, check backend logs for errors like:
   ```
   Error: ENOENT: no such file or directory, open '/Users/shashank/projects/kowtha/apps/backend/src/images/new_sign.jpg'
   ```

## Troubleshooting

### PDF generates but no signature appears

- Check that `SIGNATURE_PATH` is set in your environment
- Verify the file exists at the path
- Ensure file permissions allow reading

### Error: "ENOENT: no such file or directory"

- Verify `SIGNATURE_PATH` environment variable is set
- Check that the path is correct relative to `apps/backend/`
- Ensure `new_sign.jpg` exists in `src/images/` folder

### Error: "process.env.SIGNATURE_PATH is undefined"

- Add `SIGNATURE_PATH=src/images/new_sign.jpg` to your `.env` file
- Restart the backend after adding the variable
- Make sure `.env` file is in `apps/backend/` directory

## Deployment Notes

For production/staging deployments:

1. **Docker**: Add `SIGNATURE_PATH=src/images/new_sign.jpg` to your docker-compose or Dockerfile ENV
2. **PM2**: Add to ecosystem.config.js env variables
3. **Systemd**: Add to environment file
4. **Vercel/Heroku**: Add to environment variables in dashboard

## Files Modified

- `apps/backend/src/modules/loan/templates/pd-templates.service.ts` - Updated signature path resolution
- Backend built and ready to use with the new configuration

## Benefits

1. **Repository-based**: Signature is version controlled
2. **Portable**: Works on any machine without hardcoded paths
3. **Flexible**: Easy to change signature by updating file or env var
4. **Clear**: More explicit about where signature comes from
