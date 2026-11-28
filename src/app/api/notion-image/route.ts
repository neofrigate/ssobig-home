import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  IMAGE_FETCH_TIMEOUT_MS,
  IMAGE_RESPONSE_SECURITY_HEADERS,
  fetchGuardedImage,
  normalizeNotionPageId,
} from "@/lib/image-proxy-guard";

export const dynamic = 'force-dynamic';

/**
 * Dynamic image endpoint that fetches fresh Notion image URLs
 * Usage: /api/notion-image?pageId=xxx&property=썸네일
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawPageId = searchParams.get('pageId');
    const property = searchParams.get('property') || '썸네일';

    if (!rawPageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
    }

    const pageId = normalizeNotionPageId(rawPageId);
    if (!pageId) {
      return NextResponse.json({ error: 'Invalid pageId' }, { status: 400 });
    }

    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Notion API key not configured' }, { status: 500 });
    }

    // Fetch fresh page data from Notion
    const url = `https://api.notion.com/v1/pages/${pageId}`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
      },
      timeout: IMAGE_FETCH_TIMEOUT_MS,
    });

    const page = response.data;
    const props = page.properties || {};
    
    // Get the requested property (fallback chain: 썸네일 → Thumbnail → 이미지 → Image)
    const imageProp = props[property] || props["Thumbnail"] || props["이미지"] || props["Image"];

    if (!imageProp) {
      return NextResponse.json({ error: 'Image property not found' }, { status: 404 });
    }

    // Extract image URL from files field
    let imageUrl = '';
    
    if (imageProp?.type === "files" && imageProp.files?.[0]) {
      const file = imageProp.files[0];
      if (file.type === "external" && file.external?.url) {
        imageUrl = file.external.url;
      } else if (file.type === "file" && file.file?.url) {
        imageUrl = file.file.url;
      }
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL found' }, { status: 404 });
    }

    // Fetch the actual image (host allowlist, image/* only, size/time limits)
    const imageResult = await fetchGuardedImage(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!imageResult.ok) {
      return NextResponse.json({ error: imageResult.error }, { status: imageResult.status });
    }

    // Return the image with caching headers (short cache since URL refreshes)
    return new NextResponse(imageResult.body, {
      headers: {
        ...IMAGE_RESPONSE_SECURITY_HEADERS,
        'Content-Type': imageResult.contentType,
        'Cache-Control': 'public, max-age=3000, must-revalidate', // 50 minutes (before 1h expiry)
      },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Notion image fetch error:', errorMessage);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}

