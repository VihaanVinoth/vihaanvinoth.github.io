import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';
import matter from "gray-matter";

const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true
});

const ROOT = process.cwd();
const postsDir = path.join(ROOT, "blog/posts");
const outDir = path.join(ROOT, "public/posts");

if (!fs.existsSync(postsDir)) {
    console.error("Post directory not found");
    process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

for (const file of fs.readdirSync(postsDir)) {
    if (!file.endsWith('.md')) continue;

    const mdContent = fs.readFileSync(path.join(postsDir, file), 'utf-8');

    const { data, content } = matter(mdContent);
    
    const htmlBody = md.render(content);
    const slug = path.basename(file, ".md");

    const title = data.title ?? slug;
    const summary = data.summary ?? "";
    const date = data.date ?? "";

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>${slug}</title>
        <link rel="stylesheet" href="../stylesheets/style.css">
        <link rel="stylesheet" href="../stylesheets/reset.css">
        <meta name="description" content="${summary}">
    </head>
    <body>
        <main>
            <section class="article">
                <header>
                    <h1>${title}</h1>
                    ${date ? `<time datetime=${date}">${date}</time>` : ""}
                    ${summary ? `<p class="summary">${summary}</p>` : ""}
                </header>
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