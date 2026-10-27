// "Add to cart" feedback: a small piece of red filament arcs from the button to the cart badge.
// Returns how many milliseconds the flight takes (0 = nothing flew), so the badge can pop
// at the moment the piece arrives.

export function flyToCart(fromElement) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = document.getElementById('cart-count') || document.getElementById('cart-toggle');
    if (reduced || !target || !fromElement || !fromElement.animate) return 0;

    const from = fromElement.getBoundingClientRect();
    const to = target.getBoundingClientRect();

    // start and end points: the centres of the button and the badge (screen coordinates)
    const startX = from.left + from.width / 2;
    const startY = from.top + from.height / 2;
    const dx = to.left + to.width / 2 - startX;
    const dy = to.top + to.height / 2 - startY;

    const piece = document.createElement('span');
    piece.className = 'fly-dot';
    piece.setAttribute('aria-hidden', 'true');
    piece.style.left = startX + 'px';
    piece.style.top = startY + 'px';
    document.body.appendChild(piece);

    const DURATION = 650;
    const animation = piece.animate(
        [
            { transform: 'translate(-50%, -50%) translate(0px, 0px) scale(1)', opacity: 1 },
            // halfway point is pulled upward, which bends the path into an arc
            { transform: 'translate(-50%, -50%) translate(' + dx * 0.6 + 'px, ' + (dy * 0.6 - 70) + 'px) scale(0.9)', opacity: 1, offset: 0.6 },
            { transform: 'translate(-50%, -50%) translate(' + dx + 'px, ' + dy + 'px) scale(0.3)', opacity: 0.85 },
        ],
        { duration: DURATION, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
    );

    // Clean up when done. A timer backs this up in case the animation is cancelled.
    animation.onfinish = () => piece.remove();
    setTimeout(() => piece.remove(), DURATION + 200);

    return DURATION - 80;
}
