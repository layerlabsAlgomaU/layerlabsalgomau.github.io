import Link from 'next/link';
import EventCard from '@/components/EventCard';
import JoinBanner from '@/components/JoinBanner';
import { EVENTS } from '@/data/events';

export const metadata = {
    title: 'Partners & Events',
    description:
        'LayerLabs events and campus partners at Algoma University, including ThunderHacks II, Student Life and the Wellness Hub.',
};

export default function Events() {
    return (
        <main id="main">
            {/* 1. Page intro */}
            <section className="page-intro">
                <h1>Partners &amp; events</h1>
                <p>Who we work with and where you can find us.</p>
            </section>

            {/* 2. Events and news (from data/events.js) */}
            <section className="news">
                <h2>Events and news</h2>
                {EVENTS.map((event) => <EventCard key={event.id} event={event} />)}
            </section>

            {/* 3. Campus partners */}
            <section className="our-partners">
                <h2>Campus partners</h2>
                <p>We build real projects with groups across Algoma University.</p>
                <div className="panels">
                    <article className="panel">
                        <h3>Student Life</h3>
                        <p>Custom pieces and support for Student Life programs and events.</p>
                    </article>
                    <article className="panel">
                        <h3>Wellness Hub</h3>
                        <p>Practical, hands-on items that support the Wellness Hub and the students who use it.</p>
                    </article>
                </div>
                <Link href="/request" prefetch={false}>Want to work with us? Request a print</Link>
            </section>

            {/* 4. Join band */}
            <JoinBanner
                title="Come build with us"
                text="Open to all students. No experience needed. We&rsquo;ll train you." />
        </main>
    );
}
