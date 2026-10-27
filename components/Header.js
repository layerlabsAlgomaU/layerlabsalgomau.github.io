'use client';

// The site header: logo + name, the menu, a "Join LayerLabs" button and (on the Request page)
// the cart button. Below 1140px the menu moves into a slide-down panel with a Menu button.
//
// Keyboard and screen readers:
//   - the menu is a labelled navigation ("Main" / "Mobile")
//   - the Menu button says whether it is open (aria-expanded) and what it controls
//   - while the panel is open the page behind it cannot be reached, Tab stays in the header
//     and the panel, Esc closes it and focus goes back to the Menu button
//   - nothing moves for visitors who asked for reduced motion (see globals.css)

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoLink from '@/components/LogoLink';
import { useCart } from '@/components/CartContext';
import { itemsText } from '@/data/products';
import { NAV_LINKS as LINKS, JOIN_FORM_URL, SOCIALS } from '@/lib/site'; // the menu lives in lib/site.js

export default function Header() {
    // usePathname() gives the current address, like "/about/". We remove the trailing slash.
    const pathname = usePathname().replace(/\/$/, '') || '/';
    const { count, pulse, openDrawer, open: cartOpen } = useCart();

    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const headerRef = useRef(null);
    const buttonRef = useRef(null);
    const panelRef = useRef(null);
    const returnFocus = useRef(false); // should focus go back to the Menu button after closing?

    // The header gets a soft shadow once the page has scrolled a little
    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 24);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Going to another page closes the menu
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // If the window becomes wide enough for the normal menu, close the panel
    useEffect(() => {
        const wide = window.matchMedia('(min-width: 1140px)');
        function onChange(event) {
            if (event.matches) setMenuOpen(false);
        }
        wide.addEventListener('change', onChange);
        return () => wide.removeEventListener('change', onChange);
    }, []);

    // While the panel is open: the page behind it is switched off and cannot scroll.
    useEffect(() => {
        const parts = document.querySelectorAll('main, footer');
        parts.forEach((part) => { part.inert = menuOpen; });
        document.body.classList.toggle('no-scroll', menuOpen);

        if (menuOpen) {
            panelRef.current?.querySelector('a')?.focus();
        } else if (returnFocus.current) {
            returnFocus.current = false;
            buttonRef.current?.focus();
        }

        return () => {
            parts.forEach((part) => { part.inert = false; });
            document.body.classList.remove('no-scroll');
        };
    }, [menuOpen]);

    // Esc closes the panel. Tab stays inside the header and the panel ("focus trap").
    useEffect(() => {
        if (!menuOpen) return;

        function onKeyDown(event) {
            if (event.key === 'Escape') {
                returnFocus.current = true;
                setMenuOpen(false);
                return;
            }
            if (event.key !== 'Tab') return;

            const all = [
                ...headerRef.current.querySelectorAll('a[href], button:not([disabled])'),
                ...panelRef.current.querySelectorAll('a[href], button:not([disabled])'),
            ].filter((el) => el.offsetParent !== null); // skip anything that is not on screen
            const first = all[0];
            const last = all[all.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [menuOpen]);

    function toggleMenu() {
        if (menuOpen) returnFocus.current = true;
        setMenuOpen(!menuOpen);
    }

    function openCart() {
        setMenuOpen(false);
        openDrawer();
    }

    return (
        <>
            <header ref={headerRef} className={scrolled ? 'is-scrolled' : undefined}>
                <div className="header-bar">
                    {/* 1. Logo + name. The name is a mouse-only extra: the logo link already says "LayerLabs home". */}
                    <div className="brand">
                        <LogoLink />
                        <Link href="/" prefetch={false} className="brand-name" tabIndex={-1} aria-hidden="true">LayerLabs</Link>
                    </div>

                    {/* 2. The menu (wide screens) */}
                    <nav className="site-nav" aria-label="Main">
                        <ul>
                            {LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        prefetch={false} /* no background loading: the site is tiny */
                                        aria-current={pathname === link.href ? 'page' : undefined}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* 3. Join button, cart button (Request page) and the Menu button (small screens) */}
                    <div className="header-actions">
                        <a href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary header-join"
                            aria-label="Join LayerLabs (opens in new tab)">Join LayerLabs</a>

                        {pathname === '/request' && (
                            <button
                                type="button"
                                className="cart-toggle"
                                id="cart-toggle"
                                aria-haspopup="dialog"
                                aria-controls="cart-drawer"
                                aria-expanded={cartOpen}
                                aria-label={'Open cart, ' + itemsText(count)}
                                onClick={openCart}
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="8" cy="21" r="1" />
                                    <circle cx="19" cy="21" r="1" />
                                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                                </svg>
                                <span className="cart-label" aria-hidden="true">Cart</span>
                                {/* key={pulse}: a new key makes React replace the badge, which replays the "pop" */}
                                <span key={pulse} className={'cart-badge' + (pulse > 0 ? ' pop' : '')} id="cart-count" aria-hidden="true">
                                    {count}
                                </span>
                            </button>
                        )}

                        <button
                            type="button"
                            className="menu-toggle"
                            ref={buttonRef}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-menu"
                            onClick={toggleMenu}
                        >
                            <span className="menu-bars" aria-hidden="true"><span></span><span></span><span></span></span>
                            {/* the name stays "Menu": aria-expanded already tells screen readers if it is open */}
                            <span className="menu-label">Menu</span>
                        </button>
                    </div>
                </div>

                {/* Print progress: a coloured line that fills as you scroll (see ScrollEffects.js) */}
                <div className="print-progress" aria-hidden="true"></div>
            </header>

            {/* The slide-down menu for small screens. It sits OUTSIDE the header on purpose: the header's
                blurred background would otherwise trap a fixed panel inside the header's box. */}
            <div
                id="mobile-menu"
                ref={panelRef}
                className={'mobile-menu' + (menuOpen ? ' is-open' : '')}
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                inert={!menuOpen}
            >
                <nav aria-label="Mobile">
                    <ul>
                        {LINKS.map((link, index) => (
                            <li key={link.href} style={{ '--i': index }}>
                                <Link
                                    href={link.href}
                                    prefetch={false}
                                    aria-current={pathname === link.href ? 'page' : undefined}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <a href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary"
                    aria-label="Join LayerLabs (opens in new tab)" onClick={() => setMenuOpen(false)}>Join LayerLabs</a>

                <ul className="mobile-social" aria-label="Social media">
                    {SOCIALS.map((social) => (
                        <li key={social.label}>
                            <a href={social.href} target="_blank" rel="noopener noreferrer"
                                aria-label={social.label + ' (opens in new tab)'}>{social.label}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
