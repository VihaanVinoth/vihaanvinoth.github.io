const PostPreview = ({ entry, widgetFor }) => {
  const wpm = 225;

  const body = entry.getIn(["data", "body"]) || "";
  const words = body.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / wpm));

  const title = entry.getIn(["data", "title"]) || "";
  const summary = entry.getIn(["data", "description"]) || "";
  const cover = entry.getIn(["data", "cover"]);

  const dateNow = entry.getIn(["data", "date"]);
  const date = dateNow
    ? new Date(dateNow).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  //   const dateFormat = new Intl.DateTimeFormat("en-GB", options).format(dateNow);

  //   const parts = dateFormat.split(" ");

  //   const date = entry.getIn([`${parts[0].replace(",", "")} ${parts[1]}, ${parts[2]}` || ""]);

  return (
    <main className="content" id="mainContent">
      <section className="article content">
        {cover && <img className="cover" src={cover} />}
        <div className="cover-blur"></div>
        <div className="article-text">
          {date && (
            <time>
              {date} · Vihaan Vinoth · {mins} min read
            </time>
          )}
          {summary && <p className="summary">{summary}</p>}
          <header>
            <h1 id="article-title">{title}</h1>
          </header>
          {widgetFor("body")}
        </div>
      </section>
      <hr />
      <section className="footer content">
        <a href="https://github.com/VihaanVinoth">
          <img id="git-icon" src="../icons/github-icon.png" loading="lazy" />
          <p>Github</p>
        </a>
        <p>&nbsp;&nbsp;</p>
        <a href="mailto:dalx900@gmail.com">
          <svg
            className="mail-icon-add"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            loading="lazy"
            width="20px"
            fill="#FFFFFF"
          >
            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
          </svg>
          <p>Contact</p>
        </a>
        <p id="footer-reserved">©2025 Made with 🌶️ by Vihaan Vinoth.</p>
      </section>
    </main>
  );
};

CMS.registerPreviewStyle("../stylesheets/reset.css");
CMS.registerPreviewStyle("../stylesheets/style.css");

CMS.registerPreviewTemplate("posts", PostPreview);
