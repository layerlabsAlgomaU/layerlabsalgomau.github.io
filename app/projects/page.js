import Link from 'next/link';
import PrintGallery from '@/components/PrintGallery';
import { PRODUCTS } from '@/data/products';
import { PRINTS } from '@/data/prints';

export const metadata = {
    title: 'Projects',
    description:
        'See what LayerLabs prints: flexi rexes, fidget toys, keychains and custom pieces for Algoma University departments and student clubs.',
};

export default function Projects() {
    return (
        <main id="main">
            {/* 1. Page intro */}
            <section className="page-intro">
                <h1>Our projects</h1>
                <p>Everything LayerLabs designs and prints, from desk toys to custom pieces for campus.</p>
            </section>

            {/* 2. What we print: the same product list as the Request a Print page */}
            <section className="what-we-print">
                <h2>What we print</h2>
                <p>Our starter collection. Pick any of these on the Request a Print page.</p>

                <div className="tiles">
                    {PRODUCTS.map((product) => (
                        <article key={product.id} className={'tile tile-' + product.tone}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                        </article>
                    ))}
                </div>

                <Link href="/request/#ready-made" prefetch={false}>Order these on the Request a Print page</Link>
            </section>

            {/* 3. Custom work */}
            <section className="custom-work">
                <h2>Custom work for campus</h2>
                <div className="panels">
                    <article className="panel">
                        <h3>Campus Solutions</h3>
                        <p>Custom pieces for campus departments like Student Life and the Wellness Hub, and for other
                            student clubs.</p>
                    </article>
                    <article className="panel">
                        <h3>Infrastructure Support</h3>
                        <p>Practical items that make campus spaces work better, like custom shelving and organizers.</p>
                    </article>
                </div>
            </section>

            {/* 4. Gallery: every photo in data/prints.js */}
            <section className="featured-prints">
                <h2>Print gallery</h2>
                <PrintGallery items={PRINTS} />
                <Link href="/request" prefetch={false}>Have an idea? Request a print</Link>
            </section>
        </main>
    );
}
