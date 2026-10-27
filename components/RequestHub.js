'use client';

// The whole "Request a print" page. The visitor first chooses a path:
//   - ready-made items (product cards + cart), or
//   - something custom (the 5-step project process),
// and both paths end at the same request form. The cart drawer sits next to <main> (not inside
// it) so the rest of the page can be switched off while the drawer is open.

import { useEffect, useState } from 'react';
import { PRODUCTS } from '@/data/products';
import { PROJECT_STEPS } from '@/data/process';
import ProductCard from '@/components/ProductCard';
import RequestForm from '@/components/RequestForm';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/components/CartContext';

// The page address can name a path: /request/#ready-made or /request/#custom
const HASHES = { items: '#ready-made', custom: '#custom' };

export default function RequestHub() {
    const { items } = useCart();
    const [path, setPath] = useState(null); // null = nothing chosen yet, 'items' or 'custom'

    // Open the path named in the address (links from other pages use this)
    useEffect(() => {
        function fromHash() {
            const hash = window.location.hash;
            const found = Object.keys(HASHES).find((key) => HASHES[key] === hash);
            if (!found) return;
            setPath(found);
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            setTimeout(() => {
                document.getElementById('path-content')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
            }, 50);
        }
        fromHash();
        window.addEventListener('hashchange', fromHash);
        return () => window.removeEventListener('hashchange', fromHash);
    }, []);

    // A cart saved from an earlier visit means the visitor was ordering ready-made items
    useEffect(() => {
        if (items.length > 0) setPath((current) => current || 'items');
    }, [items.length]);

    function choose(key) {
        setPath(key);
        window.history.replaceState(null, '', HASHES[key]);
    }

    return (
        <>
            <main id="main">
                {/* 1. Page intro */}
                <section className="page-intro">
                    <h1>Request a print</h1>
                    <p>Pick from our ready-made items or tell us about something custom. Open to Algoma University
                        departments and student clubs. There is no payment on this page: we reply by email.</p>
                </section>

                {/* 2. Choose a path */}
                <section className="start-here">
                    <h2>How do you want to start?</h2>
                    <div className="path-choices">
                        <button type="button" className="path-card" aria-pressed={path === 'items'}
                            aria-controls="path-content" onClick={() => choose('items')}>
                            <span className="path-card-title">Ready-made items</span>
                            <span>Pick a Flexi Rex, fidget toy or keychain, choose a quantity and add it to your cart.</span>
                        </button>
                        <button type="button" className="path-card" aria-pressed={path === 'custom'}
                            aria-controls="path-content" onClick={() => choose('custom')}>
                            <span className="path-card-title">Something custom</span>
                            <span>Tell us your idea and we will design and print it with you, from first meeting to delivery.</span>
                        </button>
                    </div>
                </section>

                {/* 3. The chosen path */}
                <div id="path-content">
                    {path === 'items' && (
                        <section className="shop-products" id="products">
                            <h2>Choose your products</h2>
                            <div className="products" id="product-grid">
                                {PRODUCTS.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        </section>
                    )}

                    {path === 'custom' && (
                        <section className="how-it-works" id="how-it-works">
                            <h2>How a project works</h2>
                            <ol className="steps">
                                {PROJECT_STEPS.map((step) => (
                                    <li key={step.title}>
                                        <h3>{step.title}</h3>
                                        <p>{step.text}</p>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}
                </div>

                {/* 4. One request form for both paths */}
                <RequestForm />
            </main>

            <CartDrawer />
        </>
    );
}
