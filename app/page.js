import Link from 'next/link';
import HeroPrinter from '@/components/HeroPrinter';
import FilmPlayer from '@/components/FilmPlayer';
import PrintGallery from '@/components/PrintGallery';
import EventCard from '@/components/EventCard';
import JoinBanner from '@/components/JoinBanner';
import { JOIN_FORM_URL } from '@/lib/site';
import { PRINTS } from '@/data/prints';
import { EVENTS } from '@/data/events';

// Home page. The title and description come from app/layout.js.
export default function Home() {
    return (
        <main id="main">
            {/* 1. Hero: headline on the left, the live printer on the right */}
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-text">
                        <h1>
                            <span className="line"><span>Learn 3D printing.</span></span>{' '}
                            <span className="line"><span>Build real projects.</span></span>{' '}
                            <span className="line"><span>Work with real clients.</span></span>
                        </h1>
                        <p>Algoma University&rsquo;s student-run 3D printing and design club. Build technical and business
                            skills while working on real-world projects.</p>
                        <div className="hero-actions">
                            <a href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary"
                                aria-label="Join LayerLabs (opens in new tab)">Join LayerLabs</a>
                            <Link href="/projects" prefetch={false} className="btn btn-secondary">See Our Prints</Link>
                        </div>
                    </div>

                    <HeroPrinter />
                </div>
            </section>

            {/* 2. The film (silent, loops while on screen; see components/FilmPlayer.js) */}
            <section className="film" aria-labelledby="film-title">
                <h2 id="film-title" className="sr-only">Watch the LayerLabs film</h2>
                <div className="film-frame">
                    <FilmPlayer
                        src="/video/layerlabs-film.mp4"
                        poster="/video/layerlabs-film-poster.jpg"
                        label="LayerLabs film (no sound)"
                    />
                </div>
                {/* The text version of the film, for people who cannot see it. Closed by default. */}
                <details className="film-caption">
                    <summary>Read a description of the film</summary>
                    <p id="film-description">A 26-second silent film. A vase goes from a CAD drawing to sliced layers to a colour-changing 3D print, matching what members learn: CAD design, slicing software and 3D printers. An example request shows choosing between ready-made items and something custom, picking a date and reviewing the request. Then: professional emails, client meetings and real projects, campus clients like Student Life and the Wellness Hub, and &ldquo;No experience needed. We&rsquo;ll train you.&rdquo; It ends with &ldquo;Ready to start printing?&rdquo; and a Join LayerLabs button.</p>
                </details>
            </section>

            {/* 3. What we do: three neon slabs of different heights */}
            <section className="what-we-do">
                <h2>What we do</h2>

                <div className="tiles">
                    <article className="tile tile-cyan">
                        <h3>Learn</h3>
                        <p>Get hands-on training on 3D printers and design software, plus the business skills to work with real clients.</p>
                    </article>

                    <article className="tile tile-pink">
                        <h3>Build</h3>
                        <p>Turn your ideas into real 3D-printed projects, from prototypes to finished products.</p>
                    </article>

                    <article className="tile tile-lime">
                        <h3>Connect</h3>
                        <p>Work on real projects with campus partners like Student Life and the Wellness Hub.</p>
                    </article>
                </div>
            </section>

            {/* 4. Featured prints: the first four photos from data/prints.js */}
            <section className="featured-prints">
                <h2>Featured prints</h2>
                <PrintGallery items={PRINTS.slice(0, 4)} />
                <Link href="/projects" prefetch={false}>View all projects</Link>
            </section>

            {/* 5. News: a ticket for the next event */}
            <section className="news">
                <h2>News</h2>
                <EventCard event={EVENTS[0]} />
            </section>

            {/* 6. Join: full-width band */}
            <JoinBanner
                title="Ready to start printing?"
                text="Join LayerLabs to learn new skills, build real projects, and work with campus partners.">
                <p>Have a project in mind? <Link href="/request" prefetch={false}>Request a print</Link></p>
            </JoinBanner>
        </main>
    );
}
