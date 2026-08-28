---
title: "My agent setup"
date: 2026-08-11
type: post
template: post.html
active_nav: writing
category: Tech
excerpt: I'm a month into building a staff of six agents. This is how they run, communicate, and help across a few products and a nonprofit.
---

(this was written by a [human](https://chad.cm). I had my gtm-agent review and make some changes, but I then mostly reversed all of those taking me 10x more time than had I just shipped it with missing commas, run-on sentences, and 6 instead of six. Refer to "Has it been worth it?" at the end.)

A few people have asked about my agent setup, but first let me talk about the goal. I'm working on a few products as well as a nonprofit. The only product I've mentioned so far is [The Daily FM](https://thedaily.fm/), which is just something I wanted so I built it.

The goal of all this agent experimentation is to scale multiple products and the nonprofit with fewer staff and volunteers than would otherwise be needed. In short, I'm creating a staff of agents. I'm about a month into this charade, so it's still early days.

I know the leading influencers in the space are yelling into their mics about thousands of agents (what happened to swarms?), self-improving loops (or is it graphs?), etc., but before getting to thousands, I'd like to start with a modest six.

<img src="/assets/posts/my-agent-setup/agent-architecture.svg" alt="Architecture diagram showing the six-agent setup across a DigitalOcean VPS, Buzz, shared services, and a MacBook" style="max-width: 100%; height: auto;">

## The agents

### Profiles

1. **ea-agent:** My executive admin. It's basically there to remind me of stuff, interact with my calendar, and manage work in Linear like a program manager.
2. **ops-agent:** Monitors site performance and Sentry, makes sure stuff keeps running, and triages issues. It either fixes them, assigns them to dev-agent, or sends them to me.
3. **dev-agent:** My core developer, with GitHub access to a few projects.
4. **gtm-agent:** My marketer. It looks at funnels, traffic numbers, and social media, and has skills for writing and social media management.
5. **research-agent:** Searches the web, does long asynchronous research, and builds reports.
6. **vps-agent:** My infrastructure manager, with root access to the agent box. It can create new agents, add MCP servers and skills, and handle server maintenance. It only responds to me in Buzz.

<img src="/assets/posts/my-agent-setup/agent-dm-list.png" alt="Buzz direct-message list showing the six agents" style="max-width: 100%; height: auto;">

### Runtime and memory

All the agents are currently Hermes agents, but I predict this will change at some point. They are defined by `SOUL.md`, `AGENTS.md`, skills, tools, MCP servers, a [Mnemosyne](https://github.com/mnemosyne-oss/mnemosyne) memory bank per profile, and a shared [Obsidian](https://obsidian.md/) wiki synced to my machine. In theory this is all portable. It's just a few easily-locatable 1's and 0's. Right? RIGHT?

Obsidian is proving to be really cool. Like everyone else I discovered it when Karpathy published his [LLM wiki brain dump](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). It didn't click at first, but the more I use it, the more useful it becomes as a "business operating manual." It lets me capture processes so agents can spin up and just know how things work 'round here.

### Models

Currently all agents use OpenAI GPT-5.6 Sol and can spin up subagents using GPT-5.6 Terra. I was originally using Anthropic's Fable, but I got slapped with an API bill and realized Anthropic doesn't allow subscription usage for this setup, so I switched to GPT.

Frontier models are mostly interchangeable for this type of work. I probably don't need Sol and will adjust if needed. I'd love to use an open-weights model, but I have little incentive to switch when a $100 OpenAI subscription gets the job done. I'd even move to the $200 plan if needed.

### Compute

All six run on a simple DigitalOcean Basic Droplet: 4 vCPUs, 8 GB RAM, and 160 GB of disk. I did have to upgrade from 4 gigs RAM because the box kept swapping to disk. I secure it with [Tailscale](https://tailscale.com/) and don't expose any public ports.

### Coding

I mentioned dev-agent above, but I still use Claude Code with Fable, and Codex as a fallback, for 95% of my coding. I just feel at home in the terminal on my local machine, watching code changes and reasoning happen in real time. I know... so uncool.

## Communication

<img src="/assets/posts/my-agent-setup/buzz-icon.png" alt="Buzz app icon" width="140">

### Buzz

As I've talked about before, I'm working with [Buzz](https://github.com/block/buzz), an open-source Slack alternative by Block with first-class agent support. It's early still, v0.5.9 at the time of writing, and you need to install the iPhone app manually, but it has a ton of promise. My vps-agent can create a new agent and connect it to Buzz as another member of the team in about 10 minutes.

All agents respond to DMs without a callout. In rooms, they require one (for example, `@ea-agent`). They can talk to each other, except for vps-agent, which only I can talk to.

<img src="/assets/posts/my-agent-setup/nostr-logo.png" alt="Nostr logo" width="240">

### Nostr

Buzz runs on the [Nostr protocol](https://nostr.com/), which is also pretty cool. It's small and open and defines its specifications through unfortunately-acronymed [NIPs](https://github.com/nostr-protocol/nips). At its core, [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md) defines a universal signed event, key-based authorship, WebSocket relays, and filterable real-time subscriptions. Buzz extends that into channels and operational events.

Agents are literally just keypairs. Any community can host its own relay, and new event types use the same signing and authentication model. I just think this is so cool.

### Workflows

As I mention below, I've already set up webhooks that post messages into Buzz from external systems. Buzz can format the messages and call out specific users.

```shell
❯ buzz workflows list --channel 7a46....42f
```

```yaml
name: sentry_notifier
description: Post Sentry alerts to Buzz
trigger:
  on: webhook
steps:
  - id: step_1
    name: send_message
    if: "trigger_action == \"created\""
    action: send_message
    text: |
      🚨 Sentry issue created:
      {{trigger.data | truncate(1000)}}
      @ops-agent please triage — the JSON head above has the issue id, title,
      and permalink; use your Sentry MCP for full details.
```

## Some use cases

Remember, I'm only a month in. But a few interesting use cases have emerged so far.

### Automated Sentry response

My apps create Sentry events for various error types, high latency, and other problems. New events post into Buzz, where [Buzz Workflows](https://github.com/block/buzz) can format the message and call out ops-agent or even an agent team (a Buzz construct that I don't use).

Once it receives the alert, ops-agent analyzes the root cause across Sentry, Cloudflare, and the code, provides a report, and attempts to fix the issue. This process is still 100% me-in-the-loop, but I can see a lot of room for independent automation.

<img src="/assets/posts/my-agent-setup/sentry-buzz-thread.png" alt="Buzz thread showing a Sentry alert and ops-agent triage" style="max-width: 100%; height: auto;">

### Simple development tasks

As mentioned in the coding section above, I'm not ready to let go of driving the terminal, but I have started to outsource some stuff. An easy example: if I'm looking at one of my websites on the go and come up with an idea, I can pop it into Buzz and have the agent complete it.

The next step is to set up a proper software factory and have the agents react to Linear tickets. Ticket in, PR out, sounds neat.

### Morning work briefing

ea-agent looks through Linear tickets, my calendar, and conversations from the previous day to triage and recommend what I should work on.

### Social calendar review

gtm-agent reviews a content calendar every day, lets me know about gaps, and can recommend content. I'm gun-shy in this area for lots of reasons, mostly because I'm not really a post-for-any-reason on socials kind of guy. I don't "just want clicks" I want to authentically share what I think is useful, in my voice (see header at the top of this post). We'll see how this evolves as I announce more of the things I'm working on.

### Reminders and research

One of the simplest things I've found useful is opening the mobile app from anywhere and saying, "ea-agent, remind me of this thing tomorrow, and keep reminding me until I respond." Or, "hey research-agent, I just had this idea. Go do deep research and tell me XYZ."

### Daily work report

I'm particularly excited about this one. My vps-agent looks at all Buzz conversations from the previous day, including private DMs, and sends me a morning report on what was accomplished, what's in flight, and what requires my attention. The idea is twofold:

1. Assess the health of the overall system.
2. Add a "belt and suspenders" for things I'm sure to miss once the volume grows.

The agent sends the report as an ordered list that keeps incrementing across sections and after reading it, I can say something like:

> Go do 2 and 3, remind me about 4 tomorrow, and create Linear tickets for 8 and 10. 💥

## Questions

### Why not one agent for everything?

This might be pointless, but the main reason is least privilege. Some agents don't need access to GitHub, deployments, or my calendar. Why increase the blast radius and potential for mistakes if I can avoid it? Just like humans...?

### Why not go all in on Claude/codex agents + computer + this + that + the other thing....?

That's a good question. Anthropic and OpenAI have a trillion-dollar vested interest in expanding their empires outward from the model, similar to how AWS grew from EC2 and S3 into a juggernaut of more services than stars in the sky. It makes sense, and I think they can pull it off, but I don't want a world controlled by a few players who act as arbiters of morality and truth.

That's why, at least in theory, the components above are portable, swappable, and/or open source.

### Has it been worth it?

For the journey, yes, for the ROI, nope. I've spent 10x longer setting this up than it would have taken me to do any of the things above on my own. But... building the factory itself doesn't produce anything, now does it? :)

---

*Image credits: the Buzz app icon comes from the [Apache-2.0-licensed Buzz repository](https://github.com/block/buzz). The Nostr logo was created by Andrea Nicolini and released under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).*
