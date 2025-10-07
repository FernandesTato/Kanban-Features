const { groupModel, userModel } = require("../db/db.schema.js") 
const mongoose = require(mongoose)

const addUserOnGroup = async (req, res) => {
  //userId => primerio faz find no userModel pra retornar um ObjectId depois isso adiciona no userId e se vier assim adicionar a userIdAdmin
  //Como pegar o id do group? Simples é mais facil passar esse o id do group como e passa-lo via o middleware
  const userId = req.user.userId
  const groupId = req.user.groupId

  try{
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(groupId)) {
      throw new Error("userId ou groupId invalided")
    }

    const maybe = await groupModel.updateOne({ _id:groupId }, { $push: {userId:userId}})
  } catch (err) {
    console.error("error: ", err.message)
    res.status(400).json({ error: err.message})
  }
}

