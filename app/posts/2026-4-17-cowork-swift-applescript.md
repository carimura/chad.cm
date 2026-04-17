---
title: "Cowork, Swift, and AppleScript"
date: 2026-04-17
type: thought
template: post.html
description: Claude Cowork vs Code, a Swift toolbar button, and discovering AppleScript from 1993
active_nav: playground
---

Trying to use Claude Cowork for coding instead of Claude Code as it has a nice interface to handle parallel sessions at once. I really like the feel of the terminal though. Also, Swift apps are fun. I built a [toolbar button](https://github.com/carimura/theme-switcher) that easily toggles between light/dark mode themes. Today I discovered AppleScript, that was recently announced in... 1993. It's hilarious.

```
tell application "System Events"
    tell appearance preferences to set dark mode to not dark mode
end tell
```

Oh and I've abandoned OpenClaw for now. Way too much configuration and pain just to have a worse interface for building stuff. I think the sweet spot there is calendar management, trello cards, web search, etc.
