---
title: "Giving agents a brain, and a Mac menubar for Claude sessions"
date: 2026-04-14
type: post
template: post.html
active_nav: writing
excerpt: "Experimenting with a hybrid Karpathy-style Obsidian vault for agent memory, and discovering how easy native Swift menubar apps are."
---

I'm experimenting with giving my agents a brain using a hybrid model of [Karpathy's Obsidian post](https://x.com/karpathy/status/2039805659525644595) that everyone is ~~freaking out~~ really excited about. I say hybrid because I don't really have the use case he does where I'm consuming and synthesizing lots of papers from arxiv, but I am really struggling with how to "stay organized" with projects, agents, etc., at a velocity that is beyond what I've ever seen before. In talking with folks it seems this is a pretty common feeling.

In the "slow old days", we would open up a project in a ticketing system, a github repo, and an IDE, and get to work over days and weeks. Then for a new project, repeat. All projects beyond the top few would wait until the brain lock was released, which was likely on the order of magnitude of weeks/months.

Now, at least for me, there's very little IDE, and lots of terminals open just chugging away stuff. And then the next day, same thing. Like having a dozen programmers working for me that are expert level programmers and system adminstrators, but still junior architects where I have to watch over them.

So back to the Obsidian brain.. I guess I'm looking for a way for agents to share knowledge over time, learn, and improve. Maybe those junior architects can become... not so junior. I could return to sessions with full context, or even context from different sessions if needed. Maybe none of of this is needed. I guess we'll see. The analogy of brains and short/long term memory seems to be a big area of exploration in the harness space. Probably for good reason. Reminds me of the serverless days where we would identify a problem (eg cold starts, queue times) and we'd see everyone working on that problem space at the same time (at much slower speeds!).

Side note: I also added a `/checkpoint` command to claude code that summarizes the session and adds to the wiki in a special sessions folder.

<img src="/assets/posts/claude-menubar-3.png" alt="Obsidian vault structure" style="max-width: 60%; display: block; margin: 1em auto;">

Oh and to manage all these claude agents, I built a native Mac Swift app. I've always wanted ~~to see a blue duck~~ to build a native Mac app, and now I have one that my intern wrote. It's a toolbar item at the top that drops down to show all Claude Code running sessions and their status (waiting, running, etc.). 

<img src="/assets/posts/claude-menubar-2.png" alt="Menubar icon in the Mac top bar" style="max-width: 100%;">

And you can open up a window to show all the sessions and the details of each.

<img src="/assets/posts/claude-menubar-1.png" alt="Menubar app showing running Claude Code sessions" style="max-width: 100%;">


