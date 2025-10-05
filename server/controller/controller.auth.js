require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { groupModel, userModel } = require("../db/db.schema.js")

const maxAge = 1 //just a random number for while

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRE_KEY, {
    experesIn:maxAge
  })
}
const encrypting = async (pwd) => {
  const salt = await bcrypt.genSalt(3)
  const cryptedPwd = await bcrypt.hash(pwd, salt)
  return cryptedPwd
}
const saveOnDb = async (username, pwd, model) => {
  if()
  const cryptedPwd = await encrypting(pwd)
  const doc = new model({
    name: username,
    password: cryptedPwd
  })
  doc.save()
  return doc
}

const userSignup = async (req, res) => {
  const { username, pwd } = req.body
	try{
    if(!username || !pwd){
      throw new Error("error on username or password")
    }

    const user = await saveOnDb(username, pwd, userModel)
    const jwtToken = createToken{user._id}

    res.cookie('jwt', token, { httpOnly: true, maxAge:maxAge})
    res.status(201).json({ user: user._id })
	} catch(err){
    console.error(`Error: ${err}`) //It is needed to make some methods on db schema to throw error which we can read and laed with it in a handle error function
    res.status(400).json({ error: err})
	}
	res.status(200).json({ message:"sigup was completed succesfully"})
}

const groupSignup = async (req, res) => {
  const { groupName, pwd } = req.body
  try{
    if(!groupName || !pwd){
      throw new Error("name or password is invalid")
    }
    const group = await saveOnDb(groupName, pwd, groupModel)
  } catch(err) {
    res.status(400).json({ error: err})
  }
}

module.exports = { userSignup, groupSignup }
