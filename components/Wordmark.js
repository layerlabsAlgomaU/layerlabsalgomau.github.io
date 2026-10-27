'use client';

// The big "LayerLabs" name in the footer, as a toy. The stripes are the layer lines of a 3D print.
//   - move the pointer over the name: the letters near the pointer lift a little and their layer
//     lines get finer (like a smoother print). Letters further away relax, so a soft wave follows
//     the pointer. Leave and everything settles.
//   - the first time it scrolls into view a gentle wave runs across the letters once
//   - click or tap: the wave runs again (this is the touch version, since touch has no hover)
// It is decoration only (aria-hidden), so nothing here is needed to use the site.
// For visitors who asked for reduced motion nothing runs and it stays still.
//
// How it works: this file only sets one CSS variable on each letter, --s (0 to 1).
// The lift, the finer lines and the smooth easing are all CSS (see ".wm-letter" in globals.css).

import { useEffect, useRef } from 'react';

const FIRST = 'Layer'.split('');
const SECOND = 'Labs'.split('');

export default function Wordmark() {
    const box = useRef(null);

    useEffect(() => {
        const el = box.current;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const letters = Array.from(el.querySelectorAll('.wm-letter'));
        let timers = [];

        function setStrength(index, value) {
            letters[index].style.setProperty('--s', value.toFixed(3));
        }

        function relaxAll() {
            letters.forEach((_, i) => setStrength(i, 0));
        }

        // Pointer: each letter reacts according to how close the pointer is to it
        function onMove(event) {
            if (event.pointerType === 'touch') return; // a finger is for scrolling
            letters.forEach((letter, i) => {
                const rect = letter.getBoundingClientRect();
                const distance = Math.abs(event.clientX - (rect.left + rect.width / 2)) / rect.width; // 0 = right on the letter
                setStrength(i, Math.min(Math.max(1 - distance / 1.6, 0), 1));
            });
        }

        function onLeave(event) {
            if (event.pointerType === 'touch') return; // lifting a finger must not cancel a tap's wave
            relaxAll();
        }

        // A wave: each letter lifts a moment after the one before it, then relaxes
        function wave() {
            timers.forEach(clearTimeout);
            timers = [];
            letters.forEach((_, i) => {
                timers.push(setTimeout(() => setStrength(i, 1), i * 90));
                timers.push(setTimeout(() => setStrength(i, 0), i * 90 + 420));
            });
        }

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        el.addEventListener('click', wave);

        // the first time it is mostly on screen, run the wave once so visitors see it reacts
        let observer = null;
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    wave();
                    observer.disconnect();
                }
            }, { threshold: 0.6 });
            observer.observe(el);
        }

        return () => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
            el.removeEventListener('click', wave);
            if (observer) observer.disconnect();
            timers.forEach(clearTimeout);
        };
    }, []);

    // Each letter is its own element so it can move on its own. The whole thing is hidden from screen readers.
    return (
        <div className="wordmark-wrap" ref={box} aria-hidden="true">
            <div className="wordmark">
                {FIRST.map((letter, i) => <span className="wm-letter" key={'a' + i}>{letter}</span>)}
                <span className="wm-labs">
                    {SECOND.map((letter, i) => <span className="wm-letter" key={'b' + i}>{letter}</span>)}
                </span>
            </div>
        </div>
    );
}
