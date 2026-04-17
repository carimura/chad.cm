---
title: "Cloudflare MCP"
date: 2026-04-07
type: thought
template: post.html
description: Using Codex and Cloudflare MCP to clean up domains and create staging
active_nav: playground
---

Used CODEX alongside Cloudflare's MCP server to go through all my domains and their subdomains highlighting which ones return an HTTP response (200, 404, etc.). Cleaned up old subdomains pointing to dead stuff. Then I created a staging site for chad.cm just to test things and codex automatically wired up a new github branch to Cloudflare pages and added a dns entry to make it all work. One step closer to the dream of never thinking about infra.
