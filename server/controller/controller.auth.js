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
const encrypting = async (pwd) => {
  const salt = await bcrypt.genSalt(3)
  const cryptedPwd = await bcrypt.hash(pwd, salt)
  return cryptedPwd
}
const saveOnDb = async (username, pwd, model, userId) => {
  const cryptedPwd = await encrypting(pwd)

  if(!userId){
    const doc = new model({
      name: username,
      password: cryptedPwd
    })

    await doc.save()
    return doc
  } else {
    const doc = new model({
      name: username,
      password: cryptedPwd      
      userIdAdmin: [userId],
      userId: [userId]
    })

    const docSalved = await doc.save()
    return docSalved;
  }
}

const userSignup = async (req, res) => { //POST
  const { username, pwd } = req.body

  if(!username || !pwd){
    return res.status(400).json({ error:"invalid"})  
  }

	try{
    const user = await saveOnDb(username, pwd, userModel)
    const jwtToken = createToken(user._id)

    res.cookie('jwtUser', jwtToken, { httpOnly: true, maxAge:maxAge})
    res.status(201).json({ user: user._id })
	} catch(err){
    console.error(`Error: ${err}`) //It is needed to make some methods on db schema to throw error which we can read and laed with it in a handle error function
    return res.status(400).json({ error: err})
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
      throw new Error("Id nao encontrado")
      return
    }

    const group = await saveOnDb(groupName, pwd, groupModel, userId)

    const jwtToken = createToken(group._id)
    res.cookie("jwtGroup", jwtToken, {httpOnly: true, maxAge:maxAge})
    res.status(201).json({ group: group._id})
  } catch(err){
    console.error(err)
    res.status(400).json( { error: err })
  }
}

module.exports = { userSignup, groupSignup }
