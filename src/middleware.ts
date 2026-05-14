import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

// Himoon ang rate limiter: 20 ka requests per 10 seconds per IP
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, '10 s'),
  analytics: true,
});

export async function middleware(request: NextRequest) {
  // Rate limit sa API routes para iwas spam
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json({ error: 'Hinay-hinay lang, daghan na kaayong requests!' }, { status: 429 });
    }
    
    const res = NextResponse.next();
    res.headers.set('X-RateLimit-Limit', limit.toString());
    res.headers.set('X-RateLimit-Remaining', remaining.toString());
    res.headers.set('X-RateLimit-Reset', reset.toString());
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
