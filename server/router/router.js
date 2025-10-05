const express = require("express")
const { postCards } = require("../controller/controller.board.js")
const { userSignup, groupSignup } = require("../controller/controller.auth.js")
const router = express.Router()

router.post("/login/user", userSignup)
router.post("/login/group", groupSignup)

module.exports = router
