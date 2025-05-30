---
title: "Building Arc (in a few hours)"
date: 2025-05-28
type: post
template: post.html
active_nav: writing
excerpt: I wanted to write a blog post about some OpenCV stuff I did in Java using the Foreign Function & Memory API, but then realized, I didn't have a blog. I couldn't bare using some Javascript engine, so I built my own in Cursor. It's called Arc. This post is both about Arc, and the experience of building it in a few hours.
---

I wanted to write a blog post about some OpenCV stuff I did in Java using the [Foreign Function & Memory API](https://dev.java/learn/ffm/), but then realized, I didn't have a blog. 

Since I work on the team that makes the Java Platform, I couldn't bare using some Javascript blog engine, so I built my own using Cursor and Claude-4-Opus. Enter, [Arc](https://github.com/carimura/arc).

It's not great. The code is like someone stuffed Stackoverflow and Baeldung into a blender and then blew it up with dynamite, but it took me about 5 hours (half of which was learning the tools), and I'm really curious if I can refactor my way into something broadly useful for others. All that said, it's really super fast, at least.

Arc is a static-site generator written in Java. It's basic function is to take Markdown files, mash them into some templates, and turn that all into plain-ole' HTML. I'm old school, and I have a core belief that HTML should be largely maintained as HTML, with some variables and control-flow built in, not littered throughout controller logic. Remember MVC? I liked that. Is it still a thing? Modern day JS frameworks hurt my brain.

**Features:**

- Converts Markdown files to HTML using CommonMark
- Supports YAML frontmatter for metadata
- Simple template system
- Variables: `{{ variable }}`
- Loops: `{for post in posts}...{% endfor %}`
- Conditionals: `{% if variable %}...{% endif %}`
- Includes: `{% include "header.html" %}`
- Has a built-in hot reload mode for development
- Uses `jpackage` to build a native executable

Also it's pretty fast. Here it is building this site:

```
❯ time arc
-------- STARTING ARC GENERATE() --------
Copied assets to: site/assets
Found 2 markdown posts to process
Found 4 markdown pages to process
Generated: posts/2025-05-28-building-arc.html
Generated: posts/2025-05-26-welcome-to-my-new-site.html
Generated: speaking.html
Generated: writing.html
Generated: index.html
Generated: about.html
-------- SITE GENERATION COMPLETE --------
arc 0.21s user 0.03s system 149% cpu 0.160 total
```


## Using (if you already have the arc binary)

Using it to build your own site is super easy, you just run the `arc` command (or `arc --watch` for hot reloads) inside the directory where your app lives. That said, getting `arc` at this time requires building it.

**The directory structure `arc` expects is as follows:**

```
app/
├── posts/         # Blog posts in Markdown
├── pages/         # Static pages in Markdown  
├── templates/     # HTML templates
└── assets/        # CSS, JS, images
site/              # Generated output
```

You can find a sample template [here](https://github.com/carimura/arc/tree/main/src/main/resources/examples/arc-site).

## Building the Arc Binary (and using it)

1. `git clone https://github.com/carimura/arc`
2. `mvn clean package` (this will compile and build the executable with jpackage)
3. Create a script in your path that points to the executable like so

```
#!/bin/bash
/path/to/arc/target/jpackage/arc.app/Contents/MacOS/arc "$@"
```

4. Go to your app directory ([sample here](https://github.com/carimura/arc/tree/main/src/main/resources/examples/arc-site)) and just type `arc` or `arc --watch` for hot reloads. 

5. `cd site`

6. `jwebserver`

7. go to `http://localhost:8000' and gasp at the simplicity. or the horror.

That's it!

**The jpackage command that is happening inside Maven** 

```
jpackage
  --name arc
  --dest /path/to/arc/target/jpackage
  --type app-image
  --app-version 1.0
  --input /path/to/arc/target
  --main-class com.pinealpha.arc.Process
  --main-jar arc-1.0-SNAPSHOT-jar-with-dependencies.jar
  --java-options --enable-preview
```




## TODO

- Maybe distribute native binaries for multiple platforms
- RSS feed
- template inheritance
- actually review the code in more detail, refactoring, cleanup


## Conclusion

I dunno. AI wrote most of the code, so it pains me, but we refactored a little together so it pains me a little less. Then AI wrote this blog post, but the writing style made me cringe, so I completely rewrote it, feeling bad that my agent might find out and get hurt.

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



