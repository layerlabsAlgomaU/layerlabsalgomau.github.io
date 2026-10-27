import Link from 'next/link';
import HeroPrinter from '@/components/HeroPrinter';

export const metadata = {
    title: 'Page not found',
    description: 'This page of the LayerLabs website does not exist.',
};

// Shown for any address that does not exist. In the exported site this becomes out/404.html.
export default function NotFound() {
    return (
        <main id="main">
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-text">
                        <h1>We can&rsquo;t find that page.</h1>
                        <p>The address may be wrong or the page may have moved. Go back to the home page, or request a print.</p>
                        <div className="hero-actions">
                            <Link href="/" prefetch={false} className="btn btn-primary">Go to the home page</Link>
                            <Link href="/request" prefetch={false} className="btn btn-secondary">Request a print</Link>
                        </div>
                    </div>

                    {/* the printer stands still, a few layers into a print */}
                    <HeroPrinter frozen />
                </div>
            </section>
        </main>
    );
}
