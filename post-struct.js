import fs from "fs";
import path from "path";
import MarkdownIt from "markdown-it";
import matter from "gray-matter";

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
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
  if (!file.endsWith(".md")) continue;

  const mdContent = fs.readFileSync(path.join(postsDir, file), "utf-8");

  const { data, content } = matter(mdContent);

  const htmlBody = md.render(content);
  const slug = path.basename(file, ".md");

  const title = data.title ?? slug;
  const summary = data.summary ?? "";
  const date = data.date.toLocaleDateString() ?? "";
  const cover = data.cover ?? "";

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
            <button id="theme-toggle" aria-label="Toggle theme">
                <img id="theme-toggle-icon" src="./icons/light-mode-icon.svg" fetchpriority="high">
            </button>
            <br>
            <section class="article">
                ${cover ? `<img class="cover" src="${cover}">` : ""}
                ${
                  date
                    ? `<time datetime="${date}">${date} · Vihaan Vinoth</time>`
                    : ""
                }
                ${summary ? `<p class="summary">${summary}</p>` : ""}
                <header>
                    <h1 id="article-title">${title}</h1>
                </header>
                ${htmlBody}
            </section>
        </main>
        <script type="text/javascript">
        window.addEventListener("load", () => {
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
        });

        const toggle = document.getElementById("theme-toggle");
        const root = document.documentElement;

        const savedTheme = localStorage.getItem("theme");
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme) {
            root.dataset.theme = savedTheme;
        } else {
            root.dataset.theme = systemDark ? "dark" : "light";
        }

        toggle.addEventListener("click", () => {
            const isDark = root.dataset.theme === "dark";
            root.dataset.theme = isDark ? "light" : "dark";
            localStorage.setItem("theme", root.dataset.theme);
        });
        </script>
    </body>
    </html>
    `;

  fs.writeFileSync(path.join(outDir, `${slug}.html`), html);
}

console.log(`Built ${outDir}`);
