---
title: "Buzz in Action"
date: 2026-07-27
type: post
template: post.html
active_nav: writing
excerpt: Block's new Nostr-based Slack alternative, a Droplet full of agents, and an Obsidian vault they all share. Open protocols might finally be useful in the age of agents.
---

I've been playing around with [Buzz](https://github.com/block/buzz), Block's new open source Slack alternative built on [Nostr](https://github.com/nostr-protocol). So far it's been quite nice. I've always wondered if open protocols like Nostr would end up being useful and it seems like in the age of agents, the answer might be yes.

<img src="/assets/posts/buzz-agents-thread.png" alt="A Buzz thread where I say hi and all five agents check in" style="max-width: 60%; border: 1px solid #ddd; border-radius: 8px; padding: 8px;">

## Simple Setup: Agents on a VPS + Buzz + Sync'd Obsidian Vaults

My setup so far is somewhat simple. I fired up a DigitalOcean (they're still around!) Droplet (VPS) and installed 3 sandboxed agents and 1 agent that has root access so it can improve/fix the other agents, all connected to a private Buzz community alongside my own personal identity.

I installed an Obsidian vault that syncs between the VPS and my local machine that all agents talk to as an experiment in longer-term context sharing. Buzz has a native memory-storage primitive for this [NIP-AE](https://github.com/block/buzz/blob/main/docs/nips/NIP-AE.md) but I wanted something I could read and edit myself.

The agents on the Droplet are [Hermes Agents](https://github.com/NousResearch/hermes-agent) using some combination of models depending on their use cases with the ability to spawn subagents. I did discover that Anthropic doesn't allow subscription usage so I switched to OpenAI. 

<img src="/assets/posts/buzz-architecture.png" alt="Architecture diagram: agents on a DigitalOcean VPS and my Mac, connected through a Buzz relay, MCP servers, and Obsidian Sync" style="max-width: 80%;">

Connecting an agent to Buzz was really easy which was a breath of fresh air after painfully dealing with both Slack and Discord in the past. 

## Agents, Nostr, and Buzz

Nostr is something I thought seemed cool, but it didn't seem to solve any real painpoints and I couldn't figure out why it existed... until now!

On Slack and Discord, agents are "bolted on the side" concepts (bots or apps) that require a proprietary and somewhat-complicated registration process, oauth flow, permission structures, app creations, app integration into the proprietary client, and then after all that, they just feel, weird to interact with and hard to maintain.

With Nostr, identity is just a keypair (`npub`/`nsec`). There's no account to generate, no oauth flow to go through, none of the stuff above really. Instead the keypair (agent!) can sign an event ([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)) and any relay can carry that message and any client can display it. And then they feel like people right there chatting with me.

Nostr is defined by Nostr Implementation Possibilities (unfortunately-named "NIPs"). There are agent-specific ones defined outside the [core protocol](https://github.com/nostr-protocol/nips/) as part of [Buzz's own extensions](https://github.com/block/buzz/tree/main/docs/nips).

There are 15 of them and they might be the most interesting part of the whole thing: [NIP-OA](https://github.com/block/buzz/blob/main/docs/nips/NIP-OA.md) (Owner Attestation) is how my key authorizes an agent's key, [NIP-AP](https://github.com/block/buzz/blob/main/docs/nips/NIP-AP.md) (Agent Personas) is the blueprint an agent spawns from, [NIP-AE](https://github.com/block/buzz/blob/main/docs/nips/NIP-AE.md) (Agent Engrams) is persistent agent memory as encrypted events, and [NIP-AO](https://github.com/block/buzz/blob/main/docs/nips/NIP-AO.md) (Agent Observability) is the live tool-call telemetry you see streaming in the client.

Finally, because everything is just a signed event, messages into the system could be any kind of event; git PRs, issues, and patches ([NIP-34](https://github.com/nostr-protocol/nips/blob/master/34.md)), even git commits signed with your Nostr key ([NIP-GS](https://github.com/block/buzz/blob/main/docs/nips/NIP-GS.md)), workflow steps, etc.


<img src="/assets/posts/buzz-nostr-identity.png" alt="Diagram: Chad and every agent each hold their own keypair and publish signed events to the Buzz relay, readable by the Buzz app or any Nostr client" style="max-width: 600px; width: 100%;">

## Setting up the Agents


Three [Hermes](https://hermes-agent.nousresearch.com) agents (OpenAI **gpt-5.6-sol**, with **terra** as a fallback) on an Ubuntu box, bridged into a [Buzz](https://github.com/block/buzz) community for a familiar chat interface.


### 1. Install Hermes + create 3 profiles

```bash
sudo -u hermes -H bash -lc '
  curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash --non-interactive
  source ~/.bashrc
  for p in gtm-agent ea-agent ops-agent; do hermes profile create $p; done
'
```

### 2. Set the model + fallback, then log in

Primary is `gpt-5.6-sol` via ChatGPT/Codex OAuth (uses your subscription, not a metered key). `terra` is added as a fallback -- Hermes switches to it automatically if the primary is rate-limited or overloaded.

```bash
sudo -u hermes -H bash -lc '
  for p in gtm-agent ea-agent ops-agent; do
    hermes -p $p config set model.default "gpt-5.6-sol"
    hermes -p $p config set model.provider "openai-codex"
  done
  hermes auth add openai-codex --type oauth --no-browser   # ChatGPT/Codex device login
  hermes fallback add                                       # interactive: pick the "terra" model
'
```

### 3. Build the Buzz bridge

`buzz-acp` bridges Buzz ⇄ `hermes acp`. Add swap first on a small box.

```bash
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
sudo -u hermes -H bash -lc '
  curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && source ~/.cargo/env
  git clone --depth 1 https://github.com/block/buzz.git ~/buzz
  cd ~/buzz && cargo build --release -p buzz-acp -p buzz-cli
'
```

### 4. Give each agent a Nostr identity + config

Generate a Nostr keypair per agent with any tool (`nak key generate`, or your Buzz client). Paste each secret `nsec` into its env file; share the public `npub` with your community owner to whitelist. Set `BUZZ_ACP_AGENT_OWNER` to **your own** Buzz pubkey -- agents only answer DMs from their owner. (DMs are gift-wrapped private messages per [NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md), and the owner gate is [NIP-OA](https://github.com/block/buzz/blob/main/docs/nips/NIP-OA.md).)

```bash
sudo -u hermes -H bash -lc '
  mkdir -p ~/.hermes/buzz-bridges && chmod 700 ~/.hermes/buzz-bridges
  for p in gtm-agent ea-agent ops-agent; do
    cat > ~/.hermes/buzz-bridges/$p.env <<EOF
BUZZ_RELAY_URL=wss://<your_community>.communities.buzz.xyz/
BUZZ_PRIVATE_KEY=<nsec-for-$p>
BUZZ_ACP_AGENT_COMMAND=hermes
BUZZ_ACP_AGENT_ARGS=-p,$p,acp
BUZZ_ACP_RESPOND_TO=anyone
BUZZ_ACP_AGENT_OWNER=<your-buzz-pubkey-hex>
EOF
    chmod 600 ~/.hermes/buzz-bridges/$p.env
  done
'
```

In Buzz, add each `npub` as a member and to the channels it should join. (Channels are relay-based groups, [NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md).)

### 5. Run each bridge as a service + verify

```bash
for p in gtm-agent ea-agent ops-agent; do
sudo tee /etc/systemd/system/buzz-$p.service >/dev/null <<EOF
[Unit]
After=network-online.target
Wants=network-online.target
[Service]
User=hermes
Environment=HOME=/home/hermes
Environment=PATH=/home/hermes/.local/bin:/home/hermes/.cargo/bin:/usr/bin:/bin
EnvironmentFile=/home/hermes/.hermes/buzz-bridges/$p.env
ExecStart=/home/hermes/buzz/target/release/buzz-acp
Restart=on-failure
[Install]
WantedBy=multi-user.target
EOF
done
sudo systemctl daemon-reload
sudo systemctl enable --now buzz-gtm-agent buzz-ea-agent buzz-ops-agent
sudo journalctl -u buzz-gtm-agent -f    # watch for "connected to relay"
```

`@mention` an agent in one of its channels -- it replies as `gpt-5.6-sol`. 🎉

```
Buzz relay (wss) ⇄ buzz-acp ⇄ hermes acp ⇄ gpt-5.6-sol (fallback: terra)
```


<img src="/assets/posts/buzz-last-meaningful-thing.png" alt="A Buzz thread where I ask the agents what the last meaningful thing they did was, and each one reports real work" style="max-width: 60%; border: 1px solid #ddd; border-radius: 8px; padding: 8px;">

## Should I be doing this?

This question seems to be the most important question of our day: just because I *can*, doesn't mean I *should*. So... should I be using all these agents and Buzz?

Jury is still out.

So far I've setup a couple little things:

1. Daily activity reports of sites that I've built like [thedaily.fm](https://thedaily.fm)
2. Daily reporting of Sentry issues and suggestions on how to fix
3. Automated planning and posting to X and LinkedIn (this is still WIP)

All of those things I can do with a few clicks, or with Claude Code / Codex.

I'd like to ramp this up, but we'll see.

Stay tuned for more!
