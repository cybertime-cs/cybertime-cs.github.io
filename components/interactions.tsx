'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { sitePath, type Language } from '@/content/profile';
import { copy } from '@/lib/copy';

export function Citation({ text, language }: { text: string; language: Language }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const t = copy[language];
  async function copyCitation() {
    try { await navigator.clipboard.writeText(text); setState('copied'); }
    catch { setState('failed'); }
  }
  return <details className="citation"><summary>{t.bibtex}</summary><pre>{text}</pre><Button variant="outline" onClick={copyCitation}>{state === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{state === 'copied' ? t.copied : t.copyBib}</Button><output className="copy-status">{state === 'failed' ? t.copyFailed : state === 'copied' ? t.copied : ''}</output></details>;
}

export function Enhancements({ language }: { language: Language }) {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-language-link]'));
    const updateLanguageLinks = () => { links.forEach(link => { link.hash = window.location.hash; }); };
    updateLanguageLinks();
    window.addEventListener('hashchange', updateLanguageLinks);
    try { localStorage.setItem('academic-language', language); } catch { /* Storage is optional. */ }
    const sectionLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-section-link]'));
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
    const progress = document.getElementById('reading-progress-bar');
    let scrollFrame = 0;
    const updateScroll = () => {
      scrollFrame = 0;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 1})`;
      let current: string | undefined = sections[0]?.id;
      for (const section of sections) { if (section.getBoundingClientRect().top <= 180) current = section.id; }
      if (height > 0 && window.scrollY >= height - 5) current = sections.at(-1)?.id;
      sectionLinks.forEach(link => { if (link.dataset.sectionLink === current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    };
    const scroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); };
    updateScroll();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll, { passive: true });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)');
    const halo = document.getElementById('cursor-companion');
    let frame = 0; let x = -100; let y = -100; let targetX = -100; let targetY = -100;
    let visible = false;
    const animate = () => {
      x += (targetX - x) * 0.3; y += (targetY - y) * 0.3;
      if (halo) halo.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(x - targetX) + Math.abs(y - targetY) > 0.4) frame = requestAnimationFrame(animate);
      else frame = 0;
    };
    const move = (event: PointerEvent) => {
      if (!halo || reduced.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
      targetX = Math.min(event.clientX, window.innerWidth - 66); targetY = Math.min(event.clientY, window.innerHeight - 66);
      if (!visible) { x = targetX; y = targetY; halo.style.opacity = '1'; visible = true; }
      halo.classList.toggle('over-link', !!(event.target as HTMLElement).closest('a,button,summary'));
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const hide = () => { visible = false; if (halo) halo.style.opacity = '0'; if (frame) cancelAnimationFrame(frame); frame = 0; };
    const preferences = () => { if (reduced.matches || !finePointer.matches) hide(); };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    document.addEventListener('visibilitychange', hide);
    reduced.addEventListener('change', preferences); finePointer.addEventListener('change', preferences);
    return () => {
      window.removeEventListener('hashchange', updateLanguageLinks); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll);
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', hide); window.removeEventListener('blur', hide); document.removeEventListener('visibilitychange', hide);
      reduced.removeEventListener('change', preferences); finePointer.removeEventListener('change', preferences);
      cancelAnimationFrame(frame); cancelAnimationFrame(scrollFrame);
    };
  }, [language]);
  return <div id="cursor-companion" aria-hidden="true"><Image unoptimized src={sitePath('baymax-full-body.png')} alt="" width={48} height={48} loading="eager" onError={(event) => { event.currentTarget.style.display = 'none'; }} /></div>;
}
