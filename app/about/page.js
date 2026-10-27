import Link from 'next/link';
import JoinBanner from '@/components/JoinBanner';
import { TEAM } from '@/data/team';

// This page's own title and description (the title becomes "About | LayerLabs at Algoma University")
export const metadata = {
    title: 'About',
    description:
        "Learn about LayerLabs, Algoma University's student-run 3D printing club: our mission, services, what you'll learn and our team.",
};

export default function About() {
    return (
        <main id="main">
            {/* 1. Page intro */}
            <section className="page-intro">
                <h1>About LayerLabs</h1>
                <p>Algoma University&rsquo;s student-run 3D printing, fabrication and consultancy club.</p>
            </section>

            {/* 2. Mission: the first sentence is set as a big statement */}
            <section className="our-mission">
                <h2>Our mission</h2>
                <p className="lead">Our mission is to bridge the gap between academic theory and real-world business application.</p>
                <p>University teaches concepts, but there is a gap when students enter industry. LayerLabs is a safe but
                    realistic sandbox to learn the business of technology.</p>
            </section>

            {/* 3. Services: two solid panels */}
            <section className="our-services">
                <h2>Our services</h2>
                <p>We work with campus departments and student clubs at Algoma University.</p>

                <div className="panels">
                    <article className="panel">
                        <h3>Campus Solutions</h3>
                        <p>We design and 3D print custom pieces for campus departments like Student Life and the Wellness
                            Hub, and for other student clubs. We work with each client from the first idea to the finished
                            product.</p>
                    </article>

                    <article className="panel">
                        <h3>Infrastructure Support</h3>
                        <p>We build practical items that make campus spaces work better, like custom shelving and
                            organizers. Every piece is designed to fit the space and the people who use it.</p>
                    </article>
                </div>

                <Link href="/request" prefetch={false}>Need something made? See how to request a print</Link>
            </section>

            {/* 4. What you'll learn: three ruled columns */}
            <section className="what-you-learn">
                <h2>What you&rsquo;ll learn</h2>
                <p>Every member gets hands-on training in three areas.</p>

                <div className="columns">
                    <article className="column">
                        <h3>Technical Skills</h3>
                        <p>Get trained on our 3D printers and scanners, slicing software and CAD design. You&rsquo;ll also learn
                            safety, maintenance and how to finish your prints.</p>
                    </article>

                    <article className="column">
                        <h3>Business Skills</h3>
                        <p>Learn to write professional emails, run client meetings and figure out what a client really
                            needs. You&rsquo;ll practise planning a project from start to finish, just like in industry.</p>
                    </article>

                    <article className="column">
                        <h3>Startup Skills</h3>
                        <p>LayerLabs is a new club, so there&rsquo;s a lot to build, and members help build it. You can learn
                            email automation, tracking income and expenses, running social media, managing inventory and
                            more.</p>
                    </article>
                </div>
            </section>

            {/* 5. Team: a roster */}
            <section className="team">
                <h2>Meet the team</h2>
                <p>LayerLabs is run by a team of student executives.</p>

                {/* The names and titles live in data/team.js: edit them there */}
                <ul className="roster">
                    {TEAM.map((person) => (
                        <li key={person.name}>
                            <h3>{person.name}</h3>
                            <p>{person.role}</p>
                        </li>
                    ))}
                </ul>
            </section>

            {/* 6. Join: full-width band */}
            <JoinBanner
                title="Open to all students"
                text="No experience needed. We&rsquo;ll train you, from your first print to your first client project." />
        </main>
    );
}
