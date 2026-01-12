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
        <main class="content" id="mainContent">
            <button class="content" id="theme-toggle" aria-label="Toggle theme">
                <img id="theme-toggle-icon" src="../icons/light-mode-icon.svg" fetchpriority="high">
            </button>
            <section class="article content">
                ${cover ? `<img class="cover" src="${cover}">` : ""}
                <div class="cover-blur"></div>
                <br>
                <br>
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
            <br>
            <hr>
            <section class="footer content">
                <a href="https://github.com/VihaanVinoth">
                    <img id="git-icon" src="../icons/github-icon.png" loading="lazy">
                    <p>Github</p>
                </a>
                <p>&nbsp;&nbsp;</p>
                <a href="mailto:dalx900@gmail.com">
                    <svg class="mail-icon-add" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                        loading="lazy" width="20px" fill="#FFFFFF">
                        <path
                            d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
                    </svg>
                    <p>Contact</p>
                </a>
                <p id="footer-reserved">©2025 Made with 🌶️ by Vihaan Vinoth.</p>
            </section>
        </main>
        <script type="text/javascript">
        window.addEventListener("load", () => {
            const observer = new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );

            document.querySelectorAll(".content").forEach(el => observer.observe(el));

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
