---
title: Playground
type: page
template: page.html
description: random stuff
active_nav: playground
---

A few tinkering projects. The rest are at [github](https://github.com/carimura).

- **[SpeedCam](https://github.com/carimura/speedcam)** — automated speed detection in Java, exploring OpenCV JNI bindings and the FFM API.
- **[Gus](https://github.com/carimura/gus)** — agent harness in modern Java. ([post](/posts/2025-10-17-building-gus.html))
- **[Arc](https://github.com/carimura/arc)** — lightning-fast static site gen in Java. ([post](/posts/2025-05-28-building-arc.html))
- **[Claude Butler](https://github.com/carimura/claude-butler)** — automated task runner for Claude Code on a Raspberry Pi, driven by a YAML config and a systemd timer. ([post](/posts/2026-01-11-claude-butler.html))
- **web2pod** — turn any webpage into a podcast episode.
- **[Huddle](https://github.com/carimura/huddle)** — A multiplayer party game for remote teams. Players join from their browser and play together in real time over WebSockets.
- **[Bingo](https://github.com/carimura/bingo)** — team bingo game played in the browser.
- **unifi-ap-controller** - controls our local unifi network by disabling some APs at night. Runs on a pi.

## Today I Learned

Inspired by [Simon Willison's TIL](https://til.simonwillison.net/).

### April 7, 2026

Used CODEX alongside Cloudflare's MCP server to go through all my domains and their subdomains highlighting which ones return an HTTP response (200, 404, etc.). Cleaned up old subdomains pointing to dead stuff. Then I created a staging site for chad.cm just to test things and codex automatically wired up a new github branch to Cloudflare pages and added a dns entry to make it all work. One step closer to the dream of never thinking about infra.
