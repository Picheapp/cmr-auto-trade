# CMR Auto Trade — plataforma de concesionario

Next.js 14 (App Router) + Neon Postgres + Vercel Blob. Bilingüe ES/EN.

- Sitio público: inicio, inventario con filtros, detalle de vehículo, financiamiento, trade-in, citas, comparar, cuenta de cliente.
- Admin (`/admin`): inventario, leads/CRM, citas, financiamiento, trade-ins, clientes, promociones, testimonios, usuarios y ajustes.
- El esquema de la BD se crea solo en la primera visita (`lib/db.js`) y carga el lote L007 inicial.

Variables de entorno (Vercel): `DATABASE_URL` (Neon), `BLOB_READ_WRITE_TOKEN`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, opcional `NEXT_PUBLIC_SITE_URL`.
