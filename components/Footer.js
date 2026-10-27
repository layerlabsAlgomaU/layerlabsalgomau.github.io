import Link from 'next/link';
import Wordmark from '@/components/Wordmark';
import { EMAIL, SOCIALS, NAV_LINKS } from '@/lib/site';

// Shown on every page (it is added once, in app/layout.js).
// This is a "server component" (no JavaScript in the browser) except for the interactive name, which is a small client component.

export default function Footer() {
    return (
        <footer>
            {/* Three columns: contact, pages, social accounts (they stack on phones) */}
            <div className="footer-inner">
                <div className="footer-col">
                    <p className="footer-title">Contact</p>
                    <p><a href={'mailto:' + EMAIL}>{EMAIL}</a></p>
                </div>

                <div className="footer-col">
                    <p className="footer-title">Pages</p>
                    <ul className="footer-links footer-links-2col">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} prefetch={false}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* The social accounts come from lib/site.js */}
                <div className="footer-col">
                    <p className="footer-title">Follow us</p>
                    <ul className="footer-links">
                        {SOCIALS.map((social) => (
                            <li key={social.label}>
                                <a href={social.href} target="_blank" rel="noopener noreferrer"
                                    aria-label={social.label + ' (opens in new tab)'}>{social.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* The club name, "sliced" into layer lines, and interactive (see components/Wordmark.js). Decoration only, so screen readers skip it. */}
            <Wordmark />

            <p className="footer-small">&copy; {new Date().getFullYear()} LayerLabs at Algoma University</p>
        </footer>
    );
}
