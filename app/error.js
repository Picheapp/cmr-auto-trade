'use client';
export default function Error({ error, reset }) {
  const db = String(error?.message || '').includes('DATABASE_URL');
  return (
    <main className="wrap section" style={{ textAlign: 'center' }}>
      <h1 className="h2">Algo salió mal / Something went wrong</h1>
      <p className="sub">{db ? 'La base de datos aún no está conectada.' : 'Intenta de nuevo en unos segundos.'}</p>
      <button className="btn" style={{ marginTop: 20 }} onClick={() => reset()}>Reintentar / Retry</button>
    </main>
  );
}
