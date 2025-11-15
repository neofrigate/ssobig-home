# Notion Image URL Fix

## Problem
Notion API returns **temporary image URLs** that expire after 1 hour:
```json
{
  "type": "files",
  "files": [{
    "type": "file",
    "file": {
      "url": "https://...?X-Amz-Expires=3600",
      "expiry_time": "2025-11-07T13:00:00Z"
    }
  }]
}
```

## Solution

### ✅ 1. Proper Parsing of Notion Files Field

**File: `/src/app/api/projects/route.ts`**

```typescript
const getFiles = (prop: any) => {
  if (prop?.type === "files" && prop.files?.[0]) {
    const file = prop.files[0];
    // Extract URL from the correct nested structure
    if (file.type === "external") return file.external?.url || "";
    if (file.type === "file") return file.file?.url || "";  // ✅ file.file.url
  }
  return "";
};
```

### ✅ 2. Dynamic Image Endpoint

**New file: `/src/app/api/notion-image/route.ts`**

This endpoint:
- Fetches fresh image URLs from Notion on every request
- Returns the actual image data (not just the URL)
- Caches for 50 minutes (safe before 1-hour expiry)

**Usage:**
```tsx
<Image src={`/api/notion-image?pageId=${project.id}&property=썸네일`} />
```

### ✅ 3. Updated Components

**Project List (`/project/page.tsx`):**
```tsx
// Before: Static URL that expires
<Image src={project.image} />

// After: Dynamic endpoint that refreshes
<Image src={`/api/notion-image?pageId=${project.id}&property=썸네일`} />
```

## How It Works

```
┌─────────┐     Request      ┌──────────────┐     Fresh URL      ┌────────┐
│ Browser │ ──────────────> │ /api/notion  │ ─────────────────> │ Notion │
│         │                  │   -image     │                     │  API   │
│         │ <────────────── │              │ <───────────────── │        │
└─────────┘  Image Binary    └──────────────┘   files[0].file    └────────┘
             (cached 50min)                      .url (temp)
```

### Benefits

1. **No Expired URLs** - Fresh URL fetched server-side every time
2. **Proper Parsing** - Correctly extracts `files[0].file.url`
3. **Smart Caching** - 50-minute cache (before expiry)
4. **Fallback Support** - Falls back to other properties if not found
5. **Error Handling** - Graceful degradation with placeholder

## Testing

```bash
# Test the endpoint directly
curl http://localhost:3000/api/notion-image?pageId=YOUR_PAGE_ID&property=썸네일

# Check if images load
# Visit: http://localhost:3000/project
```

## Cache Strategy

- **50 minutes**: Safe window before 1-hour expiry
- **must-revalidate**: Browser checks after cache expires
- **Next request**: Server fetches fresh URL from Notion

This ensures images always work, even for long-lived pages!

