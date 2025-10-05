const jwt = require("jsonwebtoken")
require("dotenv").config()

const middlewareJwt = (req, res, next) => {
  try{
    const cookieJwt = req.cookies.token
    if(cookieJwt == undefined){
      

    }
  } catch(err){
    console.error("error em middlewareJwt: ", err)
    res.status(500).json({ error:err.message })
  }
  next()
}

module.exports = middlewarJwt 
