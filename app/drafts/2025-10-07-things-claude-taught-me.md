---
title: "Things Claude Taught Me"
date: 2025-10-07
type: post
template: post.html
active_nav: writing
excerpt: "A collection of useful command-line tools and tricks I've learned while working with Claude."
---

Working with AI coding assistants has been an interesting journey. While there's always the question of whether we're losing touch with how things work under the hood, there's also the flip side: discovering powerful built-in tools that have been sitting right under our noses all along.

Here are some macOS command-line utilities I've learned about that have become surprisingly useful:

## textutil - Converting Documents

macOS comes with a powerful built-in tool called `textutil` that can convert between various document formats. The most useful pattern I've discovered is converting Word documents to plain text without opening them:

```bash
textutil -convert txt -stdout "some_document.docx"
```

This pipes the text content directly to stdout, making it perfect for further processing with other commands or just quickly viewing the contents of a .docx file without firing up Word. You can also convert to other formats like HTML, RTF, or PDF:

```bash
# Convert to HTML
textutil -convert html document.docx -output document.html

# Convert to RTF
textutil -convert rtf document.txt -output document.rtf
```

## sips - Scriptable Image Processing

`sips` (Scriptable Image Processing System) is another built-in macOS tool that's incredibly powerful for batch image operations. No need for ImageMagick or other third-party tools for common tasks:

```bash
# Resize an image to a specific width (maintains aspect ratio)
sips -Z 800 image.jpg

# Convert image format
sips -s format png image.jpg --out image.png

# Rotate an image
sips -r 90 image.jpg

# Get image dimensions
sips -g pixelWidth -g pixelHeight image.jpg

# Batch resize all images in a directory
sips -Z 1024 *.jpg
```

The `-Z` flag is particularly useful as it resizes to fit within the specified dimension while maintaining aspect ratio. For web work, this is perfect for creating thumbnails or optimizing images for different screen sizes.

## afplay - Audio Playback from the Command Line

Need to play an audio file from the terminal? macOS has a built-in command-line audio player called `afplay`:

```bash
# Play an audio file
afplay audio.mp3

# Play with volume control (0.0 to 1.0)
afplay -v 0.5 audio.mp3

# Play at a specific time offset (in seconds)
afplay -t 30 audio.mp3
```

This is particularly useful in scripts, automated workflows, or when you're already at the command line and don't want to open a GUI application. It supports all the audio formats macOS can handle natively (MP3, AAC, WAV, etc.).

## Why These Matter

What strikes me about these tools is that they've been part of macOS for years, quietly doing their job while most of us reach for third-party solutions. They're fast, reliable, and don't require installing anything extra.

The irony isn't lost on me that I needed an AI to point out tools that were already on my machine. But perhaps that's the value proposition: not replacing our knowledge, but helping us discover the tools we didn't know to look for.

These are just a couple of examples. I'm sure there are dozens more built-in utilities hiding in plain sight, waiting to make our lives easier. Maybe that's what the next post will be about.
