var router = require('express').Router()

router.use('/test', require('./test'))
router.use('/genoverlay', require('./genoverlay'))
router.use('/genprofile', require('./genprofile'))
router.use('/genadventures', require('./genadventures'))

module.exports = router
