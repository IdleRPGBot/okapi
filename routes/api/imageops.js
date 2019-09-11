var router = require("express").Router();
const { createCanvas, Image } = require("canvas");
const { Sobel } = require("sobel");
const sharp = require("sharp");
const download = require("./../../utils/download.js");

router.post("/pixel", async (req, res) => {
  if (!("image" in req.body) || !("size" in req.body)) {
    res
      .status(400)
      .send({ err: `image is a required argument and is missing` });
  }
  sharp(await download.getData(req.body.image))
    .resize({ width: req.body.size, height: req.body.size })
    .png()
    .toBuffer()
    .then(function(buffer) {
      res
        .header("Content-Type", "image/png")
        .status(200)
        .send(buffer);
    });
});

router.post("/invert", async (req, res) => {
  if (!("image" in req.body)) {
    res.status(400).send({ err: `image is a required argument and missing` });
  }
  const canvas = createCanvas();
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = await download.getData(req.body.image);
  ctx.drawImage(img, 0, 0);
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.globalCompositeOperation = "difference";
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const buffer = canvas.toBuffer("image/png");
  res
    .header("Content-Type", "image/png")
    .status(200)
    .send(buffer);
});

router.post("/edges", async (req, res) => {
  if (!("image" in req.body)) {
    res
      .status(400)
      .send({ err: `image is a required argument and is missing` });
  }
  const canvas = createCanvas();
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.src = await download.getData(req.body.image);
  ctx.drawImage(image, 0, 0);
  canvas.width = image.width;
  canvas.height = image.height;
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var sobelData = Sobel(imageData);
  var sobelImageData = sobelData.toImageData();
  ctx.putImageData(sobelImageData, 0, 0);
  const buffer = canvas.toBuffer("image/png");
  res
    .header("Content-Type", "image/png")
    .status(200)
    .send(buffer);
});

router.post("/oil", async (req, res) => {
  if (!("image" in req.body)) {
    res
      .status(400)
      .send({ err: `image is a required argument and is missing` });
  }
  const canvas = createCanvas(),
    ctx = canvas.getContext("2d"),
    img = new Image();
  img.src = await download.getData(req.body.image);
  ctx.drawImage(img, 0, 0);
  canvas.width = img.width;
  canvas.height = img.height;
  var radius = 4,
    intensity = 55,
    width = canvas.width,
    height = canvas.height,
    imgData = ctx.getImageData(0, 0, width, height),
    pixData = imgData.data,
    destCanvas = createCanvas(),
    dCtx = destCanvas.getContext("2d"),
    pixelIntensityCount = [];

  destCanvas.width = width;
  destCanvas.height = height;

  var destImageData = dCtx.createImageData(width, height),
    destPixData = destImageData.data,
    intensityLUT = [],
    rgbLUT = [];

  for (var y = 0; y < height; y++) {
    intensityLUT[y] = [];
    rgbLUT[y] = [];
    for (var x = 0; x < width; x++) {
      var idx = (y * width + x) * 4,
        r = pixData[idx],
        g = pixData[idx + 1],
        b = pixData[idx + 2],
        avg = (r + g + b) / 3;

      intensityLUT[y][x] = Math.round((avg * intensity) / 255);
      rgbLUT[y][x] = {
        r: r,
        g: g,
        b: b
      };
    }
  }

  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      pixelIntensityCount = [];

      // Find intensities of nearest pixels within radius.
      for (var yy = -radius; yy <= radius; yy++) {
        for (var xx = -radius; xx <= radius; xx++) {
          if (y + yy > 0 && y + yy < height && x + xx > 0 && x + xx < width) {
            var intensityVal = intensityLUT[y + yy][x + xx];

            if (!pixelIntensityCount[intensityVal]) {
              pixelIntensityCount[intensityVal] = {
                val: 1,
                r: rgbLUT[y + yy][x + xx].r,
                g: rgbLUT[y + yy][x + xx].g,
                b: rgbLUT[y + yy][x + xx].b
              };
            } else {
              pixelIntensityCount[intensityVal].val++;
              pixelIntensityCount[intensityVal].r += rgbLUT[y + yy][x + xx].r;
              pixelIntensityCount[intensityVal].g += rgbLUT[y + yy][x + xx].g;
              pixelIntensityCount[intensityVal].b += rgbLUT[y + yy][x + xx].b;
            }
          }
        }
      }

      pixelIntensityCount.sort(function(a, b) {
        return b.val - a.val;
      });

      var curMax = pixelIntensityCount[0].val,
        dIdx = (y * width + x) * 4;

      destPixData[dIdx] = ~~(pixelIntensityCount[0].r / curMax);
      destPixData[dIdx + 1] = ~~(pixelIntensityCount[0].g / curMax);
      destPixData[dIdx + 2] = ~~(pixelIntensityCount[0].b / curMax);
      destPixData[dIdx + 3] = 255;
    }
  }

  // change this to ctx to instead put the data on the original canvas
  ctx.putImageData(destImageData, 0, 0);
  const buffer = canvas.toBuffer("image/png");
  res
    .header("Content-Type", "image/png")
    .status(200)
    .send(buffer);
});

module.exports = router;
