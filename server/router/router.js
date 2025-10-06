const express = require("express")
const router = express.Router()
const { userSignup, groupSignup } = require("../controller/controller.auth.js")
const middlewareJwt = require("../controller/middleware.jwt.js")

router.post("/login/user", userSignup)
router.post("/login/group", middlewareJwt, groupSignup)

module.exports = router
