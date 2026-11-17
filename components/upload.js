'use client';
// Reduce la foto en el navegador (máx. 1800px, JPEG) y la sube a /api/upload.
export async function resizeImage(file, max = 1800, quality = 0.82) {
  if (!file.type.startsWith('image/')) throw new Error('Solo imágenes');
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const s = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return await new Promise((res) => c.toBlob(res, 'image/jpeg', quality));
  } finally { URL.revokeObjectURL(url); }
}
export async function uploadImages(files, folder = 'uploads') {
  const urls = [];
  for (const f of files) {
    const blob = await resizeImage(f);
    const fd = new FormData(); fd.append('file', blob, (f.name || 'foto').replace(/\.[^.]+$/, '') + '.jpg'); fd.append('folder', folder);
    const r = await fetch('/api/upload', { method: 'POST', body: fd });
    const j = await r.json(); if (!j.ok) throw new Error(j.error || 'Error al subir'); urls.push(j.url);
  }
  return urls;
}
