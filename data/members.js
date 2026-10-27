// The Members page: the steps a new member follows, in order. Edit this list to add, remove or reorder steps.
//
// Each step: a title, a short description and a link.
//   href: null shows "Link coming soon". When you get the real link, put it between the quotes.
//
// Only use PUBLIC links:
//   - Google Forms: the "viewform" link, NEVER the "edit" link
//   - Google Docs: the "/preview" link (read-only)
//   - NEVER a responses spreadsheet, and never anything private
// The training sign-off / final waiver is deliberately not listed: members get it by email
// (automation set up by another member), so it does not need a public link.

import { JOIN_FORM_URL } from '@/lib/site';

export const MEMBER_STEPS = [
    {
        title: 'Sign up',
        text: 'Fill in the sign-up form. You will get a welcome email.',
        href: JOIN_FORM_URL,
    },
    {
        title: 'Join the member chat',
        text: 'The WhatsApp group where members talk and get updates.',
        href: null, // put the WhatsApp invite link here once the club has it
    },
    {
        title: '3D printer walkthrough',
        text: 'Step-by-step guide (our standard operating procedure) with videos and software.',
        href: 'https://docs.google.com/document/d/1nZS_BYzJqNcQpqnPmGvyrBWTTgz8LyqRI7AgUJEjuwU/preview',
    },
    {
        title: 'FlashForge Adventurer 3 quiz',
        text: 'Check what you learned about the FlashForge Adventurer 3.',
        href: 'https://docs.google.com/forms/d/1nl0jfbXDiwMWeWGoFOPW_MwzloQpJVtFmWPvyfdaDhg/viewform',
    },
    {
        title: 'FlashForge Adventurer 4 quiz',
        text: 'Check what you learned about the FlashForge Adventurer 4.',
        href: 'https://docs.google.com/forms/d/1e-NdL2JgHH0u0qyKnzwIsUDIb7keOzuN46boSCM8aB8/viewform',
    },
];

// The "Keep learning" link at the bottom of the Members page
export const EXTRA_TRAINING_URL = 'https://www.life-global.org/course/18-3d-printing';
