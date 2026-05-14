import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const views = await redis.incr(`views:${id}`);
    return NextResponse.json({ views });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  const views = await redis.get<number>(`views:${id}`) || 0;
  return NextResponse.json({ views });
}
