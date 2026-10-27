import { SITE_URL } from '@/lib/site';

// robots.txt: tells search engines they may read everything and where the sitemap is.
export const dynamic = 'force-static';

export default function robots() {
    return {
        rules: { userAgent: '*', allow: '/' },
        sitemap: SITE_URL.replace(/\/$/, '') + '/sitemap.xml',
    };
}
