const { Admin } = require("mongodb")
const mongoose = require("mongoose")
require("dotenv").config()

const uri = process.env.DB_URI

const connectingToMongoDb = async () => {
    try {
        await mongoose.connect(uri)
    } catch(err) {
        return console.log(`error ${err}`)
    }
}

const groupSchema = new mongoose.Schema({
  userIds: [Number],
  name: String,
  password: String,
  card: [cardSchema],
  adminUserId: Number,
})

const cardSchema = new mongoose.Schema({
  title: String,
  text: String, 
  Date: Date,
  groupId: Number
})

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    groupIds: [Number],
    groupIdAdmin: Number
}) 

const groupModel = mongoose.model("Group", groupSchema)
const userModel = mongoose.model("User", userSchema)

module.exports = {usersModel, groupModel,  connectingToMongoDb}
