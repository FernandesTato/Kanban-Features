require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const {groupModel, userModel} = require("../db/db.schema.js")

const postSignup = async (req, res) => {
	try{
    const { username, pwd } = req.body

    if(!username || !pwd){
      res.status(500).json({ error:"username or password don't have been succesfully sended"})
    }

		const salt = await bcrypt.genSalt(3) //genSalt needs to be 10 or 12(my hardware is no a big thing)
		const cryptedPwd = await bcrypt.hash(pwd, salt)

		const userDoc = new userModel({
			name: username,
			password: cryptedPwd
		})
		await userDoc.save()
	} catch(err){
		console.log(err);
		return res.status(500).json({ error:"cant create User"})
	}

	res.status(200).json({ message:"message"})
}

const getUser = (req, res) => {
}

const creatGroup = async (req, res) => {
  try{
    const {groupName, groupPwd} = req.body.group;

    if(!groupPwd ||groupPwd != String || !groupName){
      return res.status(500).json({ mensage:"Envie um group certo" })
    } 

		const salt = await bcrypt.genSalt(3) //genSalt needs to be 10 or 12(my hardware is not a big thing)
		const cryptedPwd = await bcrypt.hash(groupPwd, salt)

    const groupDoc = userModel({
      name: groupName,
      password: cryptedPwd, 
    })

    await groupDoc.save()
  } catch (err){
    return res.status(400).json({ error:`Some error happens: ${err}`})
  }
}

module.exports = { postSignup, getUser }
