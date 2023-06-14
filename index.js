const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://github.com/trending/javascript");

  const repos = await page.$$eval(".Box-row", (rows) => {
    return rows.map((row) => {
      const title = row.querySelector("h2").innerText.trim();
      const link = row.querySelector("h2 a").getAttribute("href");
      const stars = row.querySelector(".Link--muted").innerText.trim();
      const built = row.querySelector("img").getAttribute("alt");

      return { title, link, stars, built };
    });
  });

  await browser.close();

  const generateHTML = (repos) => {
    const rows = repos.map((repo) => {
      return `<tr>
                <td>${repo.title}</td>
                <td>${repo.link}</td>
                <td>${repo.stars}</td>
                <td>${repo.built}</td>
              </tr>`;
    });

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Simple scrapping</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css"/>
        </head>
        <body class="d-flex justify-content-center align-items-center">
          <table class="table table-striped table-hover m-5">
            <thead class="thead-dark">
              <tr>
                <th>Title</th>
                <th>Link</th>
                <th>Stars</th>
                <th>Built</th>
              </tr>
            </thead>
            <tbody>
              ${rows.join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const htmlContent = generateHTML(repos);

  fs.writeFile("index.html", htmlContent, (err) => {
    if (err) {
      return;
    }
  });
})();
