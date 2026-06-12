import { NextResponse } from "next/server";

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/icon.png", request.url), {
    status: 308,
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "CDN-Cache-Control": "max-age=31536000",
      "Vercel-CDN-Cache-Control": "max-age=31536000",
    },
  });
}
