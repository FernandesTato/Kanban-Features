const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const { groupModel, userModel } = require("../db/db.schema.js")


require("dotenv").config()

const middlewareJwtAuth = (req, res, next) => {
  const token = req.cookies?.jwtUser
  if(!token) return res.status(401).redirect("/login/user")
  try{
    const payload = jwt.verify(token, process.env.SECRET_KEY)
    req.user = req.user || {}
    req.user.id = payload.id//Is needed add role camp
    return next()
  }catch(err){
    console.error("JWT verify failed:", err.message)
    res.status(401).redirect("/login/user")
  }
}
const userIdExistInGroup = async (req, res, next) => {
  const userId = req.user?.id
  const groupId = req.params.id

  if(!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid Id"})
  }
  if(!groupId || !userId) {
    return res.status(400).json({ error: "group of id not passed"})
  }
  try{
    const groupPromise = groupModel.findOne({userId: userId}).lean()
    const userPromise = userModel.findById({_id: userId}).lean()    
    const [groupDoc, userDoc] = await Promise.all([groupPromise, userPromise]) 

    if (!userDoc) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    if (!groupDoc) {
      return res.status(404).json({ error: 'Grupo não encontrado ou usuário não é membro' });
    }

    req.user.id = userDoc._id.toString()
    req.group = groupDoc
    return next()
  } catch(err){
    console.error("error: ", err.message)
    res.redirect("/")
  }
}

module.exports = { middlewareJwtAuth, userIdExistInGroup }
