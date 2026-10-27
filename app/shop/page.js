import Link from 'next/link';
import ShopRedirect from '@/components/ShopRedirect';

// The shop and "Request a print" are now one page. This tiny page keeps old /shop links working:
// it sends the visitor to the ready-made items on the Request a Print page.
export const metadata = {
    title: 'Shop has moved',
    description: 'The LayerLabs shop is now part of the Request a Print page.',
    robots: { index: false }, // search engines should list the new page, not this one
};

export default function ShopPage() {
    return (
        <main id="main">
            <ShopRedirect />
            <section className="page-intro">
                <h1>The shop has moved</h1>
                <p>Ready-made items and custom requests are now on one page.</p>
                <Link href="/request/#ready-made" prefetch={false} className="btn btn-primary">Go to Request a Print</Link>
            </section>
        </main>
    );
}
