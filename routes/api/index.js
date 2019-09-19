var router = require("express").Router();

router.use("/test", require("./test"));
router.use("/genoverlay", require("./genoverlay"));
router.use("/genprofile", require("./genprofile"));
router.use("/genadventures", require("./genadventures"));
router.use("/imageops", require("./imageops"));

module.exports = router;
