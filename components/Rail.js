'use client';
import { useRef } from 'react';
export default function Rail({ children }) {
  const ref = useRef(null);
  const go = (d) => ref.current && ref.current.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <div className="rail">
      <button className="arw l" aria-label="Anterior" onClick={() => go(-1)}>‹</button>
      <div className="track" ref={ref}>{children}</div>
      <button className="arw r" aria-label="Siguiente" onClick={() => go(1)}>›</button>
    </div>
  );
}
