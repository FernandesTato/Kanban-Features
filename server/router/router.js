const express = require("express")
const { postCards } = require("../controller/controller.board.js")
const router = express.Router()

router.post("/board", postCards)

module.exports = router



