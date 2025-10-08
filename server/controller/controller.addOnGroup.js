const { groupModel, userModel } = require("../db/db.schema.js") 
const mongoose = require(mongoose)

const addUserOnGroup = async (req, res) => { //PATCH
  const userId = req.user.userId
  const groupId = req.user.groupId

  try{
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(groupId)) {
      throw new Error("userId ou groupId invalided")
    }

    await groupModel.updateOne({ _id:groupId }, { $push: {userId:userId}})
  } catch (err) {
    console.error("error: ", err.message)
    res.status(400).json({ error: err.message})
  }
}

