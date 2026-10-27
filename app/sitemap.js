import { SITE_URL, NAV_LINKS } from '@/lib/site';

// sitemap.xml: a list of every page, for search engines.
// "force-static" is needed because the site is exported as plain files.
export const dynamic = 'force-static';

export default function sitemap() {
    return [{ href: '/' }, ...NAV_LINKS].map((page) => ({
        url: SITE_URL.replace(/\/$/, '') + page.href + (page.href === '/' ? '' : '/'),
    }));
}
