// News and events. Used by the Home page (the FIRST one, as "News") and the Partners & Events page (all of them).
// To add one, add an object at the TOP of the list. Remove old ones when they stop being useful.
//
// The paragraph is built like this:  before + (date in bold-less text) + after
//   before: the sentence up to the date, ending in a word like "on"
//   dateText: the date as shown, with dateTime = the first day as YYYY-MM-DD (for screen readers and search engines)
//   after: what follows the date. Optional: if you leave it out, a full stop is used.
// Only write things that are true and that everyone involved is happy to see (no individual credit that could
// leave a teammate out, and no money other than a prize the organisers published).
export const EVENTS = [
    {
        id: 'thunderhacks-2026',
        day: '14–16',
        month: 'October',
        dateTime: '2026-10-14',
        dateText: 'October 14–16, 2026',
        title: 'Second place at ThunderHacks II',
        before: 'A team of three LayerLabs members competed in ThunderHacks II, Algoma University’s flagship hackathon hosted by ALCOMS, on',
        after: '. The team placed second and won a $750 prize.',
        linkHref: 'https://thunderhacks.algomau.ca/',
        linkText: 'Learn more about ThunderHacks',
    },
];
