var router = require("express").Router();
const { createCanvas, Image } = require("canvas");
const fs = require("fs");

const download = require("./../../utils/download.js");

var data = fs.readFileSync("./assets/images/ProfileOverlayNew.png");
const foreground = new Image();
foreground.src = data;

router.post("/", async (req, res) => {
  if (!req.body.url) {
    res.status(400).send({
      err:
        "You must provide a source url + make sure to set the Content-Type header to application/json"
    });
    return;
  }
  const canvas = createCanvas(800, 650, "png");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  try {
    img.src = await download.getData(req.body.url);
    ctx.drawImage(img, 0, 0, 800, 650);
  } catch (error) {
    res.status(400).send({ err: error.toString() });
    return;
  }
  ctx.drawImage(foreground, 0, 0);
  const buffer = canvas.toBuffer("image/png");
  res
    .header("Content-Type", "image/png")
    .status(200)
    .send(buffer);
});

module.exports = router;
