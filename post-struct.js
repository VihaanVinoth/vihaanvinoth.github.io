import fs from "fs";
import path from "path";
import MarkdownIt from "markdown-it";
import matter from "gray-matter";

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

const postsDir = "blog/posts";
const outDir = "public/posts";
const indexFile = "public/posts.json";

if (!fs.existsSync(postsDir)) {
  console.error("Post directory not found");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const postsIndex = [];

for (const file of fs.readdirSync(postsDir)) {
  if (!file.endsWith(".md")) continue;

  const mdContent = fs.readFileSync(path.join(postsDir, file), "utf-8");

  const { data, content } = matter(mdContent);

  const htmlBody = md.render(content);
  const slug = path.basename(file, ".md");

  const wpm = 225;
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / wpm));

  const rawTags = data.tags ?? [];

  const tags = Array.isArray(rawTags)
    ? rawTags.map(t => String(t).toLowerCase().trim())
    : String(rawTags)
        .split(",")
        .map(t => t.toLowerCase().trim)
        .filter(Boolean);

  const title = data.title ?? slug;
  const summary = data.description ?? "";
  const cover = data.cover ?? "";
  const dateNow = data.date ?? "";

  const dateObj = dateNow ? new Date(dateNow) : null;

  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  const dateFormat = dateObj
    ? new Intl.DateTimeFormat("en-GB", options).format(dateObj)
    : "";

  const parts = dateFormat.split(" ");

  const date = `${parts[0].replace(",", "")} ${parts[1]}, ${parts[2]}` ?? "";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>${title} | Vihaan Vinoth</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="index, follow">
        <link rel="stylesheet" href="/stylesheets/reset.css?v=1.9.9.5">
        <link rel="stylesheet" href="/stylesheets/style.css?v=1.9.9.5">
        <meta name="description" content="${summary}">
        <meta property="og:title" content="${title} - Vihaan Vinoth">
        <meta property="og:description" content="${summary}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://vihaanvinoth.com/${slug}">
        <meta property="og:image" content="https://cdn.vihaanvinoth.com/og-image.png">
        <link rel="shortcut icon" href="favicon/favicon.ico" type="image/x-icon">
        <link rel="icon" type="image/png" sizes="16x16" href="https://cdn.vihaanvinoth.com/favicon/favicon-16x16.png">
        <link rel="icon" type="image/png" sizes="32x32" href="https://cdn.vihaanvinoth.com/favicon/favicon-32x32.png">
        <link rel="apple-touch-icon" sizes="180x180" href="https://cdn.vihaanvinoth.com/favicon/apple-touch-icon.png">
        <link rel="manifest" href="favicon/site.webmanifest">
        <meta name="theme-color" content="#ffffff">
        <meta name="google-adsense-account" content="ca-pub-8253398098387796">
    </head>
    <body>
        <main class="content" id="mainContent">
            <a href="../index.html" id="logo" aria-label="Redirects back to main site"><img src="https://cdn.vihaanvinoth.com/VVNormal.png" alt="Vihaan Vinoth Logo" loading="eager" fetchpriority="high"></a>
            <br>
            <br>
            <button class="content" id="theme-toggle" aria-label="Toggle theme">
                <img id="theme-toggle-icon" src="https://cdn.vihaanvinoth.com/icons/light-mode-icon.svg" loading="eager" alt="Theme toggle icon" fetchpriority="high">
            </button>
            <section class="article content">
                ${cover ? `<img class="cover" src="${cover}">` : ""}
                <div class="cover-blur"></div>
                <div class="article-text">
                    <br>
                    <br>
                    ${
                      date
                        ? `<time datetime="${date}">${date} · Vihaan Vinoth · ${mins} min read</time>`
                        : ""
                    }
                    <header>
                        <h1 id="article-title">${title}</h1>
                    </header>
                    ${htmlBody}
                </div>
            </section>
            <br>
            <hr>
            <section class="footer content">
                <a href="https://github.com/VihaanVinoth" aria-label="Directs you to the VihaanVinoth GitHub page">
                    <img id="git-icon" src="https://cdn.vihaanvinoth.com/icons/github-icon.png" alt="Github Logo" loading="lazy">
                    <p>Github</p>
                </a>
                <p>&nbsp;&nbsp;</p>
                <a href="mailto:dalx900@gmail.com" aria-label="Send a mail to dalx900@gmail.com (Vihaan)">
                    <svg class="mail-icon-add" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                        loading="lazy" width="20px" fill="#FFFFFF">
                        <path
                            d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
                    </svg>
                    <p>Contact</p>
                </a>
                <p id="footer-reserved">&copy; <span id="year"></span> Made with 🌶️ by Vihaan Vinoth.</p>
            </section>
        </main>
        <script type="application/ld+json">
            {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Vihaan Vinoth",
            "url": "https://vihaanvinoth.com",
            "jobTitle": "Full-Stack Developer",
            "sameAs": [
                "https://github.com/VihaanVinoth"
            ]
            }
        </script>
        <script>
            document.getElementById("year").innerHTML = new Date().getFullYear();
        </script>
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

  postsIndex.push({
    title,
    summary,
    cover,
    slug,
    url: `/posts/${slug}`,
    date: dateNow,
    displayDate: date,
    readingTime: mins,
    tags,
  });
}

postsIndex.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(indexFile, JSON.stringify(postsIndex, null, 2));

console.log(`Built ${outDir}`);
