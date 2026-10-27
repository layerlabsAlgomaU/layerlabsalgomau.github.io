import { JOIN_FORM_URL } from '@/lib/site';

// The full-width "Join LayerLabs" band at the bottom of a page.
// The title and text change per page, the button and link do not.
// Anything passed between the tags (children) is shown under the button.
export default function JoinBanner({ title, text, children }) {
    return (
        <section className="join-banner">
            <div className="band-inner">
                <h2>{title}</h2>
                <p>{text}</p>
                <a href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary"
                    aria-label="Join LayerLabs (opens in new tab)">Join LayerLabs</a>
                {children}
            </div>
        </section>
    );
}
