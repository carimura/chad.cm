---
title: "The Individualized Creator Economy"
date: 2025-07-02
type: post
template: post.html
active_nav: writing
excerpt: "What I find interesting in this example is this trend towards, what I'm calling to myself the Individualized Creator Economy, or ICE for sure."
---

Like almost every curious engineer, I've been playing around with various AI tools to see what they can do. I've basically hacked on three projects, formed a hypothesis of where the world might be going, and also found some interesting parallels to serverless computing (that my last company focused on).

## Project 1: Building Speedcam

My first project, which is still ongoing, involves porting OpenCV code to Java's new [FFM API](https://openjdk.org/jeps/454) for faster object detection. Specifically I have a camera at the front of our property on the road logging speeding offenders. It works, but it's pretty slow, and I'd like to keep the processing both batch oriented, and local. So far so good, but since the API is quite new and OS-specific compiling, linking, etc is complex, you reach the limits of how much even the best frontier models can handle. They mostly just keep regurgitating the same "fixes" probably buried in Stack Overflow and then get increasingly frustrated before giving up.

<img src="/assets/bingo.png" style="width: 70%; float: right; margin-left: 20px;" />

## Project 2: Building Arc
Then I wanted to write about that experience, but I didn't have a blog, so I built a [static site generator](/posts/2025-05-28-building-arc) in Java that puts the HTML/CSS layout at the center, and uses tags and such to embed data. The Java code handles the magic but sort of hides behind the scenes. Many people believe the logic should be at the center of everything, and have the Java code spit out some HTML. This hurts my head, but I think philosophically it's the difference between someone that comes from a classic MVC background (like me), vs someone that comes from a more backend-centric world view.

## Project 3: Building Bingo
Anyways, my third project, if you can even call it that, is ridiculously simple, even stupid (although we coach the kids not to call things stupid). My group is spread across the globe and we meet a few times a year on Zoom to just hang out and chat with no work agenda. But I try not to come empty handed and risk virtual-meeting crickets so I usually bring an ice-breaking game. At 6am, before our 9am meeting, I decided to give Claude Code a whirl to create an [interactive Bingo game](https://github.com/carimura/bingo), and in about an hour, I had a board live that supports multiple rounds of questions, hot keys, a nice little ding when someone gets bingo, and with a bit of prompting I was able to narrow in on questions I thought were decent. And it turned out fun! At least it seemed fun. My team is obligated to tell me it was fun.

## ICE

So why did I re-build a game that surely 100 sites offer, and then write yet-another-post on how AI wrote some HTML and JS that my dog could probably write after a few hours at dog code bootcamp? I guess what I find interesting is this trend towards, what I've decided to call the Individualized Creator Economy (maybe ICE isn't the most popular acronym right now but it felt better than Custom Creator Platform).

**ICE is a return to custom software vs off-the-shelf or as-a-service models.** It's the ability to vibe code (with human in the loop) exactly what you want in the amount of time it would take to search the Internet, give someone your email address, try out their thing, only to find out it wasn't what you thought, etc.

**ICE is software limited only by one's creativity vs one's skillsets.** This I think is the main point. Engineering is not just about writing code or soldering wires, it's about making something come alive. As a kid I used HyperCard to build choose-your-own-adventure games, and Telegard and Wildcat BBS to build BBS sites. As I got older I created companies and used code to make those come alive. Software has become increasingly powerful but also increasingly complicated. Part of what I loved about "serverless" was the notion of abstracting out the infra layer, and AI tools seem to be trending towards a world in which you can abstract out a lot of the heavy lift of code also -- limited by creativity.

**ICE is moving faster while still following the rules of a larger organization.** In my Bingo example, technically, I'm supposed to put all new software through a security review before using it for work. But this could take months, so having it ready by my 9am meeting is obviously untenable. Enter ICE -- where I can build it, and no sensitive data were harmed in the process. Maybe this is the biggest point here, IDK.

What do you think? Is this <span style="text-decoration: line-through;">stupid</span> your experience?