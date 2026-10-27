// Checks the built site (the "out" folder) for things that must never go live.
// Run:  npm run check      (it builds the site first)
// It fails (exit code 1) if it finds any problem, so it can also run in automation later.

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = 'out';
const problems = [];

function htmlFiles(dir) {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return name.startsWith('_next') ? [] : htmlFiles(path);
        return name.endsWith('.html') ? [path] : [];
    });
}

if (!existsSync(OUT)) {
    console.error('No "out" folder. Run "npm run build" first.');
    process.exit(1);
}

const pages = htmlFiles(OUT);

for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    const name = relative(OUT, file);

    // Things that must not be on a live page
    if (/href="#"/.test(html)) problems.push(name + ': dead link href="#"');
    if (/coming soon/i.test(html) && !name.startsWith('members')) problems.push(name + ': "coming soon" text');
    if (/TODO|lorem ipsum/i.test(html)) problems.push(name + ': TODO / lorem ipsum text');
    if (/docs\.google\.com\/[^"]*\/edit/.test(html)) problems.push(name + ': Google "edit" link (use viewform or preview)');
    if (/E87000/i.test(html)) problems.push(name + ': forbidden Orange #E87000');

    // Every page needs one h1, a title and a description
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1 && !name.startsWith('_not-found') && name !== '404.html') problems.push(name + ': ' + h1s + ' h1 elements (need exactly 1)');
    if (!/<title>[^<]+<\/title>/.test(html)) problems.push(name + ': missing <title>');
    if (!/<meta name="description"/.test(html)) problems.push(name + ': missing meta description');

    // Images need alt text
    for (const img of html.match(/<img[^>]*>/g) || []) {
        if (!/\salt="/.test(img)) problems.push(name + ': image without alt text');
    }

    // New-tab links need the safety attribute
    for (const a of html.match(/<a [^>]*target="_blank"[^>]*>/g) || []) {
        if (!/rel="noopener noreferrer"/.test(a)) problems.push(name + ': target=_blank link without rel="noopener noreferrer"');
    }

    // Internal links must point at a page or file that exists
    for (const [, href] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
        if (href.startsWith('/_next') || href.startsWith('//')) continue;
        const target = join(OUT, href);
        const ok = existsSync(target) && (statSync(target).isFile() || existsSync(join(target, 'index.html')));
        if (!ok) problems.push(name + ': broken internal link ' + href);
    }
}

for (const file of ['sitemap.xml', 'robots.txt']) {
    if (!existsSync(join(OUT, file))) problems.push('missing ' + file);
}

const unique = [...new Set(problems)];
if (unique.length) {
    console.error('\n' + unique.length + ' problem(s) found:\n - ' + unique.join('\n - '));
    process.exit(1);
}
console.log('Checked ' + pages.length + ' pages: no problems found.');
