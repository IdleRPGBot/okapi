var router = require('express').Router()
const { createCanvas, Image } = require('canvas')
const fs = require('fs')

const download = require('./../../utils/download.js')

var data = fs.readFileSync('./assets/images/Foreground.png')
const foreground = new Image()
foreground.src = data
data = fs.readFileSync('./assets/images/Foreground2.png')
const foreground2 = new Image()
foreground2.src = data

router.post('/:id', async (req, res) => {
  if (!(req.params.id > 0 < 2)) {
    res.status(400).send({ err: 'The valid ids are 1, 2' })
    return
  }
  if (!req.body.url) {
    res.status(400).send({
      err:
        'You must provide a source url + make sure to set the Content-Type header to application/json'
    })
    return
  }
  const canvas = createCanvas(800, 600, 'png')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  try {
    img.src = await download.getData(req.body.url)
    ctx.drawImage(img, 0, 0, 800, 600)
  } catch (error) {
    res.status(400).send({ err: error.toString() })
    return
  }
  ctx.drawImage(img, 0, 0, 800, 600)
  switch (req.params.id) {
    case '1':
      ctx.drawImage(foreground, 0, 0)
      break
    case '2':
      ctx.drawImage(foreground2, 0, 0)
      break
  }
  const buffer = canvas.toBuffer('image/png')
  res
    .header('Content-Type', 'image/png')
    .status(200)
    .send(buffer)
})

module.exports = router
