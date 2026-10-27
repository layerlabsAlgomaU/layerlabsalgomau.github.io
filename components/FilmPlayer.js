'use client';

import { useEffect, useRef } from 'react';

// The film on the home page. It is silent, loops, and starts by itself (muted, as browsers
// require) while it is on screen. The normal video controls are always there, so anyone can
// pause it, scrub it or turn it up. It never autoplays for visitors whose device is set to
// "reduce motion", and if you pause it yourself it stays paused.
export default function FilmPlayer({ src, poster, label }) {
    const video = useRef(null);

    useEffect(() => {
        const el = video.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // poster only

        let pausedByVisitor = false;
        let pausedByScript = false;

        function onPause() {
            if (!pausedByScript) pausedByVisitor = true; // the visitor pressed pause
            pausedByScript = false;
        }
        function onPlay() {
            pausedByVisitor = false;
        }
        el.addEventListener('pause', onPause);
        el.addEventListener('play', onPlay);

        // play while at least a third of it is on screen, pause when it scrolls away
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                if (!pausedByVisitor) el.play().catch(() => { });
            } else if (!el.paused) {
                pausedByScript = true;
                el.pause();
            }
        }, { threshold: 0.35 });
        observer.observe(el);

        return () => {
            observer.disconnect();
            el.removeEventListener('pause', onPause);
            el.removeEventListener('play', onPlay);
        };
    }, []);

    return (
        <video ref={video} className="film-video" src={src} poster={poster} muted loop playsInline controls
            preload="metadata" aria-label={label} />
    );
}
