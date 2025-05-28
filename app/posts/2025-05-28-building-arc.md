---
title: "Building Arc (in a few hours)"
date: 2025-05-28
type: post
template: post.html
active_nav: writing
excerpt: Arc is a minimal static site generator I built to power my personal website. Here's how it works and why I built it.
---

I wanted to write a blog post about some OpenCV stuff I did in Java using the [Foreign Function & Memory API](https://dev.java/learn/ffm/), but then realized, I didn't have a blog. 

Since I work on the team that makes the Java Platform, I couldn't bare using some Javascript blog engine, so I [built my own in Java](https://github.com/carimura/arc). The code is like Stackoverflow and Baeldung got put in a blender then blown up with dynamite, but it works, and I got to play around with Cursor and Claude 4.

Arc is a static site generator written in Java. It converts Markdown files to HTML, supports templates, and even has hot reloading. Here's what it does:

- Converts Markdown files to HTML using CommonMark
- Supports YAML frontmatter for metadata
- Uses a simple template system with `{{ variable }}` syntax
- Includes template features like loops (`{% for %}`) and conditionals (`{% if %}`)
- Has a built-in hot reload mode for development
- Generates a clean output structure in a `site` directory



## Technical Implementation


### Template System
The template engine supports:
- Variable substitution: `{{ title }}`
- Loops: `{% for post in posts %}...{% endfor %}`
- Conditionals: `{% if variable %}...{% endif %}`
- Includes: `{% include "header.html" %}`


### Directory Structure
```
app/
├── posts/         # Blog posts in Markdown
├── pages/         # Static pages in Markdown  
├── templates/     # HTML templates
└── assets/        # CSS, JS, images
site/              # Generated output
```

### Making a native executable

```
jpackage options:
  --name arc
  --dest /path/to/arc/target/jpackage
  --type app-image
  --app-version 1.0
  --input /path/to/arc/target
  --main-class com.pinealpha.arc.Process
  --main-jar arc-1.0-SNAPSHOT-jar-with-dependencies.jar
  --java-options --enable-preview
```

and then creating a script in your path like so:

```
#!/bin/bash
/path/to/arc/target/jpackage/arc.app/Contents/MacOS/arc "$@"
```



### Hot Reloads
The hot reload feature uses Java's `WatchService` to monitor the `app` directory for changes to `.md`, `.html`, `.css`, and `.js` files. When changes are detected, it automatically triggers a rebuild.



## TODO

- RSS feed
- maybe some code formatting
- template inheritance
- more refactoring and cleaning
- Use String templates someday


## Conclusion

I dunno. AI wrote most of the code, so it pains me, but we refactored a little together so it pains me a little less. Then AI wrote this blog post, but the writing style made me cringe, so I rewrote it, feeling bad that my agent might find out and get hurt.

Anyways, it was fun. I have lots of thoughts on AI but I'll save those for another post on this fresh new blog.

To end, here's some ascii art from my AI friend about me and it (him?) coding together:


```
     👦                    🤖
    /|\                   /|\
    / \                   / \
   -----                 -----
  |     |               |     |
  |  💻 |               |  💻 |
  |_____|               |_____|
  
  "Let's build         "Affirmative.
   something cool!"     Initiating
                        collaboration
                        protocol."
                        
        ✨ Building Arc Together ✨
```



