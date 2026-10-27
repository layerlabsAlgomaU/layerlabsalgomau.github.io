// The ready-made products people can pick on the Request a Print page.
// Edit this list to add, remove or rename products.
// tone = the colour of the card picture: 'cyan' (Algoma Red), 'pink' (Dark Blue) or 'lime' (Gold).
//        (The names are left over from an older colour scheme.)
// IMPORTANT: if you add or rename a product, change its name in the Google script too
// (ALLOWED_ITEMS in google-apps-script/request-endpoint.gs), or those requests will be refused.

import { EMAIL } from '@/lib/site';

export const PRODUCTS = [
    {
        id: 'flexi-rex',
        name: 'Flexi Rex',
        description: 'A bendy, articulated 3D-printed dinosaur that moves in your hands.',
        tone: 'cyan',
    },
    {
        id: 'fidget-toy',
        name: 'Fidget Toy',
        description: 'A tactile 3D-printed toy for desks, study breaks and stress relief.',
        tone: 'pink',
    },
    {
        id: 'keychain',
        name: 'Keychain',
        description: 'A custom 3D-printed keychain, great for clubs, events and giveaways.',
        tone: 'lime',
    },
];

export const MAX_QTY = 99;
export const CLUB_EMAIL = EMAIL; // the club email lives in lib/site.js

export function findProduct(id) {
    return PRODUCTS.find((p) => p.id === id);
}

// Keep a quantity between 1 and MAX_QTY (anything that is not a number becomes 1)
export function clampQty(value) {
    const n = parseInt(value, 10);
    if (isNaN(n) || n < 1) return 1;
    return Math.min(n, MAX_QTY);
}

export function itemsText(count) {
    return count + (count === 1 ? ' item' : ' items');
}
