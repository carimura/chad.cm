// First-party proxy for Plausible's pageview beacon (the script tag in
// head.html points data-api here).
const EVENT_UPSTREAM = "https://plausible.io/api/event";

export async function onRequestPost({ request }) {
    // Only production reports — pages.dev previews and stage.chad.cm are
    // dropped so they never pollute the stats.
    if (new URL(request.url).hostname !== "chad.cm") {
        return new Response(null, { status: 202 });
    }
    // The client's UA + IP must travel upstream: Plausible hashes them into
    // its visitor id, and its bot filter silently drops events whose IP
    // looks like a server's.
    const headers = {
        "Content-Type": request.headers.get("content-type") ?? "text/plain",
    };
    const ua = request.headers.get("user-agent");
    if (ua) headers["User-Agent"] = ua;
    const ip = request.headers.get("cf-connecting-ip");
    if (ip) headers["X-Forwarded-For"] = ip;
    const upstream = await fetch(EVENT_UPSTREAM, {
        method: "POST",
        headers,
        body: await request.text(),
    });
    return new Response(upstream.body, { status: upstream.status });
}
