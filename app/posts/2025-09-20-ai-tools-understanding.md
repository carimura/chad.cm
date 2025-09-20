---
title: "Losing Touch with the Inner Workings"
date: 2025-09-20
type: post
template: post.html
active_nav: writing
excerpt: "As I use AI tools to solve time-consuming things, I find myself becoming less and less aware of how those things work under the hood."
---

As I use AI tools to solve time-consuming things, I find myself becoming less and less aware of how those things work under the hood. A simple example would be for maintaining our Inside.java site. I am an infrequent editor, so when I make changes, I forget the project details: required markdown fields, folder structure, special static site tags, etc. Now I never need to relearn, our AI tools can add posts faster than I can type `bundle exec jekyll serve` [1].

I suppose this is a good thing as I then can spend more time on higher leverage things, but it does raise a yellow flag given most of my career in tech has been in understanding the inner workings of things. But, I guess I haven't look at the kernal code, or my keyboard drivers, or the OS code, or Excel's code (nor do I have that), or anything else that has added layers of abstraction over the years.

Even this post itself, although 100% written by me (I just can't use AI tools to write for me, the style bothers me beyond belief), I asked an agent to go and find my blog in my projects tree and add the post. It's even using the static site generator I created myself. What a world.

What's next?


[1] Yes, we used Ruby to launch the site quickly back in 2020, but we have since created two new Java static site generators and ported the site over to one of them, to be deployed soon alongside some new other new stuff we're building.