require("dotenv").config()
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const { groupModel, userModel } = require("../db/db.schema.js")

const COOKIE_NAME = "jwt"
const JWT_SECRET = process.env.SECRET_KEY

const middlewareJwtAuth = (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME]
  if(!token) {  
    return res.status(401).redirect("/login/user")
  }
  try{
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = req.user || {}
    req.user.id = String(payload.id)
    return next()
  }catch(err){
    console.error("JWT verify failed:", err.message)
    return res.status(401).redirect("/login/user")
  }
}

const userIdExistInGroup = async (req, res, next) => {
  const userId = req.user?.id
  const groupId = req.params.id

  if(!groupId || !userId) {
    return res.status(400).json({ error: "group of id is missing"})
  }
  if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ error: "Invalid Id"})
  }
  try{
    const userDoc = await userModel.findById(userId).select('_id').lean()
    if (!userDoc) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    const groupDoc = await groupModel
      .findOne({_id: groupId, userId: mongoose.Types.ObjectId(userId) })
      .select("_id name userId userIdAdmin")
      .lean()

    if(!groupDoc){
      return res.status(403).json({ error: "User is not a member"})
    }

    req.user.id = String(userDoc._id)    
    req.group = groupDoc
    return next()
  } catch(err){
    console.error("error: ", err.message)
    return res.status(500).redirect("/")
  }
}

module.exports = { middlewareJwtAuth, userIdExistInGroup }
