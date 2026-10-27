'use client';

import { useEffect, useState } from 'react';
import { MAX_QTY, clampQty } from '@/data/products';
import { useCart } from '@/components/CartContext';
import { flyToCart } from '@/lib/flyToCart';

// One product: picture, name, description, quantity stepper and "Add to cart".
export default function ProductCard({ product, index }) {
    const { addItem } = useCart();

    // The quantity is kept as text so the box can be emptied while typing
    const [qty, setQty] = useState('1');
    const [justAdded, setJustAdded] = useState(false);

    // Show "Added" on the button for a moment, then go back to "Add to cart"
    useEffect(() => {
        if (!justAdded) return;
        const timer = setTimeout(() => setJustAdded(false), 1200);
        return () => clearTimeout(timer);
    }, [justAdded]);

    function step(change) {
        setQty(String(clampQty(clampQty(qty) + change)));
    }

    function add(event) {
        const flightTime = flyToCart(event.currentTarget); // 0 when motion is reduced
        addItem(product.id, clampQty(qty), flightTime);
        setQty('1');
        setJustAdded(true);
    }

    return (
        <article className="card product-card" style={{ '--i': index }}>
            <div className={'product-visual tone-' + product.tone} aria-hidden="true">
                {/* a filament spool: rings of wound filament around a hub, with a loose end */}
                <svg className="spool" viewBox="0 0 160 160" focusable="false">
                    <circle cx="80" cy="80" r="70" />
                    <circle cx="80" cy="80" r="59" />
                    <circle cx="80" cy="80" r="48" />
                    <circle cx="80" cy="80" r="37" />
                    <circle className="spool-hub" cx="80" cy="80" r="26" />
                    <circle className="spool-hole" cx="80" cy="80" r="9" />
                    <path d="M150 80 C 156 100, 150 124, 128 140" />
                </svg>
            </div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="product-actions">
                <div className="qty" role="group" aria-label={'Quantity for ' + product.name}>
                    <button type="button" className="qty-btn" data-step="-1"
                        aria-label={'Decrease quantity of ' + product.name} onClick={() => step(-1)}>&minus;</button>
                    <input type="number" className="qty-input" min="1" max={MAX_QTY} inputMode="numeric"
                        aria-label={'Quantity of ' + product.name} value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        onBlur={() => setQty(String(clampQty(qty)))} />
                    <button type="button" className="qty-btn" data-step="1"
                        aria-label={'Increase quantity of ' + product.name} onClick={() => step(1)}>+</button>
                </div>
                <button type="button" className="btn btn-primary add-btn" data-id={product.id} onClick={add}>
                    {justAdded ? 'Added' : 'Add to cart'}
                </button>
            </div>
        </article>
    );
}
