var router = require("express").Router();
const { createCanvas, Image } = require("canvas");
const fs = require("fs");

const download = require("./../../utils/download.js");

var data = fs.readFileSync("./assets/images/ProfileOverlayNew.png");
const foreground = new Image();
foreground.src = data;

function loadImage(data) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));

    img.src = data;
  });
}

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
  var data = await download.getData(req.body.url);
  loadImage(data).then(function(img) {
    ctx.drawImage(img, 0, 0, 800, 650);
    ctx.drawImage(foreground, 0, 0);
    const buffer = canvas.toDataURL("image/png");
    res
      .status(200)
      .send(buffer.split(",")[1]);
  });
});

module.exports = router;
