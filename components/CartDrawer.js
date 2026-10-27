'use client';

import { useEffect, useRef } from 'react';
import { MAX_QTY, findProduct, itemsText } from '@/data/products';
import { useCart } from '@/components/CartContext';

// The cart panel that slides in from the right.
// Keyboard: Esc closes it, Tab stays inside it, and focus goes back to the Cart button.
export default function CartDrawer() {
    const { items, count, open, changeQty, removeItem, closeDrawer } = useCart();

    const drawerRef = useRef(null);
    const closeRef = useRef(null);
    const titleRef = useRef(null);

    // When the drawer opens, put focus on its Close button
    useEffect(() => {
        if (open) closeRef.current.focus();
    }, [open]);

    // Esc closes the drawer. Tab is kept inside the drawer ("focus trap").
    useEffect(() => {
        if (!open) return;

        function onKeyDown(event) {
            if (event.key === 'Escape') {
                closeDrawer(true);
                return;
            }

            if (event.key === 'Tab') {
                const focusable = drawerRef.current.querySelectorAll('button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])');
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, closeDrawer]);

    // A disabled button cannot keep focus, so hand it to the button's partner
    function keepFocus(id, action) {
        setTimeout(() => {
            const item = document.querySelector('.cart-item[data-id="' + id + '"]');
            if (item) item.querySelector('[data-action="' + action + '"]')?.focus();
        }, 0);
    }

    function decrease(item) {
        changeQty(item.id, -1);
        if (item.qty - 1 <= 1) keepFocus(item.id, 'inc');
    }

    function increase(item) {
        changeQty(item.id, 1);
        if (item.qty + 1 >= MAX_QTY) keepFocus(item.id, 'dec');
    }

    function remove(item) {
        removeItem(item.id);
        titleRef.current.focus(); // the button we clicked is about to disappear, so park focus on the title
    }

    // "Checkout" closes the drawer and takes the visitor to the form
    function checkout() {
        closeDrawer(false);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setTimeout(() => {
            document.getElementById('checkout')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
            document.getElementById('delivery-date')?.focus({ preventScroll: true });
        }, 60); // wait a moment so the page behind the drawer is clickable again
    }

    return (
        <>
            <div className={'drawer-overlay' + (open ? ' is-open' : '')} id="drawer-overlay"
                onClick={() => closeDrawer(true)}></div>

            <div className={'drawer' + (open ? ' is-open' : '')} id="cart-drawer" ref={drawerRef}
                role="dialog" aria-modal="true" aria-labelledby="cart-title" inert={!open}>
                <div className="drawer-head">
                    <h2 id="cart-title" tabIndex={-1} ref={titleRef}>Your cart</h2>
                    <button type="button" className="icon-btn" id="cart-close" ref={closeRef}
                        aria-label="Close cart" onClick={() => closeDrawer(true)}>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 5l14 14M19 5L5 19" />
                        </svg>
                    </button>
                </div>

                {items.length === 0 ? (
                    <p className="drawer-empty" id="cart-empty">Your cart is empty. Add a product to get started.</p>
                ) : (
                    <ul className="cart-list" id="cart-list">
                        {items.map((item) => {
                            const product = findProduct(item.id);
                            return (
                                <li className="cart-item" key={item.id} data-id={item.id}>
                                    <span className="cart-item-name">{product.name}</span>
                                    <div className="cart-item-controls">
                                        <div className="qty" role="group" aria-label={'Quantity for ' + product.name}>
                                            <button type="button" className="qty-btn" data-action="dec"
                                                aria-label={'Decrease quantity of ' + product.name}
                                                disabled={item.qty <= 1} onClick={() => decrease(item)}>&minus;</button>
                                            <span className="qty-value">{item.qty}</span>
                                            <button type="button" className="qty-btn" data-action="inc"
                                                aria-label={'Increase quantity of ' + product.name}
                                                disabled={item.qty >= MAX_QTY} onClick={() => increase(item)}>+</button>
                                        </div>
                                        <button type="button" className="link-btn" data-action="remove"
                                            aria-label={'Remove ' + product.name + ' from cart'}
                                            onClick={() => remove(item)}>Remove</button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <div className="drawer-foot">
                    <p className="cart-count-text" id="cart-summary-text">{itemsText(count) + ' in your cart'}</p>
                    <button type="button" className="btn btn-primary" id="cart-checkout"
                        disabled={items.length === 0} onClick={checkout}>Checkout</button>
                    <p className="note">No payment here. Next, you choose a delivery date and request a quote.</p>
                </div>
            </div>
        </>
    );
}
