import { readFileSync, writeFileSync } from "fs";
import { parse } from "marked";

const files = {
  "README.md": "index.html",
  "faq.md": "faq.html",
  "terms.md": "terms.html",
  "privacy.md": "privacy.html",
};

for (const file in files) {
  // Read Markdown file
  const markdown = readFileSync(file, "utf8");

  // Convert to HTML
  const content = parse(markdown);
  const title = file.replace(".md", "").replace(/_/g, " ").toUpperCase();

  // Add 'https://storage.googleapis.com/hide_vault_calculator_lock' prepend to all <a> href attributes and <img> src attributes using regexp
  const baseUrl = "https://storage.googleapis.com/hide_vault_calculator_lock/";
  const updatedContent = content
    .replace(/<a\s+[^>]*href="([^"]*)"/g, (match, href) => {
      if (!href.startsWith("http") && !href.startsWith("#")) {
        return match.replace(href, `${baseUrl}${href}`);
      }
      return match;
    })
    .replace(/<img\s+[^>]*src="([^"]*)"/g, (match, src) => {
      if (!src.startsWith("http")) {
        return match.replace(src, `${baseUrl}${src}`);
      }
      return match;
    });

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
    /* Your CSS here */
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
    pre { background: #f5f5f5; padding: 1rem; border-radius: 5px; }
    #container {max-width: 800px; margin: 0 auto; padding: 2rem; }
</style>
</head>
<body>
<div id="container">
${updatedContent}
</div>
</body>
</html>`;

  // Write to file
  writeFileSync(files[file], html);
}
