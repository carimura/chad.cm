---
title: "Agents don't see what we see"
date: 2026-05-20
type: thought
template: post.html
description: Products will increasingly be designed for agents, not eyes — and agents miss context humans wouldn't.
active_nav: thoughts
---

Get ready for a strange world where products aren't designed for your eyes, but for agents.

An app I'm building starts by putting objects in a Cloudflare R2 bucket, but my agent harness wasn't looking at the whole wrangler response and threw out some really important context: "Resource location: local".

So then it spun off in a complete tangent writing a bunch of confused code and looking for known issues because it couldn't find the file in R2 when it was really just sitting there in a local R2 cache.

To be fair, this is likely a harness issue because the wrangler CLI functionality changed between versions but the harness was "looking" (aka grepping) for the old format.

Point being: agents don't "see" the same as humans and (surprise) we shouldn't assume they are right.
