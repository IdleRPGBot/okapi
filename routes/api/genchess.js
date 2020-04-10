var router = require("express").Router();
const { createCanvas, Image } = require("canvas");

function loadImage(xml) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));

    img.src = xml;
  });
}

router.post("/", async (req, res) => {
  if (!("xml" in req.body)) {
    res
      .status(400)
      .send({ err: `xml is a required argument and is missing` });
  }
  loadImage(`data:image/svg+xml;charset=utf-8,${req.body.xml}`).then(function(img) {
    var canvas = createCanvas(400, 400);
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    var buffer = canvas.toBuffer("image/png");
    res.header("Content-Type", "image/png").status(200).send(buffer);
  });
});

module.exports = router;
