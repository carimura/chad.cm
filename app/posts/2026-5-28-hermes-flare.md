---
title: "Hermes-flare: Self-hosted Hermes Agent running on Cloudflare"
date: 2026-05-28
type: post
template: post.html
active_nav: writing
excerpt: An agent that talks to me on Slack, persists between restarts, and runs every shell command it issues in a completely separate sandbox from itself.
---

<img src="/assets/posts/hermes-flare-logo.png" alt="HERMES-FLARE" style="max-width: 80%;">

Inspired by the [Moltworker](https://blog.cloudflare.com/moltworker-self-hosted-ai-agent/) stuff, I wanted to get [Hermes](https://hermes-agent.nousresearch.com) working on Cloudflare as a serverless agent with long-term memory and the ability to execute commands and code in separate sandboxes

Here's that work so far: [https://github.com/carimura/hermes-flare](https://github.com/carimura/hermes-flare). It's very rough, but it works.

Some features:

## Serverless

The main feature is this is a self-hosted Hermes agent running basically serverless on Cloudflare. It's amusing to talk about serverless again given my [last company](https://chad.cm/posts/2017-05-22-thanks-and-onward.html), but here we are in 2026! 

- **Workers**: the entry point. Routes `/api/*`
- **Containers (Sandbox SDK)**: the Agent and Exec containers, both running as Firecracker VMs.
- **Durable Objects**: what the Sandbox SDK sits on underneath. 
- **R2**: where the snapshots land. ~50MB out of the box. Will grow over time but does not include the Hermes agent code which is 1.6GB (!).
- **Cron Triggers**: fires every 5 minutes, partly to keep the Agent warm and partly so Hermes' own scheduled jobs get a chance to run.

All that plus a little wiring and there's not much to worry about.


## Isolating Code Exec with Sandboxes

 There are two different containers:

- **Agent**: the long-lived container. Hermes runs here, talks to Slack over Socket Mode, holds onto its memory.
- **Exec**: A specific code execution sandbox where the agent can run Python, shell commands, etc.

Hermes is actually installed at `/opt/hermes-install` but you'll notice that `ls /opt/hermes-install` can't find it. That's because the sandbox is separate.

<img src="/assets/posts/hermes-flare-exec.png" alt="Hermes running whoami and ls in the Exec sandbox" style="max-width: 100%;">

## Snapshots and restore

Hermes keeps its state (config, sessions, memories, cron jobs) under `~/.hermes` in the Agent container. Hermes-flare can snapshot that whole directory up to R2 as a compressed squashfs blob, and whenever the container cold-boots it pulls down the latest snapshot and restores before the gateway even starts.

One fun exercise was trying to mount R2 because that's what I thought moltworker did, but I discovered they abandoned that strategy due to latency issues, only after I ran into... latency issues. Snapshots are simple though, and because Hermes is installed in a different directory, each snapshot is only like 50 megs.

To see in action, I took a snapshot, told Hermes about my other dog Gus, and then killed the container and brought a new one up. 

Restore did its job, Yodel was still in there. But Hermes also went back and re-read the Slack thread, saw me mention Gus, and offered to save him again. It recovered partly from the snapshot and partly by just scrolling back through the conversation. You wily little agent you!

<img src="/assets/posts/hermes-flare-gus.png" alt="Hermes recovering memory after restore and re-noticing Gus from the prior Slack thread" style="max-width: 100%;">


## What I haven't done yet....

- AI Gateway for proxying the LLM through Cloudflare. Hermes talks directly using the bring-your-own-key.
- Zero Trust in front of `/api/*`. Right now it's just a shared token, and I want to wire up Cloudflare Access so my identity carries through on its own.
- Per-command Exec sandboxes. They all share one at the moment.
- Multiple bots at once (possible in theory but haven't tested)
- An "operator bot", basically a second Slack interface that can poke at the Agent container itself. Makes more sense now that there's a real boundary between the agent and where its code runs.

And some issues [here](https://github.com/carimura/hermes-flare/issues).

## Repo

[github.com/carimura/hermes-flare](https://github.com/carimura/hermes-flare)
