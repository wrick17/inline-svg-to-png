const express = require("express");
const { Resvg } = require("@resvg/resvg-js");

const app = express();

app.get("*", async (req, res) => {
  const url = req._parsedUrl.pathname.slice(1);

  const { height, width } = req.query;

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

  if (url.includes(".svg")) {
    const image = await (await fetch(url)).text();
    const resvg = new Resvg(image, config);
    const pngData = resvg.render();
    const png = pngData.asPng();

    res.set("Content-Type", "image/png");
    res.send(png);
  } else {
    res.status(403).send("");
  }
});

app.listen(5000);

