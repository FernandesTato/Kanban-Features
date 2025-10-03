const jwt = require("jsonwebtoken")
require("dotenv").config()

const middlewareJwt = (req, res, next) => {
    next()
}

module.exports = { middlewarJwt }