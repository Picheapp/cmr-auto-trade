'use client';
import { useState, useRef } from 'react';
export default function Gallery({ photos = [], alt }) {
  const [i, setI] = useState(0);
  const sx = useRef(0);
  if (!photos.length) return <div className="gallery"><div className="main" /></div>;
  const n = photos.length;
  const go = (d) => setI((x) => (x + d + n) % n);
  return (
    <div className="gallery">
      <div className="main" onTouchStart={(e) => (sx.current = e.touches[0].clientX)}
        onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - sx.current; if (Math.abs(d) > 40) go(d < 0 ? 1 : -1); }}>
        <img src={photos[i]} alt={`${alt} — ${i + 1}`} />
        {n > 1 && <><button className="nav l" onClick={() => go(-1)} aria-label="Anterior">‹</button><button className="nav r" onClick={() => go(1)} aria-label="Siguiente">›</button></>}
        <span className="idx">{i + 1} / {n}</span>
      </div>
      {n > 1 && <div className="thumbs">{photos.map((p, k) => <button key={p + k} className={k === i ? 'on' : ''} onClick={() => setI(k)}><img src={p} alt="" loading="lazy" /></button>)}</div>}
    </div>
  );
}
