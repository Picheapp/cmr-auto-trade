import Link from 'next/link';
export default function NotFound() {
  return <main className="wrap section" style={{ textAlign: 'center' }}><h1 className="h2">404</h1><p className="sub">Página no encontrada / Page not found</p><Link className="btn" href="/inventory" style={{ marginTop: 20 }}>Inventario / Inventory</Link></main>;
}
