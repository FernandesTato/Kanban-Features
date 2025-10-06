const jwt = require("jsonwebtoken")
require("dotenv").config()

const middlewareJwtAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if(!token) return res.status(401).redirect("/login/user")
  try{
    jwt.verify(token, process.env.SECRET_KEY)
    req.user = {id: decode.id} //Is needed add role camp
    return next()
  }catch(err){
    console.error("JWT verify failed:", err.message)
    res.status(401).redirect("/login/user")
  }
}

module.exports = middlewareJwtAuth
