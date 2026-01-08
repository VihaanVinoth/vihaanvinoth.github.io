import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true
});

const postsDir = path.join('blog', 'posts');
const outDir = path.join('public', 'posts');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

fs.readdirSync(postsDir).forEach(file => {
    if (!file.endsWith('.md')) return;

    const mdContent = fs.readFileSync(path.join(postsDir, file), 'utf-8');

    const content = mdContent.replace(/^---[\s\S]*?---\s*/, '');
    
    const htmlBody = md.render(content);

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>${file.replace('.md', '')}</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <section class="article">
            ${htmlBody}
        </section>
    </body>
    </html>
    `;

    const outFile = path.join(outDir, file.replace('.md', '.html'));
    fs.writeFileSync(outFile, html, 'utf-8');
    console.log(`Built ${outFile}`);
});