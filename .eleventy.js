const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const sourceDirectory = "src";

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy(`${sourceDirectory}/img`);
  eleventyConfig.addPassthroughCopy(`${sourceDirectory}/css`);

  eleventyConfig.addPlugin(syntaxHighlight);

  return {
    dir: {
      input: sourceDirectory,
    },
  };
};
