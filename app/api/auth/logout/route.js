import { cookies } from 'next/headers';
import { COOKIE } from '@/lib/session';
import { ok } from '@/lib/http';
export async function POST() { cookies().delete(COOKIE); return ok(); }
