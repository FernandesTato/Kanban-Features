require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const { groupModel, userModel } = require("../db/db.schema.js")

const maxAge = 1 //just a random number for while

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    experesIn:maxAge
  })
}

const saveOnDb = async (username, pwd, model, userId) => {
  try{
    const salt = await bcrypt.genSalt(3)
    const hasheedPwd = await bcrypt.hash(pwd, salt)

    if(!userId){
      const doc = new model({
        name: username,
        password: hashedPwd
      })
      const docSalved = await doc.save()
      return docSalved
    } else {
      const doc = new model({
        name: username,
        password: hashedPwd      
        userIdAdmin: [userId],
        userId: [userId]
      })
      const docSalved = await doc.save()
      return docSalved;
    }

  } catch(err){
    console.error("error: ", err.message)
  }
}

const userSignup = async (req, res) => { //POST
  const { username, pwd } = req.body

  if(!username || !pwd){
    return res.status(400).json({ error:"invalid"})  
  }
	try{
    const userDoc = await saveOnDb(username, pwd, userModel)
    const user = userDoc.toObject()
    const tokenJwt = createToken(user._id)

    res.cookie('jwt', tokenJwt, { httpOnly: true, maxAge:maxAge})
    return res.status(201).json({ user: user._id.toString() })
	} catch(err){
    console.error(`Error: ${err}`) //It is needed to make some methods on db schema to throw error which we can read and laed with it in a handle error function
    return res.status(400).json({ error: err.message})
	}
}

const groupSignup = async (req, res) => { //POST
  const { groupName, pwd } = req.body
  const tokenId = req.user.userid  

  if(!groupName || !pwd){
    return res.status(400).json({ error:"name or passoword is invalid"})
  }
  if(!tokenId){
    return res.status(401).json({ error:"No token provided"})
  } 
  try{
    const userId = await userModel.findById(tokenId)
    if(mongoose.Types.ObjectId.isValid(userId)){
      res.status(400).json({ error: "Id no valid"})      
    }
    const group = await saveOnDb(groupName, pwd, groupModel, userId)
    return res.status(201).json({ group: group._id})
  } catch(err){
    console.error(err)
    res.status(400).json( { error: err })
  }
}

const userSigIn = (req, res) => {
  const { username, pwd } = req.body
  if(!username || !pwd) {
    return res.status(400).json({ error: "empty name or password"})
  }  
  try{
    const user = await userModel.findOne({ name: username}).select('+password').lean()
    if(!user){
      return res.status(400).json({ error: "Invalid Credentials"})
    }
    const match = await bcrypt.compare(pwd, user.password)
    if(!match){
      return res.status(400).json({ error: "Invalid credentials"})
    }
    const tokenJwt = createToken(user._id)

    res.cookie('jwt', tokenJwt, { httpOnly: true, maxAge:maxAge})
    return res.status(201).json({ user: user._id.toString() })
  } catch(err) {
    console.erro("error:", err.message)
    res.status(400).json({ error: err.message })
  }
}

const groupSigIn = async (req, res) => {
  const { groupName, groupPwd } = req.body
  const userId = req.user?.userId

  if(!grouName || !groupPwd) {
    return res.status(400).json({ error: "empty name or password"})
  }
  if(!userId){
    return res.status(401).json({ error: "Unathorized"})
  }
  try{
    const group = await groupModel.findOne({ name: groupName}).select('+password').lean()
    if(!group){ 
      return res.status(400).json({ error:"Invalid credentials"})
    }
    const match = await bcrypt.compare(grouPwd, group.password)//achar uma forma de pegar somente a senha q tá hasheada e dps de descubrir isso fazer a mesma coisa pra listuser
    if(!match){
      return res.status(400).json({ error: "Invalid credentials"})
    }

    await Promise.all([
      groupModel.updateOne({ _id:group._id }, { $push: {userId:userId}})
      userModel.updateOne({_id:userId}, { $push: {groupIds: groupId}})
    ])
    return res.status(200).json({message:"Login sucessful", groupId: group._id.toString()})
  } catch(err) {
    console.error("error:", err.message)
    res.status(500).json({ error: err.message})
  }
}



module.exports = { userSignup, groupSignup }
