import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true
});

const postsDir = "blog/posts";
const outDir = "public/posts";

fs.mkdirSync(outDir, { recursive: true });

for (const file of fs.readdirSync(postsDir)) {
    if (!file.endsWith('.md')) return;

    const mdContent = fs.readFileSync(path.join(postsDir, file), 'utf-8');

    const content = mdContent.replace(/^---[\s\S]*?---\s*/, '');
    
    const htmlBody = md.render(content);
    const slug = file.replace(".md", "");

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>${slug}</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <main>
            <section class="article">
                ${htmlBody}
            </section>
        </main>
    </body>
    </html>
    `;
    
    fs.writeFileSync(
        path.join(outDir, `${slug}.html`),
        html
    );
}

console.log(`Built ${outDir}`);