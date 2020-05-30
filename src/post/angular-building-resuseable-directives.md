---
title: 'AngularJS 1.x: Building Reusable Directives'
date: 2015-06-23
tags: post
layout: layouts/post.liquid
---
The Power of Angular

Angular offers many benefits to developers building complex web applications. Expressive HTML, model and view syncing and dependency injection are a few of the most powerful. But the true power of Angular comes from the whole being greater than the sum of its parts. This is something that is difficult to relay in its entirety through a blog post or a single example (and difficult to grasp period!). Like with all programming languages or deeply thoughtful frameworks, an understanding of best practices is probably best teased out through experience solving real problems and maintaining real code. Nonetheless, I think the best place to begin digging is reusable directives: Angular provides the developer the unique ability to underwrite simple, elegant and importantly, reusable components around which maintainable domain specific applications can come into shape. There, much of Angular’s power comes into focus. And with the release of Angular 2 on the horizon, there’s no better time to write reusable directives (component-based directives anyone?). So let’s begin!

## nullifyModel

Client-side web applications often must expressly nullify “falsey” form data to correctly interact with a server-side API and effect the desired change to the database. Repeating such type conversion logic with every form would unnecessarily grow the code base, obscure the logic actually unique to each form and clearly violate the D.R.Y. (Don’t Repeat Yourself) principle. One solution might be to place such logic in a service and inject it into every controller or link function corresponding to the desired form. This is a fine solution that avoids repetition by ushering the logic into one place. However, this would require **$watch**ing each model of interest for any “falsey” value in order to expressly nullify the model upon such an event. This feels unnecessarily heavy handed. Why watch the model for all changes when the work that needs to be performed must happen only upon a prescribed and limited set of events (i.e. “falsey”ness)? Not to worry; with Angular, you can do one better. The ng-model controller API together with Angular’s powerful directive API allow you to cabin the logic in its proper place, avoid adding the unnecessary $watch and, ultimately, make your HTML come to life.

Here’s what the HTML consuming the directive might look like:

<iframe src="https://medium.com/media/3fb9540d2cfd9db7fd2e33cb4befcbb2" frameborder=0></iframe>

Notice how the interface is exceedingly simple. Type ‘nullify-model’ (13 characters by my count) into any input tag, even one that’s already part of another custom form component, and any “falsey” value will be translated to ‘null’ for correct server-side processing. And the HTML is expressive! The behavior added to the input tag can be easily surmised from the attribute aptly named “nullifyModel”. Now, looking under the hood at the directive’s implementation:

<iframe src="https://medium.com/media/ae58dad0f3340fdaffda41149d8e7f5c" frameborder=0></iframe>

Notice that I’ve moved the nullify logic into a separate filter so it’s accessible/reusable elsewhere throughout the application if necessary:

<iframe src="https://medium.com/media/d945fe240142636cc286514a315a6566" frameborder=0></iframe>

Ahhhh… so easy to read and so simple! All values inputted into the input element by a user will be **$parse**d for “falsey” values and converted expressly to null. Ng-model controller’s $parse method runs the ‘nullify’ filter *prior to *assigning any *return value* to the model. As a result, the model may never reference a “falsey” value and no longer needs to be **$watch**ed for such an event. Dependency injection allows the nullify logic to be what it is — a filter replacing one value with another — and only injected when needed, in this case, into the ‘nullifyModel’ directive. The true “trick”, however, is that all of Angular’s power is on display. Data and view syncing, dependency injection and the Angular directive API allow for expressive HTML and the creation of a (hopefully!) reusable directive.

Quotes of the Day:
> Writing software as multiple layers is a powerful technique even within applications. Bottom-up programming means writing a program as a series of layers, each of which serves as a language for the one above. This approach tends to yield smaller, more flexible programs. It’s also the best route to that holy grail, reusability. A language is by definition reusable. The more of your application you can push down into a language for writing that type of application, the more of your software will be reusable. — [Paul Graham](http://www.paulgraham.com/hundred.html)
> Code is inert. How do you make it ert? You run software that transforms it into machine language. The word “language” is a little ambitious here, given that you can make a computing device with wood and marbles. Your goal is to turn your code into an explicit list of instructions that can be carried out by interconnected logic gates, thus turning your code into something that can be executed — software. — [Paul Ford](http://www.bloomberg.com/graphics/2015-paul-ford-what-is-code/)
Done in 1.11s.
