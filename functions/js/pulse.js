// First-party proxy for Plausible's script, served under a neutral name so
// ad-block filter lists (which match the vendor's domain) don't catch it.
const SCRIPT_UPSTREAM = "https://plausible.io/js/pa-vU14Sw_aOADuGxTWHD5b1.js";

export async function onRequestGet() {
    // Fresh outbound request (no incoming headers). Edge-cached for 6h;
    // browsers get an hour.
    const upstream = await fetch(SCRIPT_UPSTREAM, {
        cf: { cacheTtl: 21600, cacheEverything: true },
    });
    return new Response(upstream.body, {
        status: upstream.status,
        headers: {
            "Content-Type": upstream.headers.get("content-type") ?? "application/javascript",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
