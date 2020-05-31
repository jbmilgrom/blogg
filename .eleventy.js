const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

const sourceDirectory = "src";
const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});
md.use(markdownItAnchor, {
  permalink: true,
  permalinkClass: "direct-link",
  permalinkSymbol: "#",
});

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy(`${sourceDirectory}/media`);
  eleventyConfig.addPassthroughCopy(`${sourceDirectory}/css`);

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.setLibrary("md", md);

  return {
    dir: {
      input: sourceDirectory,
    },
  };
};
