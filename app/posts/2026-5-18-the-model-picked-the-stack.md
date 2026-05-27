---
title: "The model picked the stack"
date: 2026-05-18
type: thought
template: post.html
description: AI models are now the discovery layer for every field — not just code.
active_nav: thoughts
---

We should be nervous about how much power the AI models have in discovery.

I'm doing some car speed tracking using a camera on our property and Opus chose an app stack (Python:3.12-slim base image, UV, FastAPI, uvicorn) + ML stack (Yolo11s, Bytetrack, ONNX) + cloud architecture (Cloudflare R2 -> queue -> worker -> container -> D1).

In the before times, I would have spent a whole day researching these pieces, testing them, talking to friends, and building a plan.

Now? I gave it a nudge about the cloud arch because I had an opinion, but otherwise, turned "auto mode on" and let it rip. Took a few hours to build. I never opened a browser let alone a search engine.

This will start to apply to every field: education, health, politics, history (!).
