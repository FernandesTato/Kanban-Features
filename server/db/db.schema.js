const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
  name: String,
  password: String,
  userIdAdmin: [{ type: mongoose.schema.types.objectid, ref:"user"}],
  userId: [{ type: mongoose.schema.types.objectid, ref:"user"}],
  card: [ { type: mongoose.Schema.Types.ObjectId, ref:"Card"} ]
})

const cardSchema = new mongoose.Schema({
  title: String,
  text: String,
  date: Date,
  state: String,
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group"}
})

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    groupIds: [ { type: mongoose.Schema.Types.ObjectId, ref:"Group"}]
})

const groupModel = mongoose.model("Group", groupSchema)
const userModel = mongoose.model("User", userSchema)
const cardModel = mongoose.model("Card", cardSchema)

module.exports = { groupModel, userModel, cardModel}
