require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
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
      userId: [userId],
      name: username,
      password: cryptedPwd      
    })

    await doc.save()
    return doc
  }
}
const userSignup = async (req, res) => {
  const { username, pwd } = req.body

  if(!username || !pwd){
    return res.status(400).json({ error:"invalid"})  
  }

	try{
    const user = await saveOnDb(username, pwd, userModel)
    const jwtToken = createToken(user._id)

    res.cookie('jwt', token, { httpOnly: true, maxAge:maxAge})
    res.status(201).json({ user: user._id })
	} catch(err){
    console.error(`Error: ${err}`) //It is needed to make some methods on db schema to throw error which we can read and laed with it in a handle error function
    return res.status(400).json({ error: err})
	}
}
const groupSignup = async (req, res) => {
  const { groupName, pwd } = req.body
  const tokenId = req.user.id
  
  if(!groupName || !pwd){
    return res.status(400).json({ error:"name or passoword is invalid"})
  }

  if(!tokenId){
    return res.status(401).json({ error:"No token provided"})
  } 

  try{
    const userId = await userModel.findById(tokenId)
    await saveOnDb(groupName, pwd, groupModel, userId)
  } catch(err){
    console.error(err)
    res.status(400).json(Error: err)
  }
}

module.exports = { userSignup, groupSignup }
