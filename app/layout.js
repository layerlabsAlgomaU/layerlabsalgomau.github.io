import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollEffects from '@/components/ScrollEffects';
import { SITE_URL } from '@/lib/site';

// Fonts. next/font downloads them at build time and serves them from our own site,
// so visitors never contact Google.
//   Bricolage Grotesque: headlines. A variable font: we use its heavy weight and its
//                        narrow width (see "font-stretch" in globals.css).
//   Instrument Sans:     body text, buttons, forms.
const display = Bricolage_Grotesque({
    subsets: ['latin'],
    axes: ['wdth', 'opsz'],
    variable: '--font-display',
    display: 'swap',
});

const body = Instrument_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-body',
    display: 'swap',
});

// Page title and description. Each page can set its own "title" (see app/about/page.js)
// and the template adds the club name after it.
const SHARE_IMAGE = '/video/layerlabs-film-poster.jpg';

export const metadata = {
    // Turns the relative addresses below into full ones (needed for share previews)
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'LayerLabs | 3D Printing Club at Algoma University',
        template: '%s | LayerLabs at Algoma University',
    },
    description:
        "LayerLabs is Algoma University's student-run 3D printing and design club. Learn technical and business skills while working on real projects.",

    // What shows when the link is shared in a chat or on social media
    openGraph: {
        siteName: 'LayerLabs',
        title: 'LayerLabs | 3D Printing Club at Algoma University',
        description: 'Learn 3D printing. Build real projects. Work with real clients.',
        type: 'website',
        locale: 'en_CA',
        images: [SHARE_IMAGE],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LayerLabs | 3D Printing Club at Algoma University',
        description: 'Learn 3D printing. Build real projects. Work with real clients.',
        images: [SHARE_IMAGE],
    },
};

export const viewport = {
    themeColor: '#FFFFFF', // the page colour (browser toolbar on phones)
};

export default function RootLayout({ children }) {
    return (
        // suppressHydrationWarning: the small script below adds the "js" class before React starts
        <html lang="en" className={display.variable + ' ' + body.variable} suppressHydrationWarning>
            <head>
                {/* Lets the CSS know JavaScript is available (scroll-reveal hides things only with JS) */}
                <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
            </head>
            <body>
                <a className="skip-link" href="#main">Skip to main content</a>

                <CartProvider>
                    <Header />
                    {children}
                    <Footer />
                </CartProvider>

                <ScrollEffects />
            </body>
        </html>
    );
}
