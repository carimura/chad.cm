---
title: "Claude Butler"
date: 2026-01-11
type: post
template: post.html
active_nav: writing
excerpt: "I've been thinking about things Claude Code could do on a schedule, so I tried to solve this problem and it worked nicely. I now have a private podcast feed of YouTube videos I'd like to listen to on the go."
---

<img src="/assets/posts/claude-butler.png" alt="Robot butler serving an RSS feed" style="float: right; margin: 0 0 20px 20px; max-width: 300px;">

## tldr;

I run Claude Code on a schedule (on a Raspberry PI) that reads some prompts in a yaml file. My first use case is to download some YouTube videos and publish them as a private podcast feed. Eh I guess when I write it like that, this post isn't as interesting....


## The Uninteresting Post

I listen to a fair amount of podcasts. In the car, on a run, mowing the lawn, etc. I use Overcast.fm. It's simple, downloads the last few episodes of each pod, keeps them there until I listen or overwrites with new episodes once a configurable limit is met. Each pod has a configurable speed, it "just works", and it doesn't have any AI features. 

The problem is when pods I listen to are super delayed in publishing for whatever reason, or even stop altogether and only publish to YouTube. And there do exist some YouTube shows that never publish to audio podcasts. The horror! I don't "use" YouTube like that! Enter Claude Code. 

Given that my last company was all about workers as a service, I sometimes wonder if Claude Code could do something similar by running on a schedule in the background directed by just prompts with access to all the tools it needs. That seemed to be one of the barriers of IronWorker -- getting access to the right tools easily.

## Claude Code on a Schedule
My "Claude Butler" is just the following command run every hour:

`claude --permission-mode bypassPermissions -p "Read tasks.yaml and execute all tasks"`

## Claude Butler's Tasks.yaml

```
❯ cat tasks.yaml
# Claude Butler - Task Instructions
# Claude reads this file and executes the tasks listed below.
#
# Required environment variables:
#   BUTLER_HOME=/path/to/claude-butler
#   NAS_ADDRESS=/path/to/nas/mount (e.g., /Volumes/farmnas2 on Mac)
#   CHANNEL_ID=my_channel_id (could be list in future)

tasks:
  - name: channel-new-audio
    description: Check channel for new videos and download audio
    channel_id: $CHANNEL_ID
    action: |
      Run this command to download audio from any videos uploaded in the last 24 hours:
      yt-dlp --dateafter now-1day --playlist-end 10 --break-on-reject --match-filter "!is_live" -x --audio-format mp3 --no-overwrites --restrict-filenames -o "$BUTLER_HOME/downloads/%(upload_date)s_%(channel)s_%(title)s.%(ext)s" "https://www.youtube.com/channel/$CHANNEL_ID/videos"

  - name: sync-downloads-to-nas
    description: Copy downloaded files to NAS
    action: |
      Run this command to sync downloads to the NAS:
      rsync -av --ignore-existing $BUTLER_HOME/downloads/ $NAS_ADDRESS/public/

  - name: generate-podcast-rss
    description: Generate podcast RSS feed from MP3 files
    action: |
      Generate a podcast RSS feed at $NAS_ADDRESS/public/feed.xml based on the MP3 files in $NAS_ADDRESS/public/.

      Requirements:
      - Follow the Apple Podcasts RSS spec: https://help.apple.com/itc/podcasts_connect/en.lproj/itcbaf351599.html
      - Podcast title: ChadCast
      - Base URL for files is http://my-local-podcast-feed/
      - Parse episode titles from filenames (format: YYYYMMDD_Channel_Title.mp3)
      - Include only required/minimum tags
      - Sort episodes by date descending (newest first)
```

## Profit

I now have a private feed that publishes YouTube videos as audio-only all done locally. It's useful to me at least.


## Workers without the code?

I guess this is a little bit like IronWorker but instead of a worker file executing code, the worker is just headless claude. That said it's obviously not "codeless" because `yt-dlp` (and `rsync`) are actually a lot of code that I'm leaning on, but you get the concept.

I'm sure I'll find some other interesting use cases for my AI Butler.

## AI is Weird

One thing of note: when I first "deployed" this to my Pi, I forgot to set the environment variables. That's always the first thing that fails background tasks, forgetting stuff like that. Did AI fail? Nope. It just figured out what they "should be" from the context. I feel like I've typed this exact line multiple times before.....