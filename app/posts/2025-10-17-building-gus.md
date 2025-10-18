---
title: "Building Gus: A Lightweight Terminal Agent in Modern Java"
date: 2025-10-17
type: post
template: post.html
active_nav: writing
excerpt: "I built a terminal AI agent in Java 25 to explore LangChain4j and modern Java features like sealed classes, pattern matching, and text blocks. It's named after my dog who also needs better training."
---

I built a terminal agent called [Gus](https://github.com/carimura/gus) in Java. It's named after my Great Pyrenees dog who also responds to commands inconsistently. Think of it as v0.0.1-alpha of Claude Code, except written in Java. (Usually I have Claude Code create a bare post, using the README as the starting point, but Claude couldn't help itself and inserted this text at the end of the line above: "and without all the features that make Claude Code actually useful." Incredible.)

## New Language Features

### Improved Readability with Text Blocks

```java
private static final String SYSTEM_PROMPT = """
    You are Gus, a friendly and helpful AI assistant.
    You provide clear, concise, and accurate responses.
    You're conversational but professional.
""";
```

Clean, readable, and with ASCII art:

```java
IO.println("""
    -------------------------------------------------------------------
                ,
                |`-.__
                / ' _/
               ----\s
              /    }
             /  \\ /
         \\ /`   \\\\\\
          `\\    /_\\\\
           `~~~~~``~`

    [Using provider %s with model %s]

    (type /exit or Ctrl+D to quit, /help for help, /clear to clear memory)
    -------------------------------------------------------------------

    Hi, I'm Gus, your friendly neighborhood AI CLI! How can I help today?\s
    """.formatted(provider, model));
```

### Type Safety with Sealed Classes and Switch

Sealed classes let you define a closed hierarchy. Here's the tool system:

```java
public abstract sealed class Tools permits SecretTool,
                                           SearchWebTool,
                                           ScrapePageTool {
    // ...
}
```

This tells the compiler exactly which classes can extend `Tools`. No surprises at runtime, and the compiler can verify exhaustiveness.

When you combine sealed classes with switch expressions, the compiler knows all possible cases:

```java
return switch (tool) {
    case SecretTool t -> t.secret();
    case SearchWebTool t -> t.searchWeb(args.get("arg0").getAsString());
    case ScrapePageTool t -> t.scrapePage(args.get("arg0").getAsString());
};
```

No default case needed - the compiler knows these are the only three possibilities. If you add a new tool to the sealed hierarchy, this switch will fail to compile until you handle it. Type safety for the win.

### The IO Class

Java 25 added `IO` to `java.base` as a cleaner alternative to `System.out`:

```java
IO.println("Goodbye!");
IO.print("\r" + animation[i % animation.length] + " Thinking...");
```


## The Basic Flow

Basically Gus is an agent that runs in a loop and can call user-defined tools if needed

1. [LangChain4j](https://github.com/langchain4j/langchain4j) for model abstraction.
2. `ChatService` sends it to the model with tool specifications
3. Model decides whether to respond directly or call a tool
4. If tools are called, Gus executes them and sends results back
5. Model uses tool results to generate final response
6. Response streams back to the user

The streaming response handler shows a thinking animation until the first token arrives, then displays the response as it generates.


## Tool System

Tools extend the sealed `Tools` class and use LangChain4j's `@Tool` annotation like so:

```java
public final class SearchWebTool extends Tools {
    @Tool("Searches the web for current information and returns relevant results")
    public String searchWeb(String query) {
        preToolHook("searchWeb", "query='" + query + "'");

        WebSearchEngine engine = TavilyWebSearchEngine.builder()
                .apiKey(apiKey)
                .build();

        WebSearchResults results = engine.search(query);
    }
}
```

The tool framework automatically generates the JSON schema that gets sent to the model. When the model wants to search the web, it returns a tool call request, and the ChatService executes the appropriate tool based on the sealed type.

## Building and Running

Gus uses Maven and jpackage to create a native executable:

```bash
mvn -Pcomplete clean package
```

This produces a native app bundle at `target/jpackage/gus.app`. I wrote about [getting jpackage to work with CrowdStrike](https://chad.cm/posts/2025-10-10-jpackage-crowdstrike-code-signing) in a previous post.

Then you can run it:

```bash
gus --openai  # Uses OpenAI's models
gus --ollama  # Uses local Ollama (default)
```

If you want to try it, [the code is on GitHub](https://github.com/carimura/gus).

```bash
❯ gus --ollama
-------------------------------------------------------------------
            ,
            |`-.__
            / ' _/
           ----\s
          /    }
         /  \\ /
     \\ /`   \\\\\\
      `\\    /_\\\\
       `~~~~~``~`

[Using provider ollama with model llama3.2]

Hi, I'm Gus, your friendly neighborhood AI CLI! How can I help today?

> What's the weather in San Francisco?

● searchWeb(query='weather San Francisco')

The current weather in San Francisco is partly cloudy with a temperature
of 62°F. Expect mild conditions throughout the day with a high of 68°F.

>
```

Boom.