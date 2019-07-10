var router = require('express').Router()
const { registerFont, createCanvas, Image } = require('canvas')
const fs = require('fs')

const download = require('./../../utils/download.js')

registerFont('./assets/fonts/CaviarDreams.ttf', { 'family': 'CaviarDreams' })
registerFont('./assets/fonts/OpenSansEmoji.ttf', { 'family': 'OpenSansEmoji' })

function loadImageFromDisk (path) {
  const img = new Image()
  img.src = fs.readFileSync(path)
  return img
}

const defaultProfile = loadImageFromDisk('./assets/images/Profile.png')
const classes = {
  thief: loadImageFromDisk('./assets/images/casts/thief.png'),
  paragon: loadImageFromDisk('./assets/images/casts/paragon.png'),
  ranger: loadImageFromDisk('./assets/images/casts/ranger.png'),
  warrior: loadImageFromDisk('./assets/images/casts/warrior.png'),
  mage: loadImageFromDisk('./assets/images/casts/mage.png'),
  raider: loadImageFromDisk('./assets/images/casts/raider.png'),
  ritualist: loadImageFromDisk('./assets/images/casts/ritualist.png')
}

const requiredParams = [ 'name',
  'image',
  'color',
  'money',
  'pvpWins',
  'ecoRank',
  'rank',
  'level',
  'swordDamage',
  'shieldDamage',
  'swordName',
  'shieldName',
  'married',
  'guild',
  'class',
  'icon',
  'mission' ]

router.post('/', async (req, res) => {
  requiredParams.forEach(element => {
    if (!(element in req.body)) {
      res.status(400).send({ err: `${element} is a required argument and is missing` })
    }
  })
  const canvas = createCanvas(800, 600, 'png')
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = req.body.color
  switch (req.body.image) {
    case '0': ctx.drawImage(defaultProfile, 0, 0); break
    default:
      const img = new Image()
      img.src = await download.getData(req.body.image)
      ctx.drawImage(img, 0, 0/* , 800, 600 */) /* TODO: decide to resize all profiles or not */
      break
  }
  ctx.font = '34px CaviarDreams, OpenSansEmoji'
  ctx.fillText(req.body.name, 73, 51)
  ctx.fillText(req.body.money, 98, 352, 200)
  ctx.fillText(req.body.pvpWins, 98, 424)
  ctx.fillText(req.body.ecoRank, 265, 487, 110)
  ctx.fillText(req.body.rank, 425, 487, 140)
  ctx.font = '28px CaviarDreams, OpenSansEmoji'
  ctx.fillText(req.body.swordDamage, 611, 158, 147)
  ctx.fillText(req.body.shieldDamage, 611, 249, 147)
  ctx.font = '24px CaviarDreams, OpenSansEmoji'
  ctx.fillText(req.body.swordName, 81, 158, 390)
  ctx.fillText(req.body.shieldName, 81, 244, 390)
  ctx.fillText(req.body.married, 589, 371, 170)
  ctx.fillText(req.body.guild, 589, 464, 170)
  ctx.fillText(req.body.class, 127, 540, 650)
  ctx.fillText(req.body.mission, 264, 590.8, 510)
  ctx.fillStyle = '#000000'
  ctx.fillText(req.body.level, 744, 56, 48)
  if (req.body.icon != "none") {
    ctx.drawImage(classes[req.body.icon], 723, 506, 50, 50)
  }
  const buffer = canvas.toBuffer('image/png')
  res.header('Content-Type', 'image/png').status(200).send(buffer)
})

module.exports = router
