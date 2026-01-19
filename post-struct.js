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

  const desktopSlot = "6016588243";
  const mobileSlot = "8339499258";

  const inArticleAd = `
  <div class="ad ad-in-article ad-desktop">
    <ins class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-8253398098387796"
      data-ad-slot="${desktopSlot}"
      data-ad-format="fluid"
      data-ad-layout="in-article">
    </ins>
  </div>
  `

  const mobileinArticleAd = `
  <div class="ad ad-in-article ad-mobile">
    <ins class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-8253398098387796"
      data-ad-slot="${mobileSlot}"
      data-ad-format="fluid"
      data-ad-layout="in-article">
    </ins>
  </div>
  `

  const mdContent = fs.readFileSync(path.join(postsDir, file), "utf-8");

  const { data, content } = matter(mdContent);

  let htmlBody = md.render(content);

  const paragraphs = htmlBody.split("</p>");

  if (paragraphs.length > 3) paragraphs.splice(3, 0, inArticleAd);
  if (paragraphs.length > 4) paragraphs.splice(4, 0, mobileinArticleAd);

  htmlBody = paragraphs
    .slice(0, 2).join("</p>") +
    inArticleAd +
    mobileinArticleAd +
    paragraphs.slice(2).join("</p>");  

  const slug = path.basename(file, ".md");

  const wpm = 225;
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / wpm));

  const rawTags = data.tags ?? [];

  const tags = Array.isArray(rawTags)
    ? rawTags.map((t) => String(t).toLowerCase().trim())
    : String(rawTags)
        .split(",")
        .map((t) => t.toLowerCase().trim())
        .filter(Boolean);

  const title = data.title ?? slug;
  const summary = data.description ?? "";

  let cover = data.cover ?? null;

  if (typeof cover === "object" && cover !== null) {
    cover = cover.image || cover.path || null;
  }

  if (Array.isArray(cover)) {
    cover = cover[0] || null;
  }

  if (
    cover &&
    !cover.startsWith("/") &&
    !cover.startsWith("http://") &&
    !cover.startsWith("https://")
  ) {
    cover = "/" + cover;
  }

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
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            body,
            html {
                font-family: var(--sans-font);
                color: var(--text);
                scroll-behavior: smooth;
            }

            body {
                background: var(--bg);
                overflow-x: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
                -webkit-font-smoothing: antialiased;
                text-rendering: optimizeLegibility;
            }

            header {
                width: 100%;
                display: flex;
                justify-content: center;
            }

            header nav {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 20px;
                font-family: var(--mono-font);
                font-size: 12px;
                white-space: nowrap;
            }

            .navlinks {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }

            .navlinks li {
                list-style-type: none;
            }

            .navlinks a {
                color: var(--text);
                text-decoration: none;
                white-space: nowrap;
                transition: all 250ms;
            }

            .navlinks a:hover {
                text-decoration: dotted underline darkslategray;
            }

            .navlinks li:not(:last-child)::after {
                content: "/";
                margin-left: 10px;
            }

            section.hero {
                padding-top: 1rem;
                padding-bottom: 2rem;
            }

            section.hero h1 {
                font-size: 1.8rem;
                line-height: 1.2;
            }

            section.hero p {
                margin-top: 0.75rem;
            }

            .project-box,
            .project-img {
                width: 100%;
                border-radius: 5px;
                object-fit: cover;
                object-position: center;
                aspect-ratio: 3 / 2;
            }

            .projects {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                color: var(--text);
                min-height: 100vh;
            }

            img {
                max-width: 100%;
                height: auto;
            }

            #theme-toggle {
                border: var(--bg-toggle-border);
                background: var(--bg-toggle);
                border-radius: 5px;
                padding: 5px 5px;
                color: var(--text);
                width: 30px;
                position: absolute;
                top: 15px;
                right: 20px;
                cursor: pointer;
            }

            #theme-toggle-icon {
                filter: var(--icon-filter);
            }

            ::selection {
                background: var(--text);
                color: var(--selection-text-color);
            }

            @media (max-width: 767px) {
                .projects {
                    grid-template-columns: 1fr;
                }

                main {
                    max-width: 100%;
                    border: none;
                }

                .navlinks {
                    flex-wrap: wrap;
                    justify-content: center;
                }
            }
        </style>
        <link rel="preload" href="/stylesheets/style.css?v=3.4" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <noscript><link rel="stylesheet" href="/stylesheets/style.css?v=3.4"></noscript>
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
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" as="style"
            href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Roboto+Mono:wght@100..700&display=swap"
            onload="this.onload=null;this.rel='stylesheet'">
        <noscript>
            <link rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Roboto+Mono:wght@100..700&display=swap">
        </noscript>
        <meta name="theme-color" content="#ffffff">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8253398098387796" crossorigin="anonymous"></script>
        <style>
        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }

        @media (prefers-reduced-motion: no-preference) {
            html {
                interpolate-size: allow-keywords;
            }
        }

        body {
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }

        img,
        picture,
        video,
        canvas,
        svg {
            display: block;
            max-width: 100%;
        }

        input,
        button,
        textarea,
        select {
            font: inherit;
        }

        p,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            overflow-wrap: break-word;
        }

        p {
            text-wrap: pretty;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            text-wrap: balance;
        }

        #root,
        #__next {
            isolation: isolate;
        }
    </style>
    </head>
    <body>
        <main class="content" id="mainContent">
            <a href="../index.html" id="logo" width="50" height="59" aria-label="Redirects back to main site">
                <picture>
                    <source srcset="
                        https://cdn.vihaanvinoth.com/VVNormal-50x59.webp 1x,
                        https://cdn.vihaanvinoth.com/VVNormal-100x118.webp 2x
                    " type="image/webp">
                    <img src="https://cdn.vihaanvinoth.com/VVNormal.webp" alt="Vihaan Vinoth Logo" loading="eager"
                        fetchpriority="high" width="50" height="59">
                </picture>
            </a>
            <nav>
                <ul class="navlinks">
                    <li><a href="https://vihaanvinoth.com" aria-label="Redirects back to home">Home</a></li>
                    <li><a href="https://vihaanvinoth.com/#about-me" aria-label="Takes you to about me section">About Me</a></li>
                    <li><a href="https://vihaanvinoth.com/#projects" aria-label="Takes you to projects section" >Projects</a></li>
                    <li><a href="https://vihaanvinoth.com/#contact" aria-label="Takes you to contact section" >Contact</a></li>
                    <li><a href="https://vihaanvinoth.com/blog" aria-label="Takes you to blog page" >Blog</a></li>
                </ul>
            </nav>
            <br>
            <br>
            <button class="content" id="theme-toggle" aria-label="Toggle theme">
                <img id="theme-toggle-icon" src="https://cdn.vihaanvinoth.com/icons/light-mode-icon.svg" width="18" height="18" loading="eager" alt="Theme toggle icon" fetchpriority="high">
            </button>
            <section class="article content">
                ${cover ? `<img class="cover" width="457" height="257" src="${cover}">` : ""}
                <div class="cover-blur"></div>
                <div class="article-text">
                    <br>
                    <br>
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li>
                            <a href="https://vihaanvinoth.com" aria-label="Takes you to Vihaan Vinoth page">Home</a>
                            </li>
                            >
                            <li> 
                            <a href="https://vihaanvinoth.com/blog" aria-label="Takes you to Blog page">Blog</a>
                            </li>
                            >
                            <li>
                            ${title}
                            </li>
                        </ol>
                    </nav>
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
                    <img id="git-icon" width="20" height="20" src="https://cdn.vihaanvinoth.com/icons/github-icon.png" alt="Github Logo" loading="lazy">
                    <p>Github</p>
                </a>
                <p>&nbsp;&nbsp;</p>
                <a href="mailto:dalx900@gmail.com" aria-label="Send a mail to dalx900@gmail.com (Vihaan)">
                    <svg class="mail-icon-add" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"
                        loading="lazy" width="20px" fill="#FFFFFF">
                        <path
                            d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
                    </svg>
                    <p>Contact</p>
                </a>
                <p id="footer-reserved">&copy; <span id="year"></span> Made with 🌶️ by Vihaan Vinoth. <a href="https://vihaanvinoth.com/privacy">Privacy Policy</a></p>
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
            window.addEventListener("load", () => {
                document.querySelectorAll(".adsbygoogle").forEach(ad => {
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {}
                });
            });         
        </script>
        <script>
            document.getElementById("year").innerHTML = new Date().getFullYear();
        </script>
        <script type="text/javascript" defer>
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

        <script async type="text/javascript" src="https://s.skimresources.com/js/297470X1784957.skimlinks.js"></script>
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
