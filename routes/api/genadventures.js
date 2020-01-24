var router = require("express").Router();
const { registerFont, createCanvas, Image } = require("canvas");
const fs = require("fs");

registerFont("./assets/fonts/TravMedium.otf", { family: "TravMedium" });
registerFont("./assets/fonts/CaviarDreams.ttf", { family: "CaviarDreams" });
registerFont("./assets/fonts/OpenSansEmoji.ttf", { family: "OpenSansEmoji" });

function loadImageFromDisk(path) {
  const img = new Image();
  img.src = fs.readFileSync(path);
  return img;
}

var images = []
for (var i = 1; i < 31; i++) {
  images.push(loadImageFromDisk(`./assets/images/adventures/${i}.png`))
}

router.post("/", async (req, res) => {
  if (!("percentages" in req.body)) {
    res
      .status(400)
      .send({ err: `percentages is a required argument and is missing` });
  }
  var out = [];
  images.forEach(function(image, index) {
    var canvas;
    if (index > 9 && index < 20) {
        canvas = createCanvas(425, 220, "png");
    } else {
        canvas = createCanvas(410, 203, "png");
    }
    const ctx = canvas.getContext("2d");
    const percents = req.body.percentages[index];
    ctx.drawImage(image, 0, 0);
    ctx.font = "20px TravMedium, CaviarDreams, OpenSansEmoji";
    if (index > 9 && index < 20) {
      ctx.fillText(`${percents[0]}% to`, 314, 185, 100);
      ctx.fillText(`${percents[1]}%`, 314, 205, 100);
    } else {
      ctx.fillText(`${percents[0]}% to`, 314, 168, 100);
      ctx.fillText(`${percents[1]}%`, 314, 188, 100);
    }
    const buffer = canvas.toDataURL();
    out.push(buffer);
  });
  res.status(200).send(out);
});

module.exports = router;
