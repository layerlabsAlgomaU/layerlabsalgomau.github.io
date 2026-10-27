// One event or piece of news as a "ticket". The data comes from data/events.js.
export default function EventCard({ event }) {
    return (
        <article className="ticket news-item">
            <div className="ticket-date" aria-hidden="true">
                <strong>{event.day}</strong>
                <span>{event.month}</span>
            </div>
            <div className="ticket-body">
                <h3>{event.title}</h3>
                <p>{event.before}{' '}
                    <time dateTime={event.dateTime}>{event.dateText}</time>{event.after || '.'}
                </p>
                <a href={event.linkHref} target="_blank" rel="noopener noreferrer"
                    aria-label={event.linkText + ' (opens in new tab)'}>{event.linkText}</a>
            </div>
        </article>
    );
}
