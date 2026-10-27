'use client';

// The ONE request form, for both paths (ready-made items from the cart, or a custom idea).
// There are no prices. After a valid submit we show a summary of the request. Then:
//   - if REQUEST_ENDPOINT is set (lib/site.js): "Send request" posts it to the club's Google Apps
//     Script (see google-apps-script/), which saves it in a sheet and emails the team. The visitor
//     sees "Request sent", or a clear error with an "email it instead" fallback.
//   - if not: "Send request" opens the visitor's email app with the request filled in (mailto:).
//
// Rules:
//   - Cart has items  -> a delivery date is required and the notes are optional.
//   - Cart is empty   -> the visitor must describe a custom idea (and the date is optional).

import { useEffect, useRef, useState } from 'react';
import { CLUB_EMAIL, findProduct, itemsText } from '@/data/products';
import { REQUEST_ENDPOINT } from '@/lib/site';
import { useCart } from '@/components/CartContext';

const WHO = ['Campus department', 'Student club'];
// Shown only on the custom path (when the cart is empty)
const NEEDS = ['A custom design', 'Something like one of our ready-made items', 'Not sure yet'];

function todayString() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// "2026-11-30" -> "Monday, November 30, 2026"
function formatDate(isoDate) {
    const parts = isoDate.split('-');
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function buildMailto(f) {
    const lines = ['Hi LayerLabs,', '', 'I would like to request a print.', ''];

    if (f.lines.length > 0) {
        lines.push('Ready-made items:');
        f.lines.forEach((line) => lines.push('- ' + line));
        lines.push('');
    }

    if (f.need) lines.push('What I need: ' + f.need);
    lines.push('Who I am: ' + f.who);
    if (f.dateText) lines.push('Date wanted: ' + f.dateText);
    lines.push('Name: ' + f.name, 'Email: ' + f.email);
    if (f.details) lines.push((f.lines.length > 0 ? 'Notes: ' : 'Details: ') + f.details);
    lines.push('', 'Thank you!');

    const subject = 'Print request from ' + f.name.replace(/[\r\n]+/g, ' ');
    return 'mailto:' + CLUB_EMAIL + '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\r\n'));
}

// What to tell the visitor when the Google script says no (its error codes are in google-apps-script/)
function sendErrorText(code) {
    if (code === 'slow_down') return 'You just sent a request from this email address. Please wait a minute and try again.';
    if (code === 'too_fast') return 'That was very quick. Please check your details and try again.';
    if (code === 'busy') return 'We are getting a lot of requests right now. Please send it by email instead.';
    if (code === 'invalid') return 'Something in the request did not look right. Please check your details and try again.';
    return 'We could not send your request. Please try again, or send it by email instead.';
}

export default function RequestForm() {
    const { items, count, openDrawer, clearCart } = useCart();
    const hasItems = items.length > 0;

    const [need, setNeed] = useState('');
    const [who, setWho] = useState('');
    const [date, setDate] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [details, setDetails] = useState('');
    const [trap, setTrap] = useState(''); // hidden "honeypot" field: people never see it, bots fill it in
    const [errors, setErrors] = useState({});
    const [summary, setSummary] = useState(null); // null = not shown yet
    const [status, setStatus] = useState('idle'); // idle | sending | sent
    const [sendError, setSendError] = useState('');
    const [sentTo, setSentTo] = useState(null); // { name, email } of the request that was sent
    const [today, setToday] = useState(''); // the earliest date allowed (set after the page loads)
    const summaryRef = useRef(null);
    const sentRef = useRef(null);
    const openedAt = useRef(0); // when the form appeared (the script refuses forms filled in under 3 seconds)

    useEffect(() => {
        setToday(todayString());
        openedAt.current = Date.now();
    }, []);

    // If the cart changes, an old summary no longer matches it
    useEffect(() => {
        setSummary(null);
        setSendError('');
        setErrors((current) => ({ ...current, items: '' }));
    }, [items]);

    // When a summary appears, move focus to it and scroll it into view
    useEffect(() => {
        if (!summary || !summaryRef.current) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        summaryRef.current.focus({ preventScroll: true });
        summaryRef.current.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }, [summary]);

    // Same for the "Request sent" message
    useEffect(() => {
        if (status !== 'sent' || !sentRef.current) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        sentRef.current.focus({ preventScroll: true });
        sentRef.current.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }, [status]);

    // Called when the visitor types in a field: clear that field's error and drop any old summary
    function update(field, setter, value) {
        setter(value);
        setErrors((current) => ({ ...current, [field]: '' }));
        setSummary(null);
        setSendError('');
    }

    function handleSubmit(event) {
        event.preventDefault();

        const found = {}; // field -> error message

        if (!hasItems && !need) found.need = 'Choose what you need.';
        if (!who) found.who = 'Choose who you are requesting for.';

        if (!date) {
            if (hasItems) found.date = 'Choose the date you want your order by.';
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            found.date = 'Enter the date like this: 2026-11-30.';
        } else if (date < todayString()) {
            found.date = 'That date has already passed. Choose today or a later date.';
        }

        if (name.trim() === '') found.name = 'Enter your name.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found.email = 'Enter a valid email address, like name@example.com.';

        if (!hasItems && details.trim() === '') {
            found.details = 'Tell us about your idea, or add a ready-made item to your cart above.';
        }

        setErrors(found);

        // Focus the first field with a problem
        const ids = { need: 'req-need', who: 'req-who', date: 'delivery-date', name: 'req-name', email: 'req-email', details: 'req-details' };
        const firstBad = ['need', 'who', 'date', 'name', 'email', 'details'].find((field) => found[field]);
        if (firstBad) {
            document.getElementById(ids[firstBad])?.focus();
            return;
        }

        const values = {
            need: hasItems ? '' : need,
            who,
            dateText: date ? formatDate(date) : '',
            name: name.trim(),
            email: email.trim(),
            details: details.trim(),
            lines: items.map((item) => findProduct(item.id).name + ' × ' + item.qty),
            // the same items as data for the script: name and quantity
            items: items.map((item) => ({ name: findProduct(item.id).name, qty: item.qty })),
        };
        setSendError('');
        setSummary({ ...values, mailto: buildMailto(values) });
    }

    function editRequest() {
        setSummary(null);
        setSendError('');
        document.getElementById('req-who')?.focus();
    }

    // Send the request to the club's Google Apps Script
    async function send() {
        if (status === 'sending' || !summary) return;
        setStatus('sending');
        setSendError('');

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000); // give up after 15 seconds

        try {
            const response = await fetch(REQUEST_ENDPOINT, {
                method: 'POST',
                // text/plain keeps this a "simple" request, so the browser does not need Google's permission first
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                    name: summary.name,
                    email: summary.email,
                    who: summary.who,
                    need: summary.need,
                    date: summary.dateText,
                    details: summary.details,
                    items: summary.items,
                    website: trap,
                    elapsed: Date.now() - openedAt.current,
                }),
                signal: controller.signal,
            });
            const result = await response.json();

            if (result && result.ok) {
                setSentTo({ name: summary.name, email: summary.email });
                // start fresh: empty form, empty cart, no summary
                setNeed(''); setWho(''); setDate(''); setName(''); setEmail(''); setDetails(''); setTrap('');
                setErrors({});
                setSummary(null);
                clearCart();
                setStatus('sent');
            } else {
                setSendError(sendErrorText(result && result.error));
                setStatus('idle');
            }
        } catch (error) {
            setSendError(sendErrorText('network'));
            setStatus('idle');
        } finally {
            clearTimeout(timeout);
        }
    }

    function anotherRequest() {
        setStatus('idle');
        setSentTo(null);
        openedAt.current = Date.now();
        setTimeout(() => document.getElementById('req-who')?.focus(), 0);
    }

    return (
        <section className="checkout" id="checkout">
            <h2>Send us your request</h2>

            {status === 'sent' ? (
                <div className="request-sent" tabIndex={-1} role="status" ref={sentRef}>
                    <h3>Request sent</h3>
                    <p>Thank you, {sentTo.name}. We have your request and will reply to {sentTo.email} soon.</p>
                    <p className="note">We will reply with a quote or to set up your intake meeting. Nothing is charged online.</p>
                    <button type="button" className="btn btn-secondary" onClick={anotherRequest}>Make another request</button>
                </div>
            ) : (
                <>
                    <p className="checkout-note">
                        <span id="checkout-cart-note">
                            {hasItems
                                ? 'Your cart has ' + itemsText(count) + '.'
                                : 'No ready-made items in your cart. Describe a custom idea below, or add items above.'}
                        </span>
                        <button type="button" className="link-btn" id="checkout-view-cart" onClick={openDrawer}>View cart</button>
                    </p>

                    <form className="quote-form" noValidate onSubmit={handleSubmit}>
                        {/* Honeypot: hidden from people and screen readers. Only a bot fills it in. */}
                        <div className="trap" aria-hidden="true">
                            <label htmlFor="req-trap">Leave this empty</label>
                            <input type="text" id="req-trap" name="hp_contact_note" tabIndex={-1} autoComplete="off"
                                value={trap} onChange={(e) => setTrap(e.target.value)} />
                        </div>

                        <div className="form-grid">
                            {!hasItems && (
                                <div className="field field-wide">
                                    <label htmlFor="req-need">What do you need?</label>
                                    <select id="req-need" value={need} onChange={(e) => update('need', setNeed, e.target.value)}
                                        aria-invalid={errors.need ? 'true' : undefined} aria-describedby="req-need-error" required>
                                        <option value="">Choose one</option>
                                        {NEEDS.map((n) => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <p className="field-error" id="req-need-error">{errors.need}</p>
                                </div>
                            )}

                            <div className="field">
                                <label htmlFor="req-who">Who is it for?</label>
                                <select id="req-who" value={who} onChange={(e) => update('who', setWho, e.target.value)}
                                    aria-invalid={errors.who ? 'true' : undefined} aria-describedby="req-who-error" required>
                                    <option value="">Choose one</option>
                                    {WHO.map((n) => <option key={n} value={n}>{n}</option>)}
                                </select>
                                <p className="field-error" id="req-who-error">{errors.who}</p>
                            </div>

                            <div className="field">
                                <label htmlFor="delivery-date">{hasItems ? 'Delivery date wanted' : 'Date you need it by (optional)'}</label>
                                <input type="date" id="delivery-date" min={today} value={date}
                                    onChange={(e) => update('date', setDate, e.target.value)}
                                    aria-invalid={errors.date ? 'true' : undefined} aria-describedby="delivery-date-error" />
                                <p className="field-error" id="delivery-date-error">{errors.date}</p>
                            </div>

                            <div className="field">
                                <label htmlFor="req-name">Your name</label>
                                <input type="text" id="req-name" autoComplete="name" required maxLength={100} value={name}
                                    onChange={(e) => update('name', setName, e.target.value)}
                                    aria-invalid={errors.name ? 'true' : undefined} aria-describedby="req-name-error" />
                                <p className="field-error" id="req-name-error">{errors.name}</p>
                            </div>

                            <div className="field">
                                <label htmlFor="req-email">Your email</label>
                                <input type="email" id="req-email" autoComplete="email" required maxLength={150} value={email}
                                    onChange={(e) => update('email', setEmail, e.target.value)}
                                    aria-invalid={errors.email ? 'true' : undefined} aria-describedby="req-email-error" />
                                <p className="field-error" id="req-email-error">{errors.email}</p>
                            </div>

                            <div className="field field-wide">
                                <label htmlFor="req-details">{hasItems ? 'Notes (optional)' : 'Tell us about your idea'}</label>
                                <textarea id="req-details" rows={5} maxLength={3000} value={details}
                                    placeholder={hasItems
                                        ? 'Colours, sizes, what it is for...'
                                        : 'What is it for? Sizes, colours, when you need it...'}
                                    onChange={(e) => update('details', setDetails, e.target.value)}
                                    aria-invalid={errors.details ? 'true' : undefined} aria-describedby="req-details-error"></textarea>
                                <p className="field-error" id="req-details-error">{errors.details}</p>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">Review request</button>

                        {/* Tell visitors what happens to their details. The wording changes with how requests are sent. */}
                        <p className="note privacy-note">
                            <strong>How we use your details.</strong> Your name, email and request are used only to reply to you
                            and to work on your request.{' '}
                            {REQUEST_ENDPOINT
                                ? 'When you send it, it goes to the LayerLabs team’s inbox and a private club spreadsheet that only the team can open.'
                                : 'When you send it, it goes to the LayerLabs team’s email inbox.'}{' '}
                            We do not sell them or share them outside the club. To have your details deleted, email{' '}
                            <a href={'mailto:' + CLUB_EMAIL}>{CLUB_EMAIL}</a>.
                        </p>
                    </form>

                    {summary && (
                        <div className="quote-summary" id="quote-summary" tabIndex={-1} aria-live="polite" ref={summaryRef}>
                            <h3>Your print request</h3>

                            {summary.lines.length > 0 && (
                                <>
                                    <h4>Ready-made items</h4>
                                    <ul>
                                        {summary.lines.map((line) => <li key={line}>{line}</li>)}
                                    </ul>
                                </>
                            )}

                            <h4>Details</h4>
                            <dl>
                                {summary.need && <><dt>Needs</dt><dd>{summary.need}</dd></>}
                                <dt>For</dt><dd>{summary.who}</dd>
                                {summary.dateText && <><dt>Date wanted</dt><dd>{summary.dateText}</dd></>}
                                <dt>Name</dt><dd>{summary.name}</dd>
                                <dt>Email</dt><dd>{summary.email}</dd>
                                {summary.details && <><dt>{summary.lines.length > 0 ? 'Notes' : 'Details'}</dt><dd>{summary.details}</dd></>}
                            </dl>

                            <div className="summary-actions">
                                {REQUEST_ENDPOINT ? (
                                    <button type="button" className="btn btn-primary" onClick={send} disabled={status === 'sending'}>
                                        {status === 'sending' ? 'Sending…' : 'Send request'}
                                    </button>
                                ) : (
                                    <a className="btn btn-primary" href={summary.mailto}>Send request</a>
                                )}
                                <button type="button" className="btn btn-secondary" onClick={editRequest} disabled={status === 'sending'}>Edit request</button>
                            </div>

                            {/* Something went wrong: say so, and offer the email route */}
                            {sendError && (
                                <p className="form-error send-error" role="alert">
                                    {sendError} <a href={summary.mailto}>Send it by email instead</a>
                                </p>
                            )}

                            {REQUEST_ENDPOINT ? (
                                <p className="note">Your request is sent to the club through Google, and we only use your details to reply.
                                    We will reply with a quote or to set up your intake meeting.</p>
                            ) : (
                                <p className="note">This opens your email app with the request filled in. Press Send there to submit it.
                                    We will reply with a quote or to set up your intake meeting.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
