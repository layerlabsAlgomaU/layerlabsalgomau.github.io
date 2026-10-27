'use client';

// The "live" scroll effects, for every page. This component shows nothing itself:
//   1. Print progress: fills the red line in the header as you scroll.
//   2. Scroll reveal: titles, cards and banners are "printed" into view.
//
// If the visitor asked for reduced motion, we skip all of it and everything stays visible.

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Different things arrive in different ways, so the page does not feel repetitive:
//   cards fade up, list rows slide in from the left, tickets from the right, photos scale in,
//   everything else (titles, text) is "printed" into view from the bottom edge.
const VARIANTS = ['reveal-fade', 'reveal-left', 'reveal-right', 'reveal-scale'];
function variantFor(el) {
    if (el.matches('.roster li, .steps li')) return 'reveal-left';
    if (el.matches('.ticket')) return 'reveal-right';
    if (el.matches('.print-gallery li')) return 'reveal-scale';
    if (el.matches('.tile, .panel, .column, .path-card')) return 'reveal-fade';
    return '';
}

// Everything that should be printed into view. The hero is left out: it has its own entrance.
const SELECTOR = [
    'main section:not(.hero):not(.join-banner) h2',
    'main section:not(.hero):not(.join-banner) > p',
    'main .page-intro > *',
    'main .tile',
    'main .panel',
    'main .column',
    'main .roster li',
    'main .steps li',
    'main .path-card',
    'main .print-gallery li',
    'main .ticket',
    'main .featured-prints > a',
    'main .our-services > a',
    'main .join-banner',
].join(', ');

export default function ScrollEffects() {
    const pathname = usePathname();

    // ---------- 1. Print progress (set up once) ----------
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let waiting = false; // only update once per screen refresh (smooth + cheap)

        function update() {
            const bar = document.querySelector('.print-progress');
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
            if (bar) bar.style.setProperty('--p', Math.min(Math.max(amount, 0), 1));
            waiting = false;
        }

        function onScroll() {
            if (!waiting) {
                waiting = true;
                window.requestAnimationFrame(update);
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        update();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ---------- 2. Scroll reveal (set up again on every page change) ----------
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!('IntersectionObserver' in window)) return;

        const timers = [];
        const viewportHeight = window.innerHeight;
        const siblingCount = new Map(); // how many reveal items we already saw in each parent

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('is-visible');
                observer.unobserve(el); // animate once only

                // After the wipe, hand the element back to its normal styles
                // so nothing stays masked (focus rings, shadows).
                timers.push(setTimeout(() => {
                    el.classList.remove('reveal', 'is-visible', ...VARIANTS);
                    el.style.transitionDelay = '';
                }, 1300));
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        const elements = document.querySelectorAll(SELECTOR);
        elements.forEach((el) => {
            // Already on screen when the page appears? Leave it alone so it never flashes.
            if (el.getBoundingClientRect().top < viewportHeight * 0.9) return;

            // Stagger siblings: 1st card 0 ms, 2nd 100 ms, 3rd 200 ms ... (max 400 ms)
            const position = siblingCount.get(el.parentElement) || 0;
            siblingCount.set(el.parentElement, position + 1);
            el.style.transitionDelay = Math.min(position, 4) * 100 + 'ms';

            el.classList.add('reveal');
            const variant = variantFor(el);
            if (variant) el.classList.add(variant);
            observer.observe(el);
        });

        // Cleanup when leaving the page: stop watching and undo anything unfinished
        return () => {
            observer.disconnect();
            timers.forEach(clearTimeout);
            elements.forEach((el) => {
                el.classList.remove('reveal', 'is-visible', ...VARIANTS);
                el.style.transitionDelay = '';
            });
        };
    }, [pathname]);

    return null;
}
