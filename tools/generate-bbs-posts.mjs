import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const siteDir = path.resolve('site');

function match(html, pattern, fallback = '') {
    const result = html.match(pattern);
    return result ? result[1].trim() : fallback;
}

function stripTags(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

async function readBbsHeader() {
    const bbsHtml = await readFile(path.join(siteDir, 'bbs-writing.html'), 'utf8');
    return match(bbsHtml, /(<div class="bbs-home-hero">[\s\S]*?<\/div>)\s*<section class="bbs-section-screen">/);
}

function extractPost(html) {
    const titleHtml = match(html, /<h1 class="post-title">([\s\S]*?)<\/h1>/);
    const dateHtml = match(html, /<p id="date">([\s\S]*?)<\/p>/);
    const contentHtml = match(html, /<div id="post-content">\s*([\s\S]*?)\s*<\/div>\s*<\/article>/);

    return {
        titleHtml,
        titleText: stripTags(titleHtml),
        dateHtml,
        contentHtml
    };
}

function renderPage({ titleHtml, titleText, dateHtml, contentHtml, headerHtml, sectionLabel, backHref, backLabel }) {
    const pageTitle = escapeHtml(`${titleText} | BBS`);
    const safeTitle = titleHtml || escapeHtml(titleText);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Personal website of Chad Arimura - ${pageTitle}">
    <title>Chad Arimura | ${pageTitle}</title>
    <link rel="stylesheet" href="/assets/styles.css">
    <link rel="alternate" type="application/rss+xml" title="The Site of Chad Arimura" href="/feed.xml">
    <script src="/assets/javascript/theme.js"></script>
    <script src="/assets/javascript/main.js"></script>
    <script src="/assets/javascript/bbs.js" defer></script>
</head>
<body class="bbs-page">
    <main class="bbs-shell bbs-section-shell" id="bbs">
        <section class="bbs-terminal" aria-label="Chad dot CM BBS">
            ${headerHtml}

            <section class="bbs-article-screen">
                <div class="bbs-section-title">
                    <span>${sectionLabel}</span>
                    <strong>${safeTitle}</strong>
                    <span>${dateHtml}</span>
                </div>

                <article class="bbs-article">
                    <div class="bbs-article-content">
                        ${contentHtml}
                    </div>
                </article>

                <p class="bbs-back-link"><a href="${backHref}">[Esc] ${backLabel}</a></p>
            </section>

            <form class="bbs-command" id="bbs-command">
                <label for="bbs-input">[Node 1] Command:</label>
                <input id="bbs-input" name="command" autocomplete="off" spellcheck="false" placeholder="type home, writing, thoughts, speaking, playground, exit" />
                <button type="submit">Send</button>
            </form>
        </section>
    </main>
</body>
</html>
`;
}

async function generateDirectory({ sourceDir, outputDir, sectionLabel, backHref, backLabel }) {
    const entries = await readdir(sourceDir, { withFileTypes: true });
    await mkdir(outputDir, { recursive: true });

    for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.html')) {
            continue;
        }

        const sourcePath = path.join(sourceDir, entry.name);
        const html = await readFile(sourcePath, 'utf8');
        const post = extractPost(html);

        if (!post.titleText || !post.contentHtml) {
            throw new Error(`Could not extract post content from ${sourcePath}`);
        }

        const outputHtml = renderPage({
            ...post,
            headerHtml,
            sectionLabel,
            backHref,
            backLabel
        });

        await writeFile(path.join(outputDir, entry.name), outputHtml);
    }
}

async function copyBbsPages() {
    const copies = [
        ['bbs.html', 'bbs/index.html'],
        ['bbs-writing.html', 'bbs/writing.html'],
        ['bbs-thoughts.html', 'bbs/thoughts.html'],
        ['bbs-speaking.html', 'bbs/speaking.html'],
        ['bbs-playground.html', 'bbs/playground.html']
    ];

    await mkdir(path.join(siteDir, 'bbs'), { recursive: true });

    for (const [source, destination] of copies) {
        await copyFile(path.join(siteDir, source), path.join(siteDir, destination));
        await rm(path.join(siteDir, source), { force: true });
    }
}

async function copyGamePage() {
    await rm(path.join(siteDir, 'pq1'), { recursive: true, force: true });
    await rm(path.join(siteDir, 'pq1.html'), { force: true });
    await mkdir(path.join(siteDir, 'game'), { recursive: true });
    await copyFile(path.join(siteDir, 'game.html'), path.join(siteDir, 'game', 'index.html'));
    await rm(path.join(siteDir, 'game.html'), { force: true });
}

const headerHtml = await readBbsHeader();
if (!headerHtml) {
    throw new Error('Could not read generated BBS header from site/bbs-writing.html');
}

await generateDirectory({
    sourceDir: path.join(siteDir, 'posts'),
    outputDir: path.join(siteDir, 'bbs', 'posts'),
    sectionLabel: 'File Base',
    backHref: '/bbs/writing.html',
    backLabel: 'Back to Writing'
});

await generateDirectory({
    sourceDir: path.join(siteDir, 'thought'),
    outputDir: path.join(siteDir, 'bbs', 'thought'),
    sectionLabel: 'Message Base',
    backHref: '/bbs/thoughts.html',
    backLabel: 'Back to Thoughts'
});

await copyBbsPages();
await copyGamePage();

console.log('Generated BBS route files, game route file, post detail pages, and thought detail pages.');
