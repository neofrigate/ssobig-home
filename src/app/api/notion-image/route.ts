import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = 'force-dynamic';

/**
 * Dynamic image endpoint that fetches fresh Notion image URLs
 * Usage: /api/notion-image?pageId=xxx&property=썸네일
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageId = searchParams.get('pageId');
    const property = searchParams.get('property') || '썸네일';

    if (!pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
    }

    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Notion API key not configured' }, { status: 500 });
    }

    // Fetch fresh page data from Notion
    const url = `https://api.notion.com/v1/pages/${pageId}`;
    
    const https = await import('https');
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
      },
      httpsAgent,
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

    // Fetch the actual image
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      httpsAgent,
    });

    // Return the image with caching headers (short cache since URL refreshes)
    const contentType = imageResponse.headers['content-type'] || 'image/jpeg';
    
    return new NextResponse(imageResponse.data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3000, must-revalidate', // 50 minutes (before 1h expiry)
      },
    });

  } catch (error: any) {
    console.error('Notion image fetch error:', error.message);
    return NextResponse.json(
      { 
        error: 'Failed to fetch image',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

