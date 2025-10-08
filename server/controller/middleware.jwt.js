const jwt = require("jsonwebtoken")
const { groupModel, userModel } = require("../db/db.schema.js")

require("dotenv").config()

const middlewareJwtAuth = (req, res, next) => {
  const token = req.cookies?.jwtUser

  if(!token) return res.status(401).redirect("/login/user")

  try{
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = req.user || {}
    req.user.userId = decoded.id//Is needed add role camp
    return next()
  }catch(err){
    console.error("JWT verify failed:", err.message)
    res.status(401).redirect("/login/user")
  }
}

const middlewareGroupJwt = (req, res, next) => {
  const token = req.cookies?.jwtGroup

  if(!token) return res.status(401).redirect("/")

  try{    
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = req.user || {}
    req.user.groupId = decoded.id

    return next()
  } catch(err){
    console.error("JWT verify failed", err.message)
    res.status().redirect("/")
  }
}

module.exports = middlewareJwtAuth, middlewareGroupJwt
