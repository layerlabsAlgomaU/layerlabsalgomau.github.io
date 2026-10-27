'use client';

// The cart lives here, in one place, so every component sees the same cart:
// the number in the header, the drawer, and the quote form.
//
// Pieces of state:
//   items  - the cart: a list of { id, qty }, saved in localStorage
//   open   - is the cart drawer open?
//   pulse  - goes up by 1 each time something is added (the header badge "pops")
//   status - the message announced to screen readers

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { MAX_QTY, findProduct, itemsText } from '@/data/products';

const STORAGE_KEY = 'layerlabs-cart';
const CartContext = createContext(null);

export function useCart() {
    return useContext(CartContext);
}

// Read the cart from localStorage. If anything is missing or broken, start empty.
function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!Array.isArray(saved)) return [];
        return saved
            .filter((item) => item && findProduct(item.id) && Number.isInteger(item.qty) && item.qty >= 1)
            .map((item) => ({ id: item.id, qty: Math.min(item.qty, MAX_QTY) }));
    } catch (error) {
        return []; // localStorage can be blocked (private window, etc.). The site still works.
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [loaded, setLoaded] = useState(false); // true once we have read localStorage
    const [open, setOpen] = useState(false);
    const [pulse, setPulse] = useState(0);
    const [status, setStatus] = useState('');
    const lastFocused = useRef(null); // what had focus before the drawer opened
    const returnFocus = useRef(false); // should focus go back there once the drawer has closed?

    // Load the saved cart once, after the page has appeared in the browser
    useEffect(() => {
        setItems(loadCart());
        setLoaded(true);
    }, []);

    // Save every change (but not before we have loaded, or we would wipe the saved cart)
    useEffect(() => {
        if (!loaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            // Can't save? The cart still works until the page is closed.
        }
    }, [items, loaded]);

    // While the drawer is open: nothing behind it can be reached, and the page cannot scroll
    useEffect(() => {
        const parts = document.querySelectorAll('header, main, footer');
        parts.forEach((part) => { part.inert = open; });
        document.body.classList.toggle('no-scroll', open);

        // Give focus back only now: while the page was still inert it could not take focus
        if (!open && returnFocus.current) {
            returnFocus.current = false;
            if (lastFocused.current) lastFocused.current.focus();
        }

        return () => {
            parts.forEach((part) => { part.inert = false; });
            document.body.classList.remove('no-scroll');
        };
    }, [open]);

    // Write a message into the hidden live region (clear first so repeats are announced)
    const announce = useCallback((message) => {
        setStatus('');
        setTimeout(() => setStatus(message), 50);
    }, []);

    const count = items.reduce((sum, item) => sum + item.qty, 0);

    // popDelay = milliseconds to wait before the header badge "pops" (the flying piece takes time)
    function addItem(id, qty, popDelay = 0) {
        const product = findProduct(id);
        const existing = items.find((item) => item.id === id);
        const newItems = existing
            ? items.map((item) => (item.id === id ? { ...item, qty: Math.min(item.qty + qty, MAX_QTY) } : item))
            : [...items, { id, qty: Math.min(qty, MAX_QTY) }];

        setItems(newItems);
        setTimeout(() => setPulse((p) => p + 1), popDelay);
        const newCount = newItems.reduce((sum, item) => sum + item.qty, 0);
        announce('Added ' + qty + ' × ' + product.name + ' to cart. Cart has ' + itemsText(newCount) + '.');
    }

    // change = +1 or -1
    function changeQty(id, change) {
        const product = findProduct(id);
        const current = items.find((item) => item.id === id);
        if (!current) return;
        const qty = Math.min(Math.max(current.qty + change, 1), MAX_QTY);
        setItems(items.map((item) => (item.id === id ? { ...item, qty } : item)));
        announce(product.name + ': quantity ' + qty + '.');
    }

    function removeItem(id) {
        const product = findProduct(id);
        const newItems = items.filter((item) => item.id !== id);
        setItems(newItems);
        const newCount = newItems.reduce((sum, item) => sum + item.qty, 0);
        announce(product.name + ' removed from cart. Cart has ' + itemsText(newCount) + '.');
    }

    // Empty the cart (used after a request has been sent)
    function clearCart() {
        setItems([]);
        announce('Cart is empty.');
    }

    function openDrawer() {
        lastFocused.current = document.activeElement;
        setOpen(true);
    }

    function closeDrawer(shouldReturnFocus) {
        returnFocus.current = shouldReturnFocus;
        setOpen(false);
    }

    const value = { items, count, open, pulse, addItem, changeQty, removeItem, clearCart, openDrawer, closeDrawer };

    return (
        <CartContext.Provider value={value}>
            {children}
            {/* Screen-reader announcements ("Added 2 x Keychain to cart") */}
            <p className="sr-only" id="cart-status" role="status" aria-live="polite">{status}</p>
        </CartContext.Provider>
    );
}
