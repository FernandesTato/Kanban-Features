const express = require("express")
const router = express.Router()

const {userSignup, groupSignup, userSigIn, groupSigIn} = require("../controller/controller.auth.js")
const {createCard, updatingCard} = require("../controller/controller.board.js")
const {middlewareJwtAuth, userIdExistInGroup}= require("../controller/middleware.jwt.js")

const listUser = require("../controller/controller.addOnGroup.js")

router.post("/signup/user", userSignup)
router.post("/signup/group", middlewareJwtAuth, groupSignup)
router.post("/login/user", userSigIn)
router.post("/login/gruop", middlewareJwtAuth, groupSigIn)
router.post("/board/createCard", middlewareJwtAuth, userIdExistInGroup, createCard)

router.patch("/board/updateCard", middlewareJwtAuth, userIdExistInGroup, updatingCard)

router.get("/user", middlewareJwtAuth, listUser)

module.exports = router
