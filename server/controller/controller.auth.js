const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const {groupModel, userModel} = require("../db/db.schema.js")

require("dotenv").config()

const postSignup = async (req, res) => {
	const username = req.body.username
	const pwd = req.body.pwd

	if(!username || !pwd){
		res.status(500).json({ error:"username or password don't have been succesfully sended"})
	}

	try{
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
  const [nameGroup, pwdGroup] = req.body.group;

  if(!pwdGroup || pwdGroup != String || !nameGroup){
    return res.status(500).json({ mensage:"Envie um group certo" })
  } 

  try{
		const salt = await bcrypt.genSalt(3) //genSalt needs to be 10 or 12(my hardware is not a big thing)
		const cryptedPwd = await bcrypt.hash(pwdGroup, salt)

    const groupDoc = userModel({
      name: nameGroup,
      password: cryptedPwd, 
    })

    await grouopDoc.save()
  } catch (err){
    return res.status(400).json({ error:`Some error happens: ${err}`})
  }
}

module.exports = { postSignup, getUser }
