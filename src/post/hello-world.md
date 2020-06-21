---
title: Hello, World
date: 2020-06-21
tags: post
layout: layouts/post.liquid
---

Had a good run using Medium as my blogging platform. It served as my "google doc," a web-based document editor with automatic content uploads, and my content-management system, as the appearance of draft documents coincided one-to-one with the ultimate appearance in published form. Medium was clean, favoring an easy reading experience, provided draft-sharing, and supported gist and other code-sharing embeds. Some of these features remain. However, over the last year, the reader-writer experience began to deteriorate. Now, draft sharing is login-gated. Content recommendation surfaces click-bait'y titles instead of interest areas (e.g. software). Finally, anchor tags break ostensibly because of "become a member" prompts in the page header, the anvil that broke the camel's back. 

## Build Tech

So I've moved to a self-managed website. All posts are written in markdown and converted to HTML using [markdown-it](https://github.com/markdown-it/markdown-it) in combination with the templating engine [liquidjs](https://liquidjs.com/). This post, for example, currently looks like this as I write: 

```md
---
title: Hello, World
date: 2020-06-21
tags: post
layout: layouts/post.liquid
---

Had a good run using Medium as my blogging platform. It served as my "google doc," a web-based document editor with automatic content uploads, and my content-management system, as the appearance of draft documents coincided one-to-one with the ultimate appearance in published form. Medium was clean, favoring an easy reading experience, provided draft-sharing, and supported gist and other code-sharing embeds. Some of these features remain. However, over the last year, the reader-writer experience began to deteriorate. Now, draft sharing is login-gated. Content recommendation surfaces click-bait'y titles instead of interest areas (e.g. software). Finally, anchor tags break ostensibly because of "become a member" prompts in the page header, the anvil that broke the camel's back. 

## Build Tech

So I've moved to a self-managed website using some static site generation tools. All posts are written in markdown and converted to HTML using [markdown-it](https://github.com/markdown-it/markdown-it) in combination with the templating engine [liquidjs](https://liquidjs.com/). This post, for example, currently looks like this as I write
```
<figcaption>Partial source of the generated HTML file that you are currently viewing <span class="emoji">&#128563;</span></figcaption>

markdown-it converts this file into HTML; liquidjs is directed by the XML header to embed the HTML result inside `layouts/post.liquid` template.

```html
---
layout: layouts/layout.liquid
templateClass: post
---
{% raw  %}
<h1>{{ title }}</h1>

{{ content }}
{% endraw %}
<p class='footer'>
    <span class="badge"><a href="/">← Home</a></span>
</p>
```

This process is orchestrated provided by [llty](https://www.11ty.dev/), a "a simpler static site generator," as advertised. In the root of my blog directory, I type `yarn eleventy serve` and eleventy reads this config file

```js
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");

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
}).use(markdownItFootnote);

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
```
 to generate my static site
 
 <img src="/media/static-site.png"/>
 
 You may notice above that markdown-it manifests ultimately as plugin into eleventy's build config. liquidjs makes no appearance only because it is used by eleventy by default. 
 
 Additional technologies plugged into my eleventy build:
  1. [@11ty/eleventy-plugin-syntaxhighlight](https://github.com/11ty/eleventy-plugin-syntaxhighlight) converts code blocks into semantic HTML that is compatible with [prismjs](https://prismjs.com/) css. As a result, the syntax-highlighting-ready HTML you see above was generated at build time.
  
  1. Automatic anchor tag generation with [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor).
  
  1. And my personal favorite, automatic footnote anchor tag generation with [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote).[^1]
  
  1. Where would I be without [mediumexporter](https://github.com/xdamman/mediumexporter), which helped with the initial downlowd and conversion of Medium HTML into markdown.
  
  The complete repository can be found [on github](https://github.com/jbmilgrom/blogg).
  
## Theme

The primary colors, link interactions an list layout were inspired by (mostly, taken from) [this beautiful, simple blog](https://tonsky.me/) by [Niki Tonsky](https://twitter.com/nikitonsky). The serif font and sans-serif title combination was inspired by [Medium](https://medium.com). The purple and gold colors that can be seen in the "Software for Days" badge and elsewhere are the championship colors of [Los Angeles Lakers Purple and Gold](https://teamcolorcodes.com/los-angeles-lakers-color-codes/).   

## Deploy/Hosting Tech

Wow this was easier than expected. 

  [^1]: How cool is this? I get footnote generation and bi-directional anchor tag navigation from just this markdown
    
    ```md
      - and my personal favorite, automatic footnote anchor tag generation with [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)[^1]
      [^1]: How cool is this? I get footnote generation and bi-directional anchor tag navigation form just this markdown...
    ``` 