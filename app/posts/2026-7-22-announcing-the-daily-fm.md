---
title: "Announcing The Daily FM"
date: 2026-07-22
type: post
template: post.html
active_nav: writing
excerpt: I built it because I wanted a daily summary of the latest AI news sent to my podcast app, and then realized it was useful in summarizing a lot of other stuff too. Releasing it to see if anyone else thinks it's interesting.
---

I've been building a bunch of stuff, but [The Daily FM](https://thedaily.fm) has emerged as something I use a lot so I figured I'd release it to see if anyone else thought it was interesting. In short, I built it because I wanted a daily summary of the latest AI news sent to my podcast app and then realized it was useful in summarizing other stuff:

- Any blogs, websites, or X handles
- The top Hacker News stories with comments
- Long podcasts (think Lex Fridman)
- Changes in state/federal legislation

Here are a couple of the latest episodes direct from the [public library](https://thedaily.fm/library):

<div class="dfm-embeds">
<iframe src="https://thedaily.fm/embed/podcasts/0e98bf5a-e0f2-4070-80d0-4ff666e5d265/latest" width="100%" height="152" style="border:0;border-radius:12px" loading="lazy" title="AI Daily — The Daily FM player"></iframe>
<iframe src="https://thedaily.fm/embed/podcasts/hn-recap/latest" width="100%" height="152" style="border:0;border-radius:12px" loading="lazy" title="Hacker News Daily — The Daily FM player"></iframe>
<iframe src="https://thedaily.fm/embed/podcasts/f5a30ac3-9043-426e-8483-2ab82bc7e1cd/latest" width="100%" height="152" style="border:0;border-radius:12px" loading="lazy" title="Lex Fridman Podcast in 3 minutes — The Daily FM player"></iframe>
<iframe src="https://thedaily.fm/embed/podcasts/45d36878-840e-4730-a30a-64c749a70ec0/latest" width="100%" height="152" style="border:0;border-radius:12px" loading="lazy" title="Washington Brief — The Daily FM player"></iframe>
</div>

<style>
.dfm-embeds iframe{display:block;margin:16px 0}
</style>

It pulls your sources, writes a script with a frontier-ish model of your choice, runs it through TTS (MAI-2 studio voices), and publishes a standard RSS feed. You can also combine several pods into one feed for one subscribe point.

Under the hood it's using Cloudflare Workers, queues, browser rendering, and the AI Gateway, but the TTS models aren't very good on Cloudflare so I switched to the MAI-Voice-2 models with OpenRouter.

I also created a [public library](https://thedaily.fm/library) you can subscribe to without ever signing up, or if you sign up, you can combine a bunch into a single feed and use your own sources as well.

Is this interesting to you? Lemme know what you think by contacting me through the app (Intercom).

You can check out The Daily FM here: [https://thedaily.fm](https://thedaily.fm)
