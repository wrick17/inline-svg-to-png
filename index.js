const { URL } = require("url");
const { Resvg } = require("@resvg/resvg-js");

const server = Bun.serve({
  port: 5000,
  async fetch(req) {
    const urlObj = URL.parse(req.url);

    // const start = performance.now();
    const url = urlObj.pathname.slice(1);

    if (url.includes(".svg")) {
      const height = Number(urlObj.searchParams.get("height") || "0");
      const width = Number(urlObj.searchParams.get("width") || "0");

      const config = {};
      if (height) {
        config.fitTo = {
          mode: "height",
          value: Number(height),
        };
      } else if (width) {
        config.fitTo = {
          mode: "width",
          value: Number(width),
        };
      }

      // console.log("Starting: ", performance.now() - start, "ms");
      const image = await (await fetch(url)).text();
      // console.log("Image Fetched: ", performance.now() - start, "ms");
      const resvg = new Resvg(image, config);
      const pngData = resvg.render();
      const png = pngData.asPng();

      // console.log("Total: ", performance.now() - start, "ms");
      return Response(png, {
        headers: {
          "Content-Type": "image/png",
        },
      });
    } else {
      return Response("", {
        status: 403,
      });
    }
  },
});

console.log(`Listening on localhost:${server.port}`);

