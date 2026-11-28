import { NextRequest, NextResponse } from 'next/server';
import {
  IMAGE_RESPONSE_SECURITY_HEADERS,
  fetchGuardedImage,
  parseAllowedImageUrl,
} from '@/lib/image-proxy-guard';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // 노션 이미지 계열 https 호스트만 허용
    if (!parseAllowedImageUrl(imageUrl)) {
      return NextResponse.json({ error: 'Image host not allowed' }, { status: 403 });
    }

    // 노션 이미지 URL fetch (리다이렉트·Content-Type·크기·타임아웃 검사 포함)
    const result = await fetchGuardedImage(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    // 이미지 응답 전달
    return new NextResponse(result.body, {
      headers: {
        ...IMAGE_RESPONSE_SECURITY_HEADERS,
        'Content-Type': result.contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
