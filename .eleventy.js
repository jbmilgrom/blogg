const sourceDirectory = 'src';

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy(`${sourceDirectory}/img`);
  eleventyConfig.addPassthroughCopy(`${sourceDirectory}/css`);

  return {
    dir: {
      input: sourceDirectory
    }
  };
};