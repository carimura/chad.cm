---
title: "Do we know what we don't know?"
date: 2026-05-23
type: thought
template: post.html
description: When agents invent constraints and build complex logic around them.
active_nav: thoughts
---

One of the biggest challenges I'm seeing with agents is how confident they are even when wrong.

Somehow my agent decided that Cloudflare containers had a max concurrency of 10 and wrote all this pooling logic to accommodate, resulting in queue backlogs and an infinite loop of trying to tweak the pooling logic.

Once I got involved, read the docs with my own eyes (the horror!) and challenged that assumption everything got simpler and smoother and I watched 100 containers kick up to process the backlogs.

I then reminisced of the IronWorker days when customers would spin up thousands of workers to chew through queues and get to that "holy s**t" moment. Ahhh the good ole' days!
