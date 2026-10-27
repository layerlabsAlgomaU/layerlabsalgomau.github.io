import Link from 'next/link';
import { EMAIL, SOCIALS } from '@/lib/site';

export const metadata = {
    title: 'Contact',
    description: 'Get in touch with LayerLabs, the student-run 3D printing club at Algoma University: email, Instagram and GitHub.',
};

export default function Contact() {
    return (
        <main id="main">
            {/* 1. Page intro */}
            <section className="page-intro">
                <h1>Contact us</h1>
                <p>Questions about joining, a project idea or a partnership? We would love to hear from you.</p>
            </section>

            {/* 2. Ways to reach us */}
            <section className="contact-details">
                <h2>Get in touch</h2>
                <ul className="roster">
                    <li>
                        <h3>Email</h3>
                        <p><a href={'mailto:' + EMAIL}>{EMAIL}</a></p>
                    </li>
                    {SOCIALS.map((social) => (
                        <li key={social.label}>
                            <h3>{social.label}</h3>
                            <p><a href={social.href} target="_blank" rel="noopener noreferrer"
                                aria-label={social.label + ' (opens in new tab)'}>{social.handle}</a></p>
                        </li>
                    ))}
                </ul>
            </section>

            {/* 3. Need a print? */}
            <section className="contact-request">
                <h2>Need something printed?</h2>
                <p>Use the request form so we have everything we need.</p>
                <Link href="/request" prefetch={false} className="btn btn-primary">Request a print</Link>
            </section>
        </main>
    );
}
