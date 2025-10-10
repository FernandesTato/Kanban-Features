const { groupModel, userModel } = require("../db/db.schema.js") 
const mongoose = require(mongoose)

const listUser = async(req, res) => {
  const userId = req.user.userId
  if(!userId){
    return res.status(400).json({ error: "jwt token broke"})
  }
  try{
    const user = await userModel.findById(userId).lean()
    if(!user){
      return res.status(401).json({ error: "User don't exist"})
    }
    res.status(200).json({ user: user})
  } catch(err){
    console.error(err.message)
    res.status(400).json({ error: err.message})
  }
}

module.exports = listUser
