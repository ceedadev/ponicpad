import index from "./index.html";

Bun.serve({
  routes: {
    "/": index,
    "/sw.js": () =>
      new Response(Bun.file("./public/sw.js"), {
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
          "Service-Worker-Allowed": "/",
        },
      }),
    "/manifest.webmanifest": () =>
      new Response(Bun.file("./public/manifest.webmanifest"), {
        headers: { "Content-Type": "application/manifest+json" },
      }),
    "/icon.svg": () =>
      new Response(Bun.file("./public/icon.svg"), {
        headers: { "Content-Type": "image/svg+xml" },
      }),
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("PonicPad running at http://localhost:3000");
