'use client';

import { useEffect, useRef } from 'react';

// The live printer (home page hero, and the "page not built yet" page).
// It is pure decoration, so the SVG is hidden from screen readers. The movement is CSS
// (see "Live printer" in globals.css) and it loops forever. It only stands still for
// visitors whose device is set to "reduce motion". This component adds:
//   - a gentle tilt toward the mouse pointer
//   - a "frozen" mode: the printer stands still halfway through a print (404 page)
export default function HeroPrinter({ frozen = false }) {
    const art = useRef(null);

    // Tilt toward the pointer, a few degrees at most. Skipped for touch screens and
    // for visitors who asked for reduced motion.
    useEffect(() => {
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (frozen || !canHover || reduced || !art.current) return;

        const el = art.current;
        const area = el.closest('section') || document.body; // listen over the whole hero
        const MAX = 5; // degrees
        let waiting = false;
        let nextX = 0;
        let nextY = 0;

        function apply() {
            el.style.setProperty('--ry', nextX * MAX + 'deg');
            el.style.setProperty('--rx', -nextY * MAX + 'deg');
            waiting = false;
        }

        function onMove(event) {
            const box = el.getBoundingClientRect();
            // -1 ... 1 across the printer, kept inside that range
            nextX = Math.max(-1, Math.min(1, (event.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2)));
            nextY = Math.max(-1, Math.min(1, (event.clientY - (box.top + box.height / 2)) / (window.innerHeight / 2)));
            if (!waiting) {
                waiting = true;
                requestAnimationFrame(apply);
            }
        }

        function onLeave() {
            nextX = 0;
            nextY = 0;
            requestAnimationFrame(apply);
        }

        area.addEventListener('pointermove', onMove);
        area.addEventListener('pointerleave', onLeave);
        return () => {
            area.removeEventListener('pointermove', onMove);
            area.removeEventListener('pointerleave', onLeave);
        };
    }, [frozen]);

    const classes = 'hero-art' + (frozen ? ' is-frozen' : '');

    return (
        <div className={classes} id={frozen ? undefined : 'hero-art'} ref={art}>
            <div className="printer-panel">
            <svg className="printer" viewBox="0 0 400 340" aria-hidden="true" focusable="false">
                {/* frame */}
                <rect className="p-frame" x="22" y="24" width="356" height="10" rx="5" />
                <rect className="p-frame" x="22" y="24" width="8" height="302" rx="4" />
                <rect className="p-frame" x="370" y="24" width="8" height="302" rx="4" />
                {/* build plate */}
                <rect className="p-plate" x="36" y="312" width="328" height="14" rx="4" />
                <rect className="p-foot" x="64" y="326" width="272" height="6" rx="3" />
                {/* the object being printed, one bar per layer */}
                <rect className="p-bar p-bar-0" x="102" y="292" width="196" height="20" rx="3" />
                <rect className="p-bar p-bar-1" x="96" y="268" width="208" height="20" rx="3" />
                <rect className="p-bar p-bar-2" x="91" y="244" width="218" height="20" rx="3" />
                <rect className="p-bar p-bar-3" x="88" y="220" width="224" height="20" rx="3" />
                <rect className="p-bar p-bar-4" x="91" y="196" width="218" height="20" rx="3" />
                <rect className="p-bar p-bar-5" x="98" y="172" width="204" height="20" rx="3" />
                <rect className="p-bar p-bar-6 p-bar-top" x="111" y="148" width="178" height="20" rx="3" />
                {/* gantry beam rises one layer at a time; the print head slides along it */}
                <g className="p-z">
                    <rect className="p-beam" x="22" y="248" width="356" height="8" rx="4" />
                    <g transform="translate(200 0)">
                        <g className="p-x">
                            {/* filament coming down from above (it is clipped by the edge of the drawing) */}
                            <line className="p-filament" x1="0" y1="256" x2="0" y2="-260" />
                            <rect className="p-carriage" x="-16" y="256" width="32" height="20" rx="4" />
                            <rect className="p-block" x="-8" y="276" width="16" height="8" rx="2" />
                            <circle className="p-glow" cx="0" cy="290" r="11" />
                            <polygon className="p-nozzle" points="-6,284 6,284 0,292" />
                        </g>
                    </g>
                </g>
            </svg>
            </div>
        </div>
    );
}
