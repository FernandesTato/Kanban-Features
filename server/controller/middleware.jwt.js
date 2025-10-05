const jwt = require("jsonwebtoken")
require("dotenv").config()

const middlewareJwtAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if(token){
    jwt.verify(token, process.env.SECRE_KEY, (err, decodedToken) => {
      if(err){
        console.error(err.message)
        res.redirect('/login/user')
      } else {
        console.log(decodedToken)
        next()
      }
    })      
  } else {
    res.redirect("/login/user")
  }
}

module.exports = middlewareJwtAuth
