var router = require('express').Router()
const { createCanvas } = require('canvas')

router.get('/', (req, res) => {
  const canvas = createCanvas(200, 160, 'png')
  const ctx = canvas.getContext('2d')
  ctx.font = '22px Sans'
  ctx.fillText('Hello World', 44, 80)
  const buffer = canvas.toBuffer('image/png')
  res.header('Content-Type', 'image/png').status(200).send(buffer)
})

module.exports = router
