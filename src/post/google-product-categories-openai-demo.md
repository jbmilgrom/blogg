---
title: Using OpenAI Model gpt-3.5-turbo and Google Product Categories to Classify Websites
date: 2023-04-30
tags: post
layout: layouts/post.liquid
---

[Application](https://google-product-categories.herokuapp.com/url) | [Code](https://github.com/jbmilgrom/google-product-categories-openai)

Starting with a URL, the application retrieves an html document, parses out metadata and categorizes the corresponding website according to the Google Product Categories [Taxonomy](https://www.google.com/basepages/producttype/taxonomy.en-US.txt) (GPCs). Its aim is to produce structured data like [`"Apparel & Accessories" > "Clothing" > "Shirts & Tops"`](https://google-product-categories.herokuapp.com/traverse?path=Apparel%20%26%20Accessories_Clothing_Shirts%20%26%20Tops);[^1] hullicinations or websites that do not map onto one of the [5595 GPCs](https://google-product-categories.herokuapp.com/gpc-stats) should result in `null`.[^2] It has shown to be shockingly accurate in my testing, both at associating accurate GPCs when appropriate and none when not.

## Supported Models
The application supports a selection of chat and completion models below gpt-4, eventhough it has been optimized for the chat models (and `gpt-3.5-turbo` in particular) that are [1/10 the cost](https://platform.openai.com/docs/guides/chat/chat-vs-completions) of similar completion models like `text-davinci-003`. 

## The Algorithm 
The GPC taxonomy is a tree. There are [21 root sibling nodes](https://google-product-categories.herokuapp.com/traverse) (`"Animals & Pet Supplies"`, `"Apparel & Accessories"`, ..., `"Vehicles & Parts"`). Each category may have sub-categories, and each sub-category additional sub-categories, etc. The application produces a final GPC through a series of multiple choice questions sent to OpenAI, where each question corresponds to a level in the tree and the path taken is directed by OpenAI; the children of the answer to the multiple-choice question to OpenAI dictate the next multiple-choice question. For example, a prompt-generater[^3]

```ts
export const generateChatPrompt = (choices: string[], metaTags: string): ChatCompletionRequestMessage[] => [
  {
    role: "system",
    content:
      'You are a multiple-choice test taker. You may select one of the choices that best apply. Please respond with "None of the Above" if none are relevant.',
  },
  {
    role: "user",
    content: `
    Question: Which product category best describes the metadata?

    metadata:
    <meta name="description" content="Buy Kitchen Torch,Cooking Propane Blow Torch Lighter,700,000BTU Flamethrower Fire Gun,Food Culinary Torch with Safety Lock,Campfire Starter Grill Torch,BBQ Torch for Steak &amp; Creme Brulee: Cooking Torches - Amazon.com ✓ FREE DELIVERY possible on eligible purchases">
    <meta name="title" content="Amazon.com: Kitchen Torch,Cooking Propane Blow Torch Lighter,700,000BTU Flamethrower Fire Gun,Food Culinary Torch with Safety Lock,Campfire Starter Grill Torch,BBQ Torch for Steak &amp; Creme Brulee : Home &amp; Kitchen">

    choices: 1) Bathroom Accessories; 2) Business & Home Security; 3) Decor, Emergency Preparedness; 4) Fireplace & Wood Stove Accessories; 5) Fireplaces, Flood, Fire & Gas Safety; 6) Household Appliance Accessories; 7) Household Appliances; 8) Household Supplies; 9) Kitchen & Dining; 10) Lawn & Garden, Lighting; 11) Lighting Accessories; 12) Linens & Bedding; 13) Parasols & Rain Umbrellas; 14) Plants, Pool & Spa; 15) Smoking Accessories; 16) Umbrella Sleeves & Cases; 17) Wood Stoves
  `,
  },
  { role: "assistant", content: "9) Kitchen & Dining" },
  {
    role: "user",
    content: `
    Question: Which product category best describes the metadata?
    metadata:
    ${metaTags}
    choices: \n\t${choices.map((choice, i) => `${i + 1}) ${choice}`).join("\n\t")}
  `,
  },
];
```
that is fed scraped metadata

```html
<meta name="description" content="The Men’s Pocket Tee. is the latest fit in your lineup of essentials. This supersoft, washed-and-worn basic fits&nbsp;generously through the body with a&nbsp;pocket detail&nbsp;that naturally torques like your favorite vintage tee. Handcrafted locally in L.A., this tee is designed to get (even) more character with age&nbsp;and&nbsp;wear. 50% P">
<meta property="og:title" content="The Men's Pocket Tee. -- Heather Grey">
<meta property="og:description" content="The Men’s Pocket Tee. is the latest fit in your lineup of essentials. This supersoft, washed-and-worn basic fits&nbsp;generously through the body with a&nbsp;pocket detail&nbsp;that naturally torques like your favorite vintage tee. Handcrafted locally in L.A., this tee is designed to get (even) more character with age&nbsp;and&nbsp;wear. 50% Polyester, 38% Cotton, 12% Rayon  Machine Wash Cold, Tumble Dry Low&nbsp; Made in the U.S.A.">

```
and a set of choices

```ts
["Animals & Pet Supplies", "Apparel & Accessories", "Arts & Entertainment", "Baby & Toddler", "Business & Industrial", "Cameras & Optics", "Electronics", "Food,  Beverages & Tobacco", "Furniture", "Hardware", "Health & Beauty", "Home & Garden", "Luggage & Bags", "Mature", "Media", "Office Supplies", "Religious & Ceremonial", "Software", "Sporting Goods", "Toys & Games", "Vehicles & Parts"]
```
can prompt OpenAI with

```html
system: You are a multiple-choice test taker. You may select one of the choices that best apply. Please respond with "None of the Above" if none are relevant.

user: 
    Question: Which product category best describes the metadata?

    metadata:
    <meta name="description" content="Buy Kitchen Torch,Cooking Propane Blow Torch Lighter,700,000BTU Flamethrower Fire Gun,Food Culinary Torch with Safety Lock,Campfire Starter Grill Torch,BBQ Torch for Steak &amp; Creme Brulee: Cooking Torches - Amazon.com ✓ FREE DELIVERY possible on eligible purchases">
    <meta name="title" content="Amazon.com: Kitchen Torch,Cooking Propane Blow Torch Lighter,700,000BTU Flamethrower Fire Gun,Food Culinary Torch with Safety Lock,Campfire Starter Grill Torch,BBQ Torch for Steak &amp; Creme Brulee : Home &amp; Kitchen">

    choices: 1) Bathroom Accessories; 2) Business & Home Security; 3) Decor, Emergency Preparedness; 4) Fireplace & Wood Stove Accessories; 5) Fireplaces, Flood, Fire & Gas Safety; 6) Household Appliance Accessories; 7) Household Appliances; 8) Household Supplies; 9) Kitchen & Dining; 10) Lawn & Garden, Lighting; 11) Lighting Accessories; 12) Linens & Bedding; 13) Parasols & Rain Umbrellas; 14) Plants, Pool & Spa; 15) Smoking Accessories; 16) Umbrella Sleeves & Cases; 17) Wood Stoves

assistant: 9) Kitchen & Dining

user: 
    Question: Which product category best describes the metadata?

    metadata:
    <meta name="description" content="The Men’s Pocket Tee. is the latest fit in your lineup of essentials. This supersoft, washed-and-worn basic fits&nbsp;generously through the body with a&nbsp;pocket detail&nbsp;that naturally torques like your favorite vintage tee. Handcrafted locally in L.A., this tee is designed to get (even) more character with age&nbsp;and&nbsp;wear. 50% P">
    <meta property="og:title" content="The Men's Pocket Tee. -- Heather Grey">
    <meta property="og:description" content="The Men’s Pocket Tee. is the latest fit in your lineup of essentials. This supersoft, washed-and-worn basic fits&nbsp;generously through the body with a&nbsp;pocket detail&nbsp;that naturally torques like your favorite vintage tee. Handcrafted locally in L.A., this tee is designed to get (even) more character with age&nbsp;and&nbsp;wear. 50% Polyester, 38% Cotton, 12% Rayon  Machine Wash Cold, Tumble Dry Low&nbsp; Made in the U.S.A.">

    choices: 1) Animals & Pet Supplies; 2) Apparel & Accessories; 3) Arts & Entertainment; 4) Baby & Toddler; 5) Business & Industrial; 6) Cameras & Optics; 7) Electronics; 8) Food, Beverages & Tobacco; 9) Furniture; 10) Hardware; 11) Health & Beauty; 12) Home & Garden; 13) Luggage & Bags; 14) Mature; 15) Media; 16) Office Supplies; 17) Religious & Ceremonial; 18) Software; 19) Sporting Goods; 20) Toys & Games; 21) Vehicles & Parts
```
to encourage a response like
```text
2) Apparel & Accessories
```
that can deterministically[^4] be parsed into `"Apparel & Accessories"`, a GPC that correctly identifies the website category at that level in the tree.

The children of the `"Apparel & Accessories"` make-up the next prompt,

```html
system: You are a multiple-choice test taker. You may select one of the choices that best apply. Please respond with "None of the Above" if none are relevant.

user: 
    Question: Which product category best describes the metadata?

    metadata:
    <meta name="description" content="Buy Kitchen Torch,Cooking Propane Blow Torch Lighter,700,000BTU Flamethrower Fire Gun,Food Culinary Torch with Safety Lock,Campfire Starter Grill Torch,BBQ Torch for Steak &amp; Creme Brulee: Cooking Torches - Amazon.com ✓ FREE DELIVERY possible on eligible purchases">
    <meta name="title" content="Amazon.com: Kitchen Torch,Cooking Propane Blow Torch Lighter,700,000BTU Flamethrower Fire Gun,Food Culinary Torch with Safety Lock,Campfire Starter Grill Torch,BBQ Torch for Steak &amp; Creme Brulee : Home &amp; Kitchen">

    choices: 1) Bathroom Accessories; 2) Business & Home Security; 3) Decor, Emergency Preparedness; 4) Fireplace & Wood Stove Accessories; 5) Fireplaces, Flood, Fire & Gas Safety; 6) Household Appliance Accessories; 7) Household Appliances; 8) Household Supplies; 9) Kitchen & Dining; 10) Lawn & Garden, Lighting; 11) Lighting Accessories; 12) Linens & Bedding; 13) Parasols & Rain Umbrellas; 14) Plants, Pool & Spa; 15) Smoking Accessories; 16) Umbrella Sleeves & Cases; 17) Wood Stoves

assistant: 9) Kitchen & Dining

user: 
    Question: Which product category best describes the metadata?

    metadata:
    <meta name="description" content="The Men’s Pocket Tee. is the latest fit in your lineup of essentials. This supersoft, washed-and-worn basic fits&nbsp;generously through the body with a&nbsp;pocket detail&nbsp;that naturally torques like your favorite vintage tee. Handcrafted locally in L.A., this tee is designed to get (even) more character with age&nbsp;and&nbsp;wear. 50% P">
    <meta property="og:title" content="The Men's Pocket Tee. -- Heather Grey">
    <meta property="og:description" content="The Men’s Pocket Tee. is the latest fit in your lineup of essentials. This supersoft, washed-and-worn basic fits&nbsp;generously through the body with a&nbsp;pocket detail&nbsp;that naturally torques like your favorite vintage tee. Handcrafted locally in L.A., this tee is designed to get (even) more character with age&nbsp;and&nbsp;wear. 50% Polyester, 38% Cotton, 12% Rayon  Machine Wash Cold, Tumble Dry Low&nbsp; Made in the U.S.A.">

    choices: 1) Clothing; 2) Clothing Accessories; 3) Costumes & Accessories; 4) Handbag & Wallet Accessories; 5) Handbags, Wallets & Cases; 6) Jewelry; 7) Shoe Accessories; 8) Shoes;
```
which can be retrieved [by descending the tree](https://google-product-categories.herokuapp.com/traverse?path=Apparel%20%26%20Accessories), and so and so forth until a leaf node is found.

## So What Just Happened? Prompt-Engineering I Think?
Note that the orchestration logic is provided by an ordinary programming runtime. There is no BabyAGI or some other LangChain application, whereby some traditional programming model is swapped out in favor of LLM control. Here, NodeJS[^5] remains in control and delegates a string classification to OpenAI just like it's calling out to any ol' HTTP service. There's a while-loop and a stack and a queue, all of that wholesome goodness commonly used for graph traversal and backtracking. Nevertheless and despite the best of intentions, the program is nondeterministic like any ol' ML application. Try to click on [this link](https://google-product-categories.herokuapp.com/url?url=https%3A%2F%2Fwww.nike.com%2Ft%2Fpegasus-40-womens-road-running-shoes-bF2QL9%2FDV3854-102&model=default) more than 5 times and get the same result each time.

## Exit Criteria & Correcting Mistakes
The NodeJS runtime descends the GPC tree until a leaf node is found. It can return happily in this case with the GPC. This gets us 90% of the way there. Can we do even better? A node may not be found for rare items for which the GPC taxonomy is absent a specific category. If not found, or a determination is made that GCP is the wrong overarching taxonomy for the page.  See [Ending Criteria](#ending-criteria) for more details.

## Final Thoughts
The orchestration is provided by an ordinary programming runtime, in this case NodeJS; There is no BabyAGI or some other LangChain application whereby the LLM replaces a programming runtime as the ultimate  

[^1]: For example, a [t-shirt](https://google-product-categories.herokuapp.com/url?url=https%3A%2F%2Fthisisthegreat.com%2Fcollections%2Fthe-great-man%2Fproducts%2Fthe-mens-pocket-tee-heather-grey&model=default).
[^2]: For example, a [news site](https://google-product-categories.herokuapp.com/url?url=https%3A%2F%2Fespn.com&model=default).
[^3]: This [prompt generator](https://github.com/jbmilgrom/google-product-categories-openai/blob/main/src/openai/index.ts#L89) comforms to the [chat-completion API](https://github.com/openai/openai-node/blob/master/api.ts#L31) of OpenAI's NodeJS client and uses the ["few shot"](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/#few-shot) technique. Notice how a final `{role: "assistant", ...}` object is, in a sense, left off of the end of the prompt array, since the underlying LLM plays the role of "assistant" and should fill-in (i.e. complete!) this value as its response.
[^4]: By slicing off a space-delimited prefix.
[^5]: A garbage-collected, single-threaded, runtime with native async support via an event-loop on top of a CPU/Memory model with an intermediating OS, etc., etc. Please for the love of god, don't go away traditional programming model, you are so much fun!


