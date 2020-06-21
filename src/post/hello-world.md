---
title: Hello, World
date: 2020-06-21
tags: post
layout: layouts/post.liquid
---

Had a good run using Medium as my blogging platform. It served as my "google doc," a web-based document editor with automatic content uploads, and my content-management system, publishing drafts that correspond one-to-one in appearance with the published form. Medium was seemingly optimized for a reader-writer experience, including clean out-of-the-box styling, draft-sharing, and gist and other code-sharing embeds. Some of these features remain. However, over the last year, the reader-writer experience began to deteriorate. Now, draft sharing is login-gated. Content recommendation surfaces click-bait'y titles instead of interest areas (e.g. software). Finally, anchor tags break ostensibly because of "become a member" prompts in the page header, the anvil that broke this camel's back. 

So, I've moved to a self-managed website.

## Theme

The primary colors, link interactions and list layout were adapted from [this beautifully simple blog](https://tonsky.me/) by [Niki Tonsky](https://twitter.com/nikitonsky). The serif font and sans-serif title combination was inspired by [Medium](https://medium.com). The purple and gold colors that can be seen in the "Software for Days" badge and elsewhere are the championship colors of [Los Angeles Lakers Purple and Gold](https://teamcolorcodes.com/los-angeles-lakers-color-codes/).   

## Build Tech

This site is statically generated; each page of HTML, including this one, is generated from sources files at build time, in advance of any request for this page.

Posts are written in markdown and converted to HTML using [markdown-it](https://github.com/markdown-it/markdown-it) in combination with the templating engine [liquidjs](https://liquidjs.com/). This post, for example, currently looks like this, as I write: 

```md
---
title: Hello, World
date: 2020-06-21
tags: post
layout: layouts/post.liquid
---

Had a good run using Medium as my blogging platform. It served as my "google doc," a web-based document editor with automatic content uploads, and my content-management system, publishing drafts that correspond one-to-one in appearance with the published form. Medium was seemingly optimized for a reader-writer experience, including clean out-of-the-box styling, draft-sharing, and gist and other code-sharing embeds. Some of these features remain. However, over the last year, the reader-writer experience began to deteriorate. Now, draft sharing is login-gated. Content recommendation surfaces click-bait'y titles instead of interest areas (e.g. software). Finally, anchor tags break ostensibly because of "become a member" prompts in the page header, the anvil that broke this camel's back. 

So, I've moved to a self-managed website.

## Theme

The primary colors, link interactions and list layout were adapted from [this beautifully simple blog](https://tonsky.me/) by [Niki Tonsky](https://twitter.com/nikitonsky). The serif font and sans-serif title combination was inspired by [Medium](https://medium.com). The purple and gold colors that can be seen in the "Software for Days" badge and elsewhere are the championship colors of [Los Angeles Lakers Purple and Gold](https://teamcolorcodes.com/los-angeles-lakers-color-codes/).   

## Build Tech

This site is statically generated; each page of HTML, including this one, is generated from sources files at build time, in advance of any request for this page.

Posts are written in markdown and converted to HTML using [markdown-it](https://github.com/markdown-it/markdown-it) in combination with the templating engine [liquidjs](https://liquidjs.com/). This post, for example, currently looks like this as I write
```
<figcaption>Partial source of the generated HTML file that you are currently viewing <span class="emoji">&#128563;</span></figcaption>

`markdown-it` converts the above markdown file into HTML. `liquidjs` is directed by the XML header at the top of such file to embed the generated HTML file inside `layouts/post.liquid` template,

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
resulting in the page of HTML you are viewing.

This process is orchestrated by [llty](https://www.11ty.dev/), a "a simpler static site generator," as advertised. In the root of my blog directory, the command `yarn eleventy serve` tells `eleventy` to read this config file

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
 and generate a static site
 
 <img src="/media/static-site.png"/>
 
 You may notice in the above config file that `markdown-it` manifests ultimately as a plugin into `eleventy`'s build; `liquidjs` isn't mentioned explicitly only because it is used by `eleventy` by default. 
 
 Additional technologies plugged into the `eleventy` build:
  1. [@11ty/eleventy-plugin-syntaxhighlight](https://github.com/11ty/eleventy-plugin-syntaxhighlight) converts code blocks into semantic HTML that is compatible with [prismjs](https://prismjs.com/) css. As a result, the syntax-highlighting-ready HTML you see above is generated at build time.
  
  1. Automatic anchor tag generation with [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor).
  
  1. And my personal favorite, automatic footnote anchor tag generation with [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote).[^1]
  
 
  
  The complete repository can be found [on github](https://github.com/jbmilgrom/blogg).
  
## Medium Migration Tech

The migration off of Medium was kick-started by [mediumexporter](https://github.com/xdamman/mediumexporter), which downloads and converts Medium HTML into markdown.

## Deploy/Hosting Tech

Wow this was easier than expected. With [netlify](https://www.netlify.com/), I have continuous integration, despite no configuration or set up. I'm not exaggerating when I say it was as easy as signing up, connecting my github account, selecting a specific repo (in this case, [blogg](https://github.com/jbmilgrom/blogg)), and... that's it. A [domain](https://happy-dijkstra-744386.netlify.app/) was automatically generated. Now, all changes pushed to `blogg` result in a fresh build and automatic deploy. [GitHub Pages](https://pages.github.com/) provides something similar. However, I would've had to create two repositories, one for my source files and one for the generated site, and manually copy files from one to the other. Not the worst thing in the world. However, with netlify, I also get SSL certificate and domain name management for free and analytics for a monthly fee.

## How I Feel Now

Great.

Medium does (did?) a great job at providing managed-blog services. However, it goes without saying that no finite *product* can serve the idiosyncratic needs of one person better than that person. Ultimately, the deterioration in Medium's services forced what would always have been an beneficial move. I now have complete control over the development, presentation and distribution of my content - if Lakers colors aren't enough, well there's always automatic footnote generation with bi-directional anchor tag navigation for the obvious win.

  [^1]: How cool is this? I get footnote generation and bi-directional anchor tag navigation from just this markdown:
    
    ```md
      - and my personal favorite, automatic footnote anchor tag generation with [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)[^1]
      [^1]: How cool is this? I get footnote generation and bi-directional anchor tag navigation form just this markdown...
    ``` 