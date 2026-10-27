import RequestHub from '@/components/RequestHub';

export const metadata = {
    title: 'Request a Print',
    description:
        'Order ready-made 3D prints or request something custom from LayerLabs. Open to Algoma University departments and student clubs. Pick your items or describe your idea, then send your request.',
};

// The page itself only sets the title and description. Choosing a path and the request form
// are interactive, so they live in components/RequestHub.js, which runs in the browser.
export default function Request() {
    return <RequestHub />;
}
