const { DateTime } = require("luxon");
const fs = require("fs");
const path = require("path");

const isDev = process.env.APP_ENV === "development";

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const manifestPath = path.resolve(__dirname, "dist", "assets", "manifest.json");
const manifest = isDev
  ? {
      "main.js": "/assets/index.js",
      "main.css": "/assets/index.css",
      "search.js": "/assets/search.js",
    }
  : JSON.parse(fs.readFileSync(manifestPath, { encoding: "utf8" }));

module.exports = function(eleventyConfig) {
  // Add layout alias
  eleventyConfig.addLayoutAlias("base", "base.njk");
  eleventyConfig.addLayoutAlias("blog", "blog.njk");
  eleventyConfig.addLayoutAlias("post", "post.njk");
  eleventyConfig.addLayoutAlias("gimlet-cli", "gimlet-cli.njk");
  eleventyConfig.addLayoutAlias("docs", "docs.njk");

  // Add a shortcode for bundled CSS.
  eleventyConfig.addShortcode("bundledCss", function() {
    return manifest["main.css"]
      ? `<link href="${manifest["main.css"]}" rel="stylesheet" />`
      : "";
  });

  // Add a shortcode for bundled JS.
  eleventyConfig.addShortcode("bundledJs", function() {
    return manifest["main.js"]
      ? `<script src="${manifest["main.js"]}"></script>`
      : "";
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Copy static files directly to output.
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // Reload the page every time any JS/CSS files change.
  eleventyConfig.setBrowserSyncConfig({ files: [manifestPath] });

  eleventyConfig.addNunjucksFilter("format", function(value) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return value.toLocaleDateString('en-US', options);
  });

  eleventyConfig.addPlugin(syntaxHighlight);

  const markdownIt = require("markdown-it");
  const markdownItAnchor = require("markdown-it-anchor");
  const markdownLib = markdownIt({ html: true }).use(markdownItAnchor);
  eleventyConfig.setLibrary("md", markdownLib);

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
    },
    passthroughFileCopy: true
  };
};
