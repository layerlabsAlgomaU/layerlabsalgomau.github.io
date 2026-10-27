import { MEMBER_STEPS, EXTRA_TRAINING_URL } from '@/data/members';

export const metadata = {
    title: 'Members',
    description:
        'Resources for LayerLabs members: the printer walkthrough, printer quizzes and the member chat.',
};

// The steps and links live in data/members.js: edit them there.
export default function Members() {
    return (
        <main id="main">
            {/* 1. Page intro */}
            <section className="page-intro">
                <h1>Members</h1>
                <p>Everything you need to get trained and start printing, in order.</p>
            </section>

            {/* 2. Steps */}
            <section className="member-steps">
                <h2>Your path to printing</h2>
                <ol className="steps">
                    {MEMBER_STEPS.map((step) => (
                        <li key={step.title}>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                            {step.href ? (
                                <a href={step.href} target="_blank" rel="noopener noreferrer"
                                    aria-label={step.title + ' (opens in new tab)'}>Open</a>
                            ) : (
                                <p className="soon">Link coming soon</p>
                            )}
                        </li>
                    ))}
                </ol>
            </section>

            {/* 3. Extra training */}
            <section className="more-training">
                <h2>Keep learning</h2>
                <p>Want more? The HP 3D Printing course is free to enrol in and adds a certification to your résumé.</p>
                <a href={EXTRA_TRAINING_URL} target="_blank" rel="noopener noreferrer"
                    aria-label="HP 3D Printing course (opens in new tab)">Open the HP 3D Printing course</a>
            </section>
        </main>
    );
}
