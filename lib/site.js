// Facts that appear on more than one page live here, so each one is changed in ONE place.

// The public Google Form for joining (never use the form's "edit" link here)
export const JOIN_FORM_URL = 'https://docs.google.com/forms/d/16GvTESHtiL0DlQFBW8W9JAFpf2IqhuyltC2WRnRSQlQ/viewform';

export const EMAIL = 'layerlabs@algomau.ca';

// Where the Request a Print form sends its data: the web app address of the club's Google Apps Script
// (see google-apps-script/SETUP.md in the project folder; it ends in /exec).
// Leave it as '' until that is set up: the form then falls back to "open the visitor's email app".
// This is a write-only address, never the Google Sheet itself.
export const REQUEST_ENDPOINT = '';

// Social accounts, shown in the footer and on the Contact page.
// LinkedIn is not ready yet: add { label: 'LinkedIn', handle: '...', href: '...' } here when it is.
export const SOCIALS = [
    { label: 'Instagram', handle: '@layerlabsalgomau', href: 'https://www.instagram.com/layerlabsalgomau/' },
    { label: 'GitHub', handle: 'LayerLabsAlgomaU', href: 'https://github.com/LayerLabsAlgomaU' },
];

// The menu. Used by the header and the footer.
export const NAV_LINKS = [
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/request', label: 'Request a Print' },
    { href: '/events', label: 'Partners & Events' },
    { href: '/members', label: 'Members' },
    { href: '/contact', label: 'Contact' },
];

// Where the site lives: the club's GitHub Pages address (repository "layerlabsalgomau.github.io").
// The sitemap and the share-preview addresses are built from it. If the address ever changes (for example a
// university address like layerlabs.algomau.ca), change it here, or set NEXT_PUBLIC_SITE_URL when building.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://layerlabsalgomau.github.io';
