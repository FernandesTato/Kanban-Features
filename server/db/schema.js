const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
  userIds: [Number],
  name: String,
  password: String,
  card: [{ mongoose.Schema.Types.ObjectId, ref:"Card"}],  
})

const cardSchema = new mongoose.Schema({
  title: String,
  text: String,
  Date: Date,
})

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    groupIds: [Number],
}) 

const groupModel = mongoose.model("Group", groupSchema)
const userModel = mongoose.model("User", userSchema)
const cardModel = mongoose.model("Card", cardModel)

module.exports = { groupModel, userModel, cardModel}

