import { NextResponse } from 'next/server';
export const ok = (data = {}) => NextResponse.json({ ok: true, ...data });
export const bad = (error, status = 400) => NextResponse.json({ ok: false, error }, { status });
export const str = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : v == null ? '' : String(v).trim().slice(0, max));
export const num = (v) => { if (v === '' || v == null) return null; const n = Number(String(v).replace(/[^0-9.\-]/g, '')); return Number.isFinite(n) ? n : null; };
export const int = (v) => { const n = num(v); return n == null ? null : Math.round(n); };
export const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || '');
export const isPhone = (p) => (p || '').replace(/\D/g, '').length >= 7;
