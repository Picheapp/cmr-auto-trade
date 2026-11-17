import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { SEED_VEHICLES } from './seed';

let _sql = null;
function client() {
  if (!_sql) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL_UNPOOLED;
    if (!url) throw new Error('DATABASE_URL no está configurada. Conecta Neon al proyecto en Vercel.');
    _sql = neon(url);
  }
  return _sql;
}

/** Ejecuta SQL parametrizado: q('select * from x where id=$1', [1]) */
export async function q(text, params = []) {
  await ensureSchema();
  return client()(text, params);
}
export async function one(text, params = []) {
  const rows = await q(text, params);
  return rows[0] || null;
}

const SCHEMA = [
  `create table if not exists users (
    id serial primary key, email text unique not null, name text, phone text,
    password_hash text not null, role text not null default 'customer',
    created_at timestamptz default now())`,
  `create table if not exists vehicles (
    id serial primary key, stock text unique, lot text, make text, model text, year int, trim text,
    price numeric, mileage int, ext_color text, int_color text, transmission text, engine text,
    drivetrain text, fuel text, vin text, condition text default 'Used', body_type text,
    categories text[] default '{}', description text, features text[] default '{}',
    photos text[] default '{}', videos text[] default '{}', status text default 'Available',
    featured boolean default false, created_at timestamptz default now(), updated_at timestamptz default now())`,
  `create table if not exists promotions (
    id serial primary key, title text not null, subtitle text, cta_label text, cta_link text,
    image text, active boolean default true, created_at timestamptz default now())`,
  `create table if not exists testimonials (
    id serial primary key, name text not null, text text not null, rating int default 5,
    active boolean default true, created_at timestamptz default now())`,
  `create table if not exists leads (
    id serial primary key, name text, phone text, email text, vehicle_id int, type text,
    message text, status text default 'New', assigned_to int, user_id int,
    created_at timestamptz default now())`,
  `create table if not exists lead_notes (
    id serial primary key, lead_id int not null, author text, note text not null,
    created_at timestamptz default now())`,
  `create table if not exists financing (
    id serial primary key, lead_id int, user_id int, vehicle_id int, name text, email text, phone text,
    address text, employer text, job_title text, years_employed text, monthly_income numeric,
    housing text, housing_payment numeric, vehicle_price numeric, down_payment numeric, term int,
    notes text, status text default 'Received', created_at timestamptz default now())`,
  `create table if not exists tradeins (
    id serial primary key, lead_id int, user_id int, year int, make text, model text, mileage int,
    condition text, vin text, photos text[] default '{}', name text, phone text, email text,
    notes text, estimate numeric, status text default 'Received', created_at timestamptz default now())`,
  `create table if not exists appointments (
    id serial primary key, lead_id int, user_id int, vehicle_id int, type text, date date, time text,
    name text, phone text, email text, notes text, status text default 'Scheduled',
    created_at timestamptz default now())`,
  `create table if not exists favorites (user_id int not null, vehicle_id int not null,
    created_at timestamptz default now(), primary key (user_id, vehicle_id))`,
  `create table if not exists saved_searches (id serial primary key, user_id int not null,
    name text, query text, created_at timestamptz default now())`,
  `create table if not exists settings (key text primary key, value text)`,
];

export const DEFAULT_SETTINGS = {
  business_name: 'CMR Auto Trade',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  hours_es: 'Lunes a sábado 9:00 AM – 5:00 PM',
  hours_en: 'Monday to Saturday 9:00 AM – 5:00 PM',
  facebook: '',
  instagram: '',
  tiktok: '',
  maps_url: '',
};

let ready = null;
export function ensureSchema() {
  if (!ready) {
    ready = (async () => {
      const sql = client();
      for (const s of SCHEMA) await sql(s, []);
      const [{ n }] = await sql('select count(*)::int as n from vehicles', []);
      if (n === 0) {
        for (const v of SEED_VEHICLES) {
          await sql(
            `insert into vehicles (stock, lot, make, model, trim, year, body_type, categories, ext_color, drivetrain, featured, photos, condition, status)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'Used','Available') on conflict (stock) do nothing`,
            [v.stock, v.lot, v.make, v.model, v.trim || null, v.year, v.body_type, v.categories, v.ext_color, v.drivetrain, v.featured, v.photos]
          );
        }
      }
      for (const [k, val] of Object.entries(DEFAULT_SETTINGS)) {
        await sql('insert into settings (key, value) values ($1,$2) on conflict (key) do nothing', [k, val]);
      }
      const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
      const pass = process.env.ADMIN_PASSWORD;
      if (email && pass) {
        const ex = await sql('select id from users where email=$1', [email]);
        if (!ex.length) {
          await sql(`insert into users (email, name, password_hash, role) values ($1,'Administrador',$2,'admin')`, [email, await bcrypt.hash(pass, 10)]);
        }
      }
    })().catch((e) => { ready = null; throw e; });
  }
  return ready;
}

export async function getSettings() {
  const rows = await q('select key, value from settings');
  const s = { ...DEFAULT_SETTINGS };
  for (const r of rows) s[r.key] = r.value;
  return s;
}

export async function createLead({ name, phone, email, vehicle_id, type, message, user_id }) {
  const r = await one(
    `insert into leads (name, phone, email, vehicle_id, type, message, user_id) values ($1,$2,$3,$4,$5,$6,$7) returning id`,
    [name || null, phone || null, email || null, vehicle_id || null, type, message || null, user_id || null]
  );
  return r.id;
}
