var router = require("express").Router();
const { registerFont, createCanvas, Image } = require("canvas");
const fs = require("fs");

const download = require("./../../utils/download.js");

registerFont("./assets/fonts/TravMedium.otf", { family: "TravMedium" });
registerFont("./assets/fonts/CaviarDreams.ttf", { family: "CaviarDreams" });
registerFont("./assets/fonts/OpenSansEmoji.ttf", { family: "OpenSansEmoji" });
registerFont("./assets/fonts/K Gothic.ttf", { family: "KGothic" });

function loadImageFromDisk(path) {
  const img = new Image();
  img.src = fs.readFileSync(path);
  return img;
}

// Dynamic Width (Build Regex)
const wrap = (s, w) =>
  s.replace(new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, "g"), "$1\n");

const defaultProfile = loadImageFromDisk("./assets/images/ProfileNew.png");
const classes = {
  thief: loadImageFromDisk("./assets/images/casts/thief.png"),
  paragon: loadImageFromDisk("./assets/images/casts/paragon.png"),
  ranger: loadImageFromDisk("./assets/images/casts/ranger.png"),
  warrior: loadImageFromDisk("./assets/images/casts/warrior.png"),
  mage: loadImageFromDisk("./assets/images/casts/mage.png"),
  raider: loadImageFromDisk("./assets/images/casts/raider.png"),
  ritualist: loadImageFromDisk("./assets/images/casts/ritualist.png"),
};

const races = {
  human: loadImageFromDisk("./assets/images/casts/human.png"),
  elf: loadImageFromDisk("./assets/images/casts/elf.png"),
  jikill: loadImageFromDisk("./assets/images/casts/jikill.png"),
  dwarf: loadImageFromDisk("./assets/images/casts/dwarf.png"),
  orc: loadImageFromDisk("./assets/images/casts/orc.png"),
};

const requiredParams = [
  "name",
  "image",
  "race",
  "color",
  "classes",
  "damage",
  "defense",
  "swordName",
  "shieldName",
  "level",
  "money",
  "god",
  "guild",
  "marriage",
  "pvpWins",
  "adventure",
  "icons",
];

function loadImage(data) {
  return new Promise((resolve, reject) => {
    if (data instanceof Image) resolve(data);
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));

    img.src = data;
  });
}

router.post("/", async (req, res) => {
  requiredParams.forEach((element) => {
    if (!(element in req.body)) {
      res
        .status(400)
        .send({ err: `${element} is a required argument and is missing` });
    }
  });
  const canvas = createCanvas(800, 650, "png");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = req.body.color;
  var data;
  if (req.body.image == "0") {
    data = defaultProfile;
  } else {
    data = await download.getData(req.body.image);
  }
  loadImage(data).then(function (img) {
    ctx.drawImage(img, 0, 0); /* TODO: decide to resize all profiles or not */
    ctx.font = "26px TravMedium, CaviarDreams, KGothic, OpenSansEmoji";
    ctx.fillText(req.body.name, 221, 161, 133);
    ctx.fillText(req.body.race, 228, 203, 133);
    ctx.font = "23px TravMedium, CaviarDreams, KGothic, OpenSansEmoji";
    ctx.fillText(req.body.classes.join("\n"), 228, 250, 133);
    ctx.font = "22px TravMedium, CaviarDreams, KGothic, OpenSansEmoji";
    ctx.fillText(req.body.damage, 111, 310, 101);
    ctx.fillText(req.body.defense, 111, 352, 101);
    ctx.fillText(req.body.level, 284, 310, 63);
    ctx.fillText("soon™", 284, 352, 63);
    if (req.body.swordName.length < 13) {
      ctx.font = "45px TravMedium, CaviarDreams, KGothic, OpenSansEmoji";
      ctx.fillText(wrap(req.body.swordName, 13), 165, 526, 194);
    } else {
      ctx.font = "19px TravMedium, CaviarDreams, KGothic, OpenSansEmoji";
      ctx.fillText(wrap(req.body.swordName, 13), 165, 506, 194);
    }
    if (req.body.shieldName.length < 13) {
      ctx.font = "45px TravMedium, CaviarDreams, KGothic, OpenSansEmoji";
      ctx.fillText(wrap(req.body.shieldName, 13), 165, 607, 194);
    } else {
      ctx.font = "19px TravMedium, CaviarDreams, KGothic, OpenSansEmoji";
      ctx.fillText(wrap(req.body.shieldName, 13), 165, 589, 194);
    }
    ctx.font = "52px TravMedium, CaviarDreams, KGothic, OpenSansEmoji";
    ctx.fillText(req.body.money, 519, 89, 252);
    ctx.fillText("soon™", 519, 161, 252);
    ctx.fillText(req.body.god, 519, 244, 252);
    ctx.fillText(req.body.guild, 519, 328, 252);
    ctx.fillText(req.body.marriage, 519, 414, 252);
    ctx.fillText(req.body.pvpWins, 519, 499, 252);
    if (req.body.adventure.split("\n").length == 2) {
      ctx.font = "34px TravMedium, CaviarDreams, KGothic, OpenSansEmoji";
      ctx.fillText(req.body.adventure, 519, 562, 252);
    } else {
      ctx.fillText(req.body.adventure, 519, 583, 252);
    }
    ctx.drawImage(races[req.body.race.toLowerCase()], 205, 184, 22, 22);
    if (req.body.icons[0] !== "none") {
      ctx.drawImage(classes[req.body.icons[0]], 205, 232, 22, 22);
    }
    if (req.body.icons[1] !== "none") {
      ctx.drawImage(classes[req.body.icons[1]], 205, 254, 22, 22);
    }
    const buffer = canvas.toBuffer("image/png");
    res.header("Content-Type", "image/png").status(200).send(buffer);
  });
});

module.exports = router;
