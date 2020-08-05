const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItTOC = require("markdown-it-toc-done-right");

const sourceDirectory = "src";
const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

md
  .use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#",
  })
  .use(markdownItFootnote)
  .use(markdownItTOC, {listType: "ol", containerId: "toc"});

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy(`${sourceDirectory}/media`);
  eleventyConfig.addPassthroughCopy(`${sourceDirectory}/css`);

  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.setLibrary("md", md);

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],
    dir: {
      input: sourceDirectory,
    },
  };
};
